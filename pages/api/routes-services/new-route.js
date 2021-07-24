import authMiddleware from "../../../middlewares/authMiddleware";
import cors from '../../../middlewares/cors'
import connect from '../../../utils/database'
import { ObjectId } from "mongodb";

export default async function newRoute(req, res) {
  await cors(req, res)
  await authMiddleware(req, res)

  if(req.userPermission !== 'FULL') {
    return res.status(401).json({error: 'Usuário não autorizado'})
  }

  if(req.method === 'POST') {
    let data = req.body
    data.date = new Date()
    const {db, client} = await connect()

    try {
      const createResponse = await db.collection(`${req.userNameInDb}${req.userId}`)
      .insertOne(data)

      if(!!createResponse.ops[0]) {
        return res.status(200).json(createResponse.ops[0])
      }else {
        return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
      }

    } catch (error) {
      return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
    }finally {
      await client.close()
    }

  }else {
    res.status(400).json({error: 'Método de request incorreto'})
  }
}