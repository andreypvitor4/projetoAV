import initMiddleware from '../lib/init-middleware'
import connect from '../../utils/database'
import { ObjectId } from "mongodb";

const userPermission = initMiddleware(
  (req, res, next) => {
    const {db} = await connect()

    try {
      const user = await db.collection('users').findOne({_id: ObjectId(req.userId)})
  
      if(user.permission === 'FULL') {
        req.user = user
        return next()
      }else {
        return res.status(401).json({error: 'Usuário não autorizado.'})
      }

    } catch (error) {
      return res.status(400).json({error: 'Ocorreu um erro, tente novamente.'})
    }
  }
)

export default userPermission