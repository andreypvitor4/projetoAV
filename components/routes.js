import { useState, useEffect, useContext } from "react"
import Router from 'next/router'
import ClipLoader from "react-spinners/ClipLoader"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { functionsContext } from '../contexts/globalFunctions'
import FadeInWindow from '../components/fadeInWindow';
import styles from '../styles/routes/style.module.css'

export default function Routes(props) {
  const { fetchApiData } = useContext(functionsContext)

  const [loading, setLoading] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchPosition, setTouchPosition] = useState(0);
  const [routeToDelete, setRouteToDelete] = useState('');
  const [deleteRouteId, setDeleteRouteId] = useState('');
  const [fadeInWindowActive, setFadeInWindowActive] = useState('');

  useEffect(() => {
    setLoading(true)
    fetchApiData('/api/routes-services/all-routes')
    .then(({ data: routes, status }) => {
      setLoading(false)
      if(status === 200) {
        props.setAllRoutes(routes)
      }
    })
  }, [])

function handleTouchStart(e) {
  setTouchStart(e.changedTouches[0].clientX)
}

function handleTouchMove(e) {
  const div = e.currentTarget
  let touchMove = e.changedTouches[0].clientX
  
  let touchPosition = touchMove - touchStart
  if(Math.abs(touchPosition) > 10) {
    setTouchPosition(touchPosition)
    div.style.marginLeft = `${touchPosition*1.5}px`
  
    let opacity = Math.abs(touchPosition/600)

    if(touchPosition < 0) {
      div.firstChild.style.background = 'red'
    }
    if(touchPosition > 0) {
      div.firstChild.style.background = 'blue'
    }
  
    div.firstChild.style.display = 'block'
    div.firstChild.style.opacity = `${opacity}`
  }
}

function handleTouchEnd(routeId, routeName) {
  return e => {
    const div = e.currentTarget
    div.style.marginLeft = `0px`
  
    div.firstChild.style.display = 'none'
    div.firstChild.style.opacity = '0'

    if(touchPosition > 210) {
      Router.push(`/create-route/${routeId}`)
    }
    if(touchPosition < -200) {
      setFadeInWindowActive(true)
      setDeleteRouteId(routeId)
      setRouteToDelete(routeName)
    }
  }
}

async function handleDeleteRoute(e) {
  let deleteButton = e.currentTarget

  const { status } = await fetchApiData('/api/routes-services/delete-route', 'DELETE', {routeId: deleteRouteId})

  if(status === 200) {
    deleteButton.nextSibling.click()

    props.setAllRoutes(allRoutes => (
      allRoutes.filter((elem) => {
        return elem._id !== deleteRouteId
      })
    ))
    }
  }

  function handleRedirectRoute({ _id, routeStatus }) {
    return () => {

      const routeRedirect = routeStatus == 'inacabada'?
        'create-route':
        'use-route'
        Router.push(`/${routeRedirect}/${_id}`)
    }
  }

  function handlePcOptionsEnter(e) {
    e.currentTarget.firstChild.style.visibility = 'visible'
    e.currentTarget.firstChild.style.opacity = '100%'

    e.currentTarget.lastChild.style.visibility = 'visible'
    e.currentTarget.lastChild.style.opacity = '100%'
  }
  function handlePcOptionsLeave(e) {
    e.currentTarget.firstChild.style.visibility = 'hidden'
    e.currentTarget.firstChild.style.opacity = '0%'

    e.currentTarget.lastChild.style.visibility = 'hidden'
    e.currentTarget.lastChild.style.opacity = '0%'
  }

  return (
    <div style={{overflow: 'hidden'}}>

      {loading? (
        <div className={styles.loading}>
          <ClipLoader size={150} />
        </div>
      ) : (
        props.allRoutes.length > 0 && (
          props.allRoutes.map( (elem, key) => (
            <div key={key} className={styles.container}
              onMouseEnter={handlePcOptionsEnter}
              onMouseLeave={handlePcOptionsLeave}
            >
              <div className={styles.pcDeleteArea}>
                <span className={styles.pcDelete} onClick={() => {
                  setFadeInWindowActive(true)
                  setRouteToDelete(elem.routeName)
                  setDeleteRouteId(elem._id)
                }}>X</span>
              </div>

              <div 
                className={styles.route}
                onClick={handleRedirectRoute(elem)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd(elem._id, elem.routeName)}
              >

                {touchPosition < 0 ? (
                  <span 
                    className={styles.routeShadow} 
                    style={{color: 'white', lineHeight: '100px', fontSize: '50px', textAlign: 'center'}}
                    >
                    X
                  </span> 
                ): (
                  <span 
                    className={styles.routeShadow}
                    style={{color: 'white', lineHeight: '130px', textAlign: 'center'}}
                    >
                    <FontAwesomeIcon icon={faEdit} style={{
                      width: '50px'
                    }}/>
                  </span>
                )}

                <div className={styles.routeName}>
                  <p>{elem.routeName}</p>
                  <p>{(new Date(elem.date)).toLocaleDateString()}</p>
                </div>
                <div className={styles.routeDescription}>
                  <p>Descrição: {elem.routeDescription}</p>
      
                  <p className={styles.status}>
                    {elem.routeStatus == 'pronta'?
                      <span style={{color: 'green'}}>Clique para usar</span>:
                      <span style={{color: 'blue'}}>Clique para editar</span>}
                  </p>
                </div>
              </div>

              <div className={styles.pcEditArea}>
                <span className={styles.pcEdit} onClick={() => {
                  Router.push(`/create-route/${elem._id}`)
                }}>
                  <FontAwesomeIcon icon={faEdit} style={{
                    width: '20px'
                  }}/>
                </span>
              </div>
            </div>
          ))
        )
      )}

    <FadeInWindow 
      active={fadeInWindowActive} 
      setActive={setFadeInWindowActive} 
      action={handleDeleteRoute}
    >
      <p>Tem certeza que deseja excluir a rota {routeToDelete}?</p>
    </FadeInWindow>

    </div>
  )
}