import authMiddleware from "../../../middlewares/authMiddleware";
import cors from '../../../middlewares/cors'
import connect from '../../../utils/database'

export default async function allRoutes(req, res) {
  await cors(req, res)
  await authMiddleware(req, res)

  if(req.userPermission !== 'FULL') {
    return res.status(401).json({error: 'Você não está autorizado'})
  }

  if(req.method === 'GET') {
    const {db, client} = await connect()
    
    try {
      const response = await db.collection(`${req.userNameInDb}${req.userId}`)
      .find({}).project({points: 0})

      const routes = await response.toArray()

      if(!!routes) {
        return res.status(200).json(routes)
      }else {
        return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
      }

    } catch (error) {
      return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
    }finally {
      await client.close()
    }

  }else {
    return res.status(400).json({error: 'Método de request incorreto'})
  }
}