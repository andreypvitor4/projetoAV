import authMiddleware from "../../../middlewares/authMiddleware";
import cors from '../../../middlewares/cors'
import connect from '../../../utils/database'
import { ObjectId } from "mongodb";

export default async function savePoint(req, res) {
  await cors(req, res)
  await authMiddleware(req, res)

  if(req.userPermission !== 'FULL') {
    return res.status(401).json({error: 'Usuário não autorizado'})
  }

  if(req.method === 'POST') {
    const data = req.body
    const {db} = await connect()

    try {
      const updateResponse = await db.collection('users').updateOne({_id: ObjectId(req.userId) }, {
        $addToSet: {
          routes: {
            name: req.body.routeName,
            description: req.body.routeDescription,
          }
        }
      })

      const createResponse = await db.createCollection(data.routeName)

      if(!!createResponse && updateResponse.result.ok == 1) {
        return res.status(200).json({message: 'cadastrado com sucesso.'})
      }

    } catch (error) {
      console.log(error)
      return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
    }

  }else {
    res.status(400).json({error: 'Método de request incorreto'})
  }
}