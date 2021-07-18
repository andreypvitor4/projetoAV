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
      const data = req.query
      const {db, client} = await connect()
  
      const response = await db.collection(`${req.userNameInDb}${req.userId}`)
      .findOne({routeName: data.routeName})
      await client.close()

      if(!!response) {
        return res.status(200).json(response.points)
      }else {
        return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
      }

    } catch (error) {
      console.log(error)
      return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
    }
  }else {
    return res.status(400).json({error: 'Método de request incorreto'})
  }
}