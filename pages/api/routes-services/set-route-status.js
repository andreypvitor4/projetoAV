import { ObjectId } from "mongodb";
import authMiddleware from "../../../middlewares/authMiddleware";
import cors from '../../../middlewares/cors'
import connect from '../../../utils/database'

export default async function setRouteStatus(req, res) {
  await cors(req, res)
  await authMiddleware(req, res)

  if(req.userPermission !== 'FULL') {
    return res.status(401).json({error: 'Você não está autorizado'})
  }

  if(req.method === 'PUT') {
    let query = req.query
    const {db, client} = await connect()

    try {
      const response = await db.collection(`${req.userNameInDb}${req.userId}`)
      .updateOne({_id: ObjectId(query.routeId)}, {
        $set: {
          routeStatus: 'pronta'
        }
      })
      
      if(response.result.ok == 1) {
        return res.status(200).json({message: 'rota atualizada com sucesso'})
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