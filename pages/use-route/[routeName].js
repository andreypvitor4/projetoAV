import { parseCookies } from 'nookies'
import { useState, useEffect, useCallback, useContext } from 'react';
import { useRouter } from 'next/router'
import Head from 'next/head'
import { AuthContext } from '../../contexts/authContext'
import CheckPoints from "../../components/checkPoints";


export default function UserRoute() {
  const { setRCount } = useContext(AuthContext)

  const [authError, setAuthError] = useState(false);
  const [allPoints, setAllPoints] = useState([]);
  const [allCheckPoints, setAllCheckPoints] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const router = useRouter()

  const getAllPoints = useCallback(async function() {
    if(!router.query.routeName) return

    const { 'AV--token': token } = parseCookies()

    const data = await fetch(`${process.env.NEXT_PUBLIC_HOME_URL}/api/routes-services/all-points?routeName=${router.query.routeName}`, {
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

    const cities = checkPoints.map(elem => elem.cidade).filter( (elem, key, cities) => (
      key === cities.indexOf(elem)
    ))

    setAllCities(cities)
}, [router])

useEffect(() => {
  getAllPoints()
}, [getAllPoints]);


  async function handleNextCheckPoint() {
    const OrderedCheckPoints = allCheckPoints.sort((a, b) => {
      return a.posicao - b.posicao
    })
    const lastPoint = OrderedCheckPoints[OrderedCheckPoints.length - 1]

    const body = {allPoints, lastPoint}

    const { 'AV--token': token } = parseCookies()
        
    const data = await fetch(`${process.env.NEXT_PUBLIC_HOME_URL}/api/routes-services/next-check-point`, {
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOME_URL}/api/routes-services/update-point?routeName=${router.query.routeName}`, {
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
      setRCount(prev => prev - 1)

      const cities = [...allCheckPoints, updatedNextPoint].map(elem => elem.cidade)
      .filter( (elem, key, cities) => (
        key === cities.indexOf(elem)
      ))
  
      setAllCities(cities)
    }
    if(data.status === 401) {
      setAuthError(true)
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
      <Head>
        <title>Usar rota</title>
      </Head>

      <main className="cr--container">
        <div className="ur--checkPoints">
          <h2>Pontos de parada ({allCheckPoints.length})</h2>
        </div>
        <CheckPoints 
          allPoints={allPoints} 
          setAllPoints={setAllPoints}
          allCheckPoints={allCheckPoints}
          setAllCheckPoints={setAllCheckPoints}
          allCities={allCities}
        />

        {authError && (
          <div className="mr--authError">
            <p>Você esgotou o seu limite de requisições, entre em contato para adquirir mais.</p>
          </div>
        )}

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