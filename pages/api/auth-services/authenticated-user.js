import authMiddleware from "../../../middlewares/authMiddleware";
import cors from '../../../middlewares/cors'

export default async function handler(req, res) {
  await cors(req, res)
  await authMiddleware(req, res)

  res.status(200).json({isAuthenticated: true})
}