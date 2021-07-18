import authMiddleware from "../../../middlewares/authMiddleware";
import cors from '../../../middlewares/cors'
import connect from '../../../utils/database'

export default async function deletePoint(req, res) {
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
      .updateOne({routeName: query.routeName}, {
        $set: {
          routeStatus: 'pronta'
        }
      })
      await client.close()
      
      if(response.result.ok == 1) {
        return res.status(200).json({message: 'Ponto deletado com sucesso'})
      }else {
        return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
      }

    } catch (error) {
      console.log(error)
      return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
    }
  }else {
    res.status(400).json({error: 'Método de request incorreto'})
  }
}