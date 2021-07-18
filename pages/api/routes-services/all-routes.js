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
      const {db, client} = await connect()
  
      const response = await db.collection(`${req.userNameInDb}${req.userId}`)
      .find({}).project({points: 0})

      const routes = await response.toArray()
      await client.close()

      if(!!routes) {
        return res.status(200).json(routes)
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