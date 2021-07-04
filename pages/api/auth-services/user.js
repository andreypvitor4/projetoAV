import { ObjectId } from "mongodb";
import authMiddleware from "../../../middlewares/authMiddleware";
import cors from '../../../middlewares/cors'
import connect from '../../../utils/database'

export default async function allpoints(req, res) {
  await cors(req, res)
  await authMiddleware(req, res)

  if(req.method === 'GET') {
    try {
      const {db} = await connect()
      const user = await db.collection('users').findOne({_id: ObjectId(req.userId) })
      if(!!user) return res.status(200).json({ user })

    } catch (error) {
      res.status(400).json({ error: 'Ocorreu um erro, tente novamente.' })
    }
  }else {
    res.status(400).json({error: 'Método de request incorreto'})
  }
}