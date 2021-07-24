import { ObjectId } from "mongodb";
import authMiddleware from "../../../middlewares/authMiddleware";
import cors from '../../../middlewares/cors'
import connect from '../../../utils/database'

export default async function user(req, res) {
  await cors(req, res)
  await authMiddleware(req, res)

  if(req.method === 'GET') {
    const {db, client} = await connect()

    try {
      let user = await db.collection('users')
      .findOne({_id: ObjectId(req.userId) })

      user.password = undefined
      
      if(!!user) {
        return res.status(200).json( user )
      }else {
        return res.status(400).json({ error: 'Ocorreu um erro, tente novamente.' })
      }

    } catch (error) {
      return res.status(400).json({ error: 'Ocorreu um erro, tente novamente.' })
    }finally {
      await client.close()
    }

  }else {
    res.status(400).json({error: 'Método de request incorreto'})
  }
}