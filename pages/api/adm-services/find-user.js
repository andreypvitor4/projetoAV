import cors from '../../../middlewares/cors'
import authMiddleware from "../../../middlewares/authMiddleware";
import connect from '../../../utils/database'

async function FindUser(req, res) {
  await cors(req, res)
  await authMiddleware(req, res)

  if(req.method === 'GET') {
    const { key, value } = req.query
    const { db, client } = await connect()

    try {
      let dbQuery = value != Number(value)? new RegExp(value, 'i'): Number(value)

      let response
      if(key == 'gt') {
        response = await db.collection('users')
        .find({ rCount: { $gt: dbQuery } }).project({password: 0})
      }
      else if(key == 'lt') {
        response = await db.collection('users')
        .find({ rCount: {$lt: dbQuery} }).project({password: 0})
      }
      else {
        response = await db.collection('users')
        .find({ [key]: dbQuery }).project({password: 0})
      }
      

      const user = await response.toArray()

      await client.close()

      if(!!user) {
        return res.status(200).json(user)
      }else {
        return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
      }

    } catch (error) {
      console.log(error)
      return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
    }
    
  }else{
    res.status(400).json({error: 'Método de request incorreto'})
  }
}

export default FindUser