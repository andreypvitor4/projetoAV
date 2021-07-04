import authMiddleware from "../../../middlewares/authMiddleware";
import cors from '../../../middlewares/cors'
import connect from '../../../utils/database'

export default async function updatePoint(req, res) {
  await cors(req, res)
  await authMiddleware(req, res)

  if(req.userPermission !== 'FULL') {
    return res.status(401).json({error: 'Você não está autorizado'})
  }

  if(req.method === 'PUT') {
    let data = req.body
    delete data._id
    const {db} = await connect()
    try {
      const response = await db.collection('points')
      .findOneAndReplace({id: data.id}, data)

      if(!!response.value) {
        return res.status(200).json({message: 'Ponto alterado com sucesso'})
      }

    } catch (error) {
      return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
    }
  }else {
    return res.status(400).json({error: 'Método de request incorreto'})
  }
}