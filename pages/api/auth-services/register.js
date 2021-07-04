import bcrypt from 'bcryptjs'
import cors from '../../../middlewares/cors'
import connect from '../../../utils/database'
import generateToken from '../../../utils/generateToken'

async function register(req, res) {
  await cors(req, res)

  if(req.method === 'POST') {
    const { email, password } = req.body
    const {db} = await connect()

    try {
      const user = await db.collection('users').findOne({ email })
      if(user) {
        return res.status(400).json({error: 'Este email já existe'})
      }

      const passwordHash = await bcrypt.hash(password, 10)
      req.body.password = passwordHash
      req.body.permission = 'NONE'
      req.body.routes = []

      const newUser = await db.collection('users').insertOne(req.body)
      if(!!newUser.ops[0]) {
        return res.status(200).json({
          token: generateToken({id: newUser.ops[0]._id})
        })
      }

    } catch (error) {
      return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
    }
  }else{
    return res.status(400).json({error: 'Método de request incorreto'})
  }
}

export default register