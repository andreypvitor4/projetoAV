import jwt from 'jsonwebtoken'
import initMiddleware from '../lib/init-middleware'

const authMiddleware = initMiddleware(
  (req, res, next) => {
    const authHeader = req.headers.authorization
  
    if(!authHeader) {
      return res.status(401).json({error: 'nenhum token encontrado'})
    }
  
    const parts = authHeader.split(' ')
  
    if(!parts.length === 2) {
      return res.status(401).json({error: 'token formatado de forma incorreta 1'})
    }
  
    const [scheme, token] = parts
  
    if(!(/^Bearer$/i.test(scheme))) {
      return res.status(401).json({error: 'token formatado de forma incorreta 2'})
    }
  
    jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
      if(err) return res.status(401).json({error: 'Token inválido'})
  
      req.userId = decoded.id
      req.userPermission = decoded.permission
      return next()
    })
  }
)

export default authMiddleware