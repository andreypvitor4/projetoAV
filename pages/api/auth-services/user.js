import { ObjectId } from "mongodb";
import authMiddleware from "../../../middlewares/authMiddleware";
import cors from '../../../middlewares/cors'
import connect from '../../../utils/database'

export default async function allpoints(req, res) {
  await cors(req, res)
  await authMiddleware(req, res)

  if(req.method === 'GET') {
    try {
      const {db, client} = await connect()
      let user = await db.collection('users')
      .findOne({_id: ObjectId(req.userId) })

      user.password = undefined
      
      await client.close()
      if(!!user) {
        return res.status(200).json({ user })
      }

    } catch (error) {
      console.log(error)
      res.status(400).json({ error: 'Ocorreu um erro, tente novamente.' })
    }
  }else {
    res.status(400).json({error: 'Método de request incorreto'})
  }
}