import axios from 'axios'
import { ObjectId } from "mongodb";
import authMiddleware from "../../../middlewares/authMiddleware";
import cors from '../../../middlewares/cors'
import connect from '../../../utils/database'


//substitui os espaços por + e tira os acentos
function rs(string) {
  if(string) {
    let normalizedString = string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return normalizedString.replace(/ /g, '+').toLowerCase()
  }
  return ''
}

export default async function nextcheckpoint(req, res) {
  await cors(req, res)
  await authMiddleware(req, res)

  if(req.userPermission !== 'FULL') {
    return res.status(401).json({error: 'Você não está autorizado'})
  }

  if(req.method === 'POST') {
    let { allPoints, lastPoint } = req.body

    let startPoint = `r%2E${rs(lastPoint.rua)}%2C${rs(lastPoint.numero)}%2C${rs(lastPoint.bairro)}%2C${rs(lastPoint.cidade)}%2C${lastPoint.estado}%2Cbrasil`

    let allDestinationPoints = allPoints.filter(elem => !elem.jaPassou)

    let urlDestinationsArray = allDestinationPoints.map(elem => (
      `r%2E${rs(elem.rua)}%2C${elem.numero}%2C${rs(elem.bairro)}%2C${rs(elem.cidade)}%2C${elem.estado}%2Cbrasil`
    ))
    let fullUrlDestinations = urlDestinationsArray.join('%7C')

    try {
      const {db, client} = await connect()
      const user = await db.collection('users').findOne({_id: ObjectId(req.userId) })

      if(user.rCount <= 0) {
        await client.close()
        return res.status(401).json({error: 'Você excedeu o seu limite de requisições'})
      }

      let response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${startPoint}&destinations=${fullUrlDestinations}&key=AIzaSyCMtBLzQIDJrh2Z5fGejZax4YFFPmHcab0`)

      if(response.data.status == 'OK') {
        const dbResponse = await db.collection("users")
        .updateOne({_id: ObjectId(req.userId)}, {
          $inc: {
            rCount: -1
          }
        })
        await client.close()
    
        let distances = response.data.rows[0].elements.map( elem => elem.distance.value)
        let shortestDistance = Math.min(...distances)
        let nearestPointKey = distances.indexOf(shortestDistance)
        let nearestPoint = allDestinationPoints[nearestPointKey]
        nearestPoint.distance = shortestDistance
    
        return res.status(200).json(nearestPoint)
      }
      await client.close()

    } catch (error) {
      console.log(error)
      return res.status(400).json({error: 'Ocorreu um erro, tente novamente'})
    }
  }
}