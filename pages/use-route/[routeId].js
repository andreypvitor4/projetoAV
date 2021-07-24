import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import Head from 'next/head'
import { AuthContext } from '../../contexts/authContext'
import CheckPoints from "../../components/checkPoints";
import { functionsContext } from '../../contexts/globalFunctions'
import styles from '../../styles/useRoute/style.module.css'

export default function UseRoute() {
  const { fetchApiData } = useContext(functionsContext)
  const { setRCount } = useContext(AuthContext)

  const [authError, setAuthError] = useState(false);
  const [allPoints, setAllPoints] = useState([]);
  const [allCheckPoints, setAllCheckPoints] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const router = useRouter()

  useEffect(()=> {
    if(!!router.query.routeId) {
      fetchApiData(`/api/routes-services/all-points?routeId=${router.query.routeId}`, 'GET')
      .then(({status, data: points}) => {

        if(status == 200) {
          const checkPoints = points.filter(elem => elem.jaPassou)
          setAllPoints(points)
          setAllCheckPoints(checkPoints)
  
          const cities = checkPoints.map(elem => elem.cidade)
          .filter( (elem, key, cities) => (
            key === cities.indexOf(elem)
          ))
  
          setAllCities(cities)
        }else {
          setAllPoints([])
          setAllCheckPoints([])
          setAllCities([])
        }
      })
    }
  }, [router])

  async function handleNextCheckPoint() {
    const OrderedCheckPoints = allCheckPoints.sort((a, b) => {
      return a.posicao - b.posicao
    })
    const lastPoint = OrderedCheckPoints[OrderedCheckPoints.length - 1]

    const body = {allPoints, lastPoint}

    const {data: nextPoint, status: nextPointStatus} = await fetchApiData('/api/routes-services/next-check-point', 'POST', body)

    const updatedNextPoint = {
      ...nextPoint, 
      jaPassou: true, 
      posicao: allCheckPoints.length,
    }

    const { status } = await fetchApiData(`/api/routes-services/update-point?routeId=${router.query.routeId}`, 'PUT', updatedNextPoint)

    if(status === 200 && nextPointStatus === 200) {
      updateAllPoints(updatedNextPoint)
      setAllCheckPoints( allCheckPoints => [...allCheckPoints, updatedNextPoint] )
      setRCount(prev => prev - 1)

      const cities = [...allCheckPoints, updatedNextPoint].map(elem => elem.cidade)
      .filter( (elem, key, cities) => (
        key === cities.indexOf(elem)
      ))
  
      setAllCities(cities)
    }
    if(nextPointStatus === 401) {
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

      <main className={styles.container}>
        <div className={styles.checkPoints}>
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
          <div className={styles.authError}>
            <p>Você esgotou o seu limite de requisições, entre em contato para adquirir mais.</p>
          </div>
        )}

        {!(allPoints.length === allCheckPoints.length) ?
          <div className={styles.buttons}>
            <button onClick={handleNextCheckPoint}>Próximo ponto</button>
          </div> :
          <div className={styles.buttons}>
            <button>Você chegou ao final</button>
          </div>
        }
        
      </main>
    </div>
  )
}