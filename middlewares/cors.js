import initMiddleware from '../lib/init-middleware'
import Cors from 'cors'

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)

export default cors