import authMiddleware from "../../../middlewares/authMiddleware";
import cors from '../../../middlewares/cors'
import connect from '../../../utils/database'

export default async function deletePoint(req, res) {
  await cors(req, res)
  await authMiddleware(req, res)

  if(req.userPermission !== 'FULL') {
    return res.status(401).json({error: 'Você não está autorizado'})
  }

  if(req.method === 'DELETE') {
    let data = req.body
    const {db} = await connect()
    try {
      const response = await db.collection('points').deleteOne({id: data.id})
      
      if(response.deletedCount == 1) {
        return res.status(200).json({message: 'Ponto deletado com sucesso'})
      } 

    } catch (error) {
      console.log(error)
      return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
    }
  }else {
    res.status(400).json({error: 'Método de request incorreto'})
  }
}