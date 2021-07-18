import { useState, useEffect, useCallback } from "react"
import { parseCookies } from 'nookies'
import Router from 'next/router'

export default function Routes(props) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchPosition, setTouchPosition] = useState(0);
  const [routeToDelete, setRouteToDelete] = useState('');

  const [deleteActiveClass, setDeleteActiveClass] = useState('');

  const getAllRoutes = useCallback(async function() {
    const { 'AV--token': token } = parseCookies()
      
    const data = await fetch('http://10.0.1.10:3000/api/routes-services/all-routes', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
    })
    const routes = await data.json()
    if(data.status === 200) {
      props.setAllRoutes(routes)
    }
}, [])

useEffect(() => {
  getAllRoutes()
}, [getAllRoutes]);

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
  
    div.firstChild.style.display = 'block'
    div.firstChild.style.opacity = `${opacity}`
  }
}

function handleTouchEnd(routeName) {
  return e => {
    const div = e.currentTarget
    div.style.marginLeft = `0px`
  
    div.firstChild.style.display = 'none'
    div.firstChild.style.opacity = '0'
  
    if(Math.abs(touchPosition) > 200) {
      setDeleteActiveClass('routes--deleteActiveClass')
      setRouteToDelete(routeName)
    }
  }
}

async function handleDeleteRoute(e) {
  let deleteButton = e.currentTarget

  const { 'AV--token': token } = parseCookies()

  const data = await fetch('http://10.0.1.10:3000/api/routes-services/delete-route', {
    method: 'DELETE',
    headers: { 
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({routeName: routeToDelete})
  })

  if(data.status === 200) {
    deleteButton.nextSibling.click()
      props.setAllRoutes(allRoutes => (
        allRoutes.filter((elem) => {
          return elem.routeName !== routeToDelete
        })
      ))
    }
  }

  function handleRedirectRoute({routeName, routeStatus}) {
    return () => {
      const routeRedirect = routeStatus == 'inacabada'?
        'create-route':
        'use-route'
        Router.push(`/${routeRedirect}/${routeName}`)
    }
  }

  function handlePcDeleteEnter(e) {
    e.currentTarget.firstChild.style.visibility = 'visible'
    e.currentTarget.firstChild.style.opacity = '100%'
  }
  function handlePcDeleteLeave(e) {
    e.currentTarget.firstChild.style.visibility = 'hidden'
    e.currentTarget.firstChild.style.opacity = '0%'
  }

  return (
    <div style={{overflow: 'hidden'}}>

      {props.allRoutes.length > 0 && (
        props.allRoutes.map( (elem, key) => (
          <div key={key} className="routes--container" 
            onMouseEnter={handlePcDeleteEnter}
            onMouseLeave={handlePcDeleteLeave}
          >
            <div className="routes--pcDeleteArea">
              <span className="routes--pcDelete" onClick={() => {
                setDeleteActiveClass('routes--deleteActiveClass')
                setRouteToDelete(elem.routeName)
              }}>X</span>
            </div>

            <div 
              className="routes--route" 
              onClick={handleRedirectRoute(elem)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd(elem.routeName)}
            >
              <span className="routes--routeShadow"></span>

              <div className="routes--routeName">
                <p>{elem.routeName}</p>
                <p>{(new Date(elem.date)).toLocaleDateString()}</p>
              </div>
              <div className="routes--routeDescription">
                <p>Descrição: {elem.routeDescription}</p>
    
                <p className="routes--status">
                  {elem.routeStatus == 'pronta'?
                    <span style={{color: 'green'}}>Clique para usar, arraste para o lado para deletar.</span>:
                    <span style={{color: 'blue'}}>Clique para editar, arraste para o lado para deletar.</span>}
                </p>
              </div>
            </div>
          </div>
        ))
      )}

    <div className={`routes--areYouSureScreen ${deleteActiveClass}`}>
        <div className="routes--areYouSure">
          <p>Tem certeza que deseja excluir a rota {routeToDelete}?</p>
          
          <div>
            <button onClick={handleDeleteRoute}>Continuar</button>
            <button onClick={() => {setDeleteActiveClass('')}}>Cancelar</button>
          </div>
        </div>
      </div>

    </div>
  )
}