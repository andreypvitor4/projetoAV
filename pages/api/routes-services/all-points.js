import authMiddleware from "../../../middlewares/authMiddleware";
import cors from '../../../middlewares/cors'
import connect from '../../../utils/database'

export default async function allpoints(req, res) {
  await cors(req, res)
  await authMiddleware(req, res)

  if(req.userPermission !== 'FULL') {
    return res.status(401).json({error: 'Você não está autorizado'})
  }

  if(req.method === 'GET') {
    try {
      const {db} = await connect()
      
      const response = await db.collection('points').find()
      const items = await response.toArray()

      if(!!items) {
        return res.status(200).json(items)
      }

    } catch (error) {
      console.log(error)
      return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
    }
  }else {
    return res.status(400).json({error: 'Método de request incorreto'})
  }
}