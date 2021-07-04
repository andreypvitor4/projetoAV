import axios from 'axios'
import authMiddleware from "../../../middlewares/authMiddleware";
import cors from '../../../middlewares/cors'


//substitui os espaços por + e tira os acentos
function rs(string) {
  let normalizedString = string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  return normalizedString.replace(/ /g, '+').toLowerCase()
}

export default async function nextcheckpoint(req, res) {
  await cors(req, res)
  await authMiddleware(req, res)

  if(req.userPermission !== 'FULL') {
    return res.status(401).json({error: 'Você não está autorizado'})
  }

  if(req.method === 'POST') {
    let { allPoints, lastPoint } = req.body

    let startPoint = `r%2E${rs(lastPoint.rua)}%2C${lastPoint.numero}%2C${rs(lastPoint.bairro)}%2C${rs(lastPoint.cidade)}%2C${lastPoint.estado}%2Cbrasil`

    let allDestinationPoints = allPoints.filter(elem => !elem.jaPassou)

    let urlDestinationsArray = allDestinationPoints.map(elem => (
      `r%2E${rs(elem.rua)}%2C${elem.numero}%2C${rs(elem.bairro)}%2C${rs(elem.cidade)}%2C${elem.estado}%2Cbrasil`
    ))
    let fullUrlDestinations = urlDestinationsArray.join('%7C')

    let response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${startPoint}&destinations=${fullUrlDestinations}&key=AIzaSyCMtBLzQIDJrh2Z5fGejZax4YFFPmHcab0`)


    let distances = response.data.rows[0].elements.map( elem => {
      return elem.distance.value
    })
    let shortestDistance = Math.min(...distances)
    let nearestPointKey = distances.indexOf(shortestDistance)
    let nearestPoint = allDestinationPoints[nearestPointKey]

    return res.status(200).json(nearestPoint)
  }
}