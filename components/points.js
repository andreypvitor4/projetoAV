import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router'
import ClipLoader from "react-spinners/ClipLoader"
import { functionsContext } from '../contexts/globalFunctions'
import FadeInWindow from '../components/fadeInWindow'
import styles from '../styles/points/style.module.css'

export default function Points(props) {
  const { fetchApiData, normalizeString: rs } = useContext(functionsContext)
  const [fadeInWindowActive, setFadeInWindowActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter()

  useEffect(() => {
    if(!!router.query.routeId) {

      setLoading(true)
      fetchApiData(`/api/routes-services/all-points?routeId=${router.query.routeId}`, 'GET').then(({status, data: points}) => {
        setLoading(false)

        if(status == 200) {
          props.setAllPoints(points)
          const cities = points.map(elem => rs(elem.cidade))
          .filter( (elem, key, cities) => (
            key === cities.indexOf(elem)
          ))
          props.setAllCities(cities)
        }else {
          props.setAllPoints([])
          props.setAllCities([])
        }
      })
    }
  }, [router])

  function handleUpdatePoint() {
    props.setActiveFormClass('activeForm')
    props.setSubmitFormOption('update')
  }
  async function handleDeletePoint(e) {
    let deleteButton = e.currentTarget
   
    const { status } = await fetchApiData(`/api/routes-services/delete-point?routeId=${router.query.routeId}`, 'DELETE', props.inputs)

    if(status === 200) {
      deleteButton.nextSibling.click()
      props.setAllPoints(allPoints => (
        allPoints.filter((elem) => {
          return elem.id !== props.inputs.id
        })
      ))
    }
  }

  function handlePoint(e) {
    let tr = e.currentTarget
    tr.style.fontSize = '12pt'
    setTimeout(() => {
      tr.style.fontSize = '10pt'
    }, 100)
    props.setChoosenPointKey(tr.id)
    props.updateInputs(props.allPoints[tr.id])
    props.setOptionsActiveClass('activeOptions')
  }

  function getPointStatus(jaPassou) {
    return (jaPassou ? {
      background: 'gray',
    } : {
      background: 'white',
    })
  }

  return (
    <div >

      {loading && (
        <div className={styles.loading}>
          <ClipLoader size={150} />
        </div>
      )}

      {props.allPoints.length === 0? (
        <h2>Pontos de parada (0)</h2>
      ): (
        <h2>Pontos de parada ({props.allPoints.length - 1})</h2>
      )}

        {/* {loading? (
          <div className={styles.loading}>
            <ClipLoader size={150} />
          </div>
        ): ( */}
          {props.allPoints.length > 1 && (
            <div>
              {props.allCities.map((city, key) => (
                <div key={key} className="tableContainer">
    
                  <h2>{city} ({props.allPoints.filter(elem => {
                    return rs(elem.cidade) == rs(city) && elem.id != 0
                  }).length}):</h2>
    
                  <table>
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>Bairro</th>
                        <th>Rua</th>
                        <th>Número</th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.allPoints.filter(elem => (
                        rs(elem.cidade) == rs(city)
                      )).map( (elem, key) => {
                        if(elem.id != '0') {
                          return (
                            <tr 
                              key={key} 
                              id={elem.id} 
                              onClick={handlePoint} 
                              style={getPointStatus(elem.jaPassou)}
                            >
                              <td>{elem.id}</td>
                              <td>{elem.bairro}</td>
                              <td>{elem.rua}</td>
                              <td>{elem.numero}</td>
                            </tr>
                          )
                        }
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        {/* )} */}
      

      <div className={`${styles.pointOptionsScreen} ${styles[props.optionsActiveClass]}`}>
        <div className={styles.pointOptionsShadow} onClick={() => {
          props.setOptionsActiveClass('')
        }}></div>

        {props.inputs.jaPassou && props.inputs.id != 0? (
          <div className={styles.pointOptions}>
            <p style={{color: 'gray'}}>Você já passou por este ponto</p>
          </div>
        ): (
          <div className={styles.pointOptions}>
            <button onClick={handleUpdatePoint}>Editar</button>
            {props.inputs.id != 0 && (
              <button 
                onClick={() => {setFadeInWindowActive(true)}}
              >
                Deletar
              </button>
            )}
          </div>
        )}

      </div>

      <FadeInWindow 
        active={fadeInWindowActive}
        setActive={setFadeInWindowActive}
        action={handleDeletePoint}
      >
          <p>Você está apagando o ponto: </p>
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>Bairro</th>
                <th>Rua</th>
                <th>Número</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{props.inputs?.id}</td>
                <td>{props.inputs?.bairro}</td>
                <td>{props.inputs?.rua}</td>
                <td>{props.inputs?.numero}</td>
              </tr>
            </tbody>
          </table>
      </FadeInWindow>
      
      {props.allPoints.length > 1 && (
        <p style={{color: 'gray', fontWeight: 'bold'}}>
          clique sobre um endereço para editar ou deletar
        </p>
      )}
      
    </div>
  )
}