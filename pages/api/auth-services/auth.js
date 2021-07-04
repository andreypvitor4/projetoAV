import bcrypt from 'bcryptjs'
import cors from '../../../middlewares/cors'
import generateToken from '../../../utils/generateToken'
import connect from '../../../utils/database'

async function auth(req, res) {
  await cors(req, res)

  if(req.method === 'POST') {
    const { email, password } = req.body
    const { db } = await connect()

    try {
      const user = await db.collection('users').findOne({ email })
      if(!user) {
        return res.status(400).json({error: 'Usuário não existe'})
      }

      if(!(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({error: 'Senha incorreta'})
      }

      user.password = undefined
      return res.status(200).json({
        user,
        token: generateToken({
          id: user._id,
          permission: user.permission
        })
      })

    } catch (error) {
      return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
    }
    
  }else{
    res.status(400).json({error: 'Método de request incorreto'})
  }
}

export default auth