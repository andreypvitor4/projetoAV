import cors from '../../../middlewares/cors'
import authMiddleware from "../../../middlewares/authMiddleware";
import connect from '../../../utils/database'

async function UpdateUser(req, res) {
  await cors(req, res)
  await authMiddleware(req, res)

  if(req.userPermission !== 'ADM') {
    return res.status(401).json({error: 'Você não está autorizado'})
  }

  if(req.method === 'POST') {
    const data = req.body
    const { db, client } = await connect()

    try {
      const user = await db.collection('users').updateOne({email: data.email}, {
        $set: {
          name: data.name,
          permission: data.permission,
          rCount: Number(data.rCount)
        }
      })

      await client.close()

      if(user.result.ok == 1) {
        return res.status(200).json({message: 'alterado com sucesso.'})
      }else {
        return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
      }

    } catch (error) {
      console.log(error)
      return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
    }
    
  }else{
    res.status(400).json({error: 'Método de request incorreto'})
  }
}

export default UpdateUser