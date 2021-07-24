import cors from '../../../middlewares/cors'
import connect from '../../../utils/database'

export default async function emailAvailability(req, res) {
  await cors(req, res)

  if(req.method === 'POST') {
    const { email } = req.body
    const { db, client } = await connect()

    try {
      const user = await db.collection('users').findOne({ email })

      return res.status(200).json({ emailAvailable: !user })

    }catch (error) {
      return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
    }finally {
      await client.close()
    }

  }else {
    return res.status(400).json({error: 'Método de request incorreto'})
  }
}