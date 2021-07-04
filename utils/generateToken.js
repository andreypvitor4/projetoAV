import jwt from 'jsonwebtoken'

export default function generateToken(params = {}) {
  return jwt.sign(params, process.env.AUTH_SECRET, {
    expiresIn: 86400,
  })
}