import { parseCookies } from 'nookies'
import { useState, useEffect } from 'react';
import CheckPoints from "../components/checkPoints";

export default function UserRoute() {
  const [allPoints, setAllPoints] = useState([]);
  const [allCheckPoints, setAllCheckPoints] = useState([]);

  useEffect(() => {
    getAllPoints()
  }, []);

  async function getAllPoints() {
      const { 'AV--token': token } = parseCookies()
        
      const data = await fetch('http://10.0.1.10:3000/api/routes-services/all-points', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      })
      const points = await data.json()
      const checkPoints = points.filter(elem => elem.jaPassou)

      setAllPoints(points)
      setAllCheckPoints(checkPoints)
  }

  async function handleNextCheckPoint() {
    const OrderedCheckPoints = allCheckPoints.sort((a, b) => {
      return a.posicao - b.posicao
    })
    const lastPoint = OrderedCheckPoints[OrderedCheckPoints.length - 1]

    const body = {allPoints, lastPoint}

    const { 'AV--token': token } = parseCookies()
        
    const data = await fetch('http://10.0.1.10:3000/api/routes-services/next-check-point', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    const nextPoint = await data.json()
    const updatedNextPoint = {
      ...nextPoint, 
      jaPassou: true, 
      posicao: allCheckPoints.length,
    }

    const res = await fetch('http://10.0.1.10:3000/api/routes-services/update-point', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedNextPoint),
      })

    if(res.status === 200 && data.status === 200) {
      updateAllPoints(updatedNextPoint)
      setAllCheckPoints( allCheckPoints => [...allCheckPoints, updatedNextPoint] )
    }
  }

  function updateAllPoints(point) {
    let key
    for(let i = 0; i < allPoints.length; i++) {
      if(allPoints[i].id === point.id) {
        key = i
        break
      }
    }
    let newAllPoints = allPoints
    newAllPoints[key] = point
    setAllPoints(newAllPoints)
  }

  return (
    <div>
      <main className="cr--container">
        <div className="ur--checkPoints">
          <h2>Pontos de parada</h2>
        </div>
        <CheckPoints 
          allPoints={allPoints} 
          setAllPoints={setAllPoints}
          allCheckPoints={allCheckPoints}
          setAllCheckPoints={setAllCheckPoints}
        />
        {!(allPoints.length === allCheckPoints.length) ?
          <div className="ur--buttons">
            <button onClick={handleNextCheckPoint}>Próximo ponto</button>
          </div> :
          <div className="ur--buttons">
            <button>Você chegou ao final</button>
          </div>
        }
      </main>
    </div>
  )
}