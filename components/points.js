import { parseCookies } from 'nookies'
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router'

export default function Points(props) {
  const [deleteActiveClass, setDeleteActiveClass] = useState('');

  const router = useRouter()

  function rs(string) {
    let normalizedString = string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return normalizedString.toLowerCase()
  }

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
    props.setAllPoints(points)

    const cities = points.map(elem => rs(elem.cidade)).filter( (elem, key, cities) => (
      key === cities.indexOf(elem)
    ))

    props.setAllCities(cities)

  }, [router])

  useEffect(() => {
    getAllPoints()
  }, [getAllPoints]);

  function handleAddForm() {
    props.setActiveFormClass('npf--activeForm')
    props.setSubmitFormOption('add')
  }
  function handleUpdatePoint() {
    props.setActiveFormClass('npf--activeForm')
    props.setSubmitFormOption('update')
  }
  async function handleDeletePoint(e) {
    let deleteButton = e.currentTarget
    const { 'AV--token': token } = parseCookies()
    
    const data = await fetch(`${process.env.NEXT_PUBLIC_HOME_URL}/api/routes-services/delete-point?routeName=${router.query.routeName}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(props.inputs),
    })

    if(data.status === 200) {
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
    props.setOptionsActiveClass('pts--activeOptions')
  }

  return (
    <div >
      {props.allPoints.length === 0 && <div className="pts--divAddButton">
        <button className="pts--addButton" onClick={handleAddForm}>+</button>
      </div>}

      {props.allPoints.length === 0? (
        <h2>Pontos de parada (0)</h2>
      ): (
        <h2>Pontos de parada ({props.allPoints.length - 1})</h2>
      )}
      
      {props.allPoints.length > 1 && (
        <div>
          {props.allCities.map((city, key) => (
            <div key={key} className="pts--points">

              <h2>{`${city} (${props.allPoints.filter(elem => {
                return rs(elem.cidade) == rs(city) && elem.id != 0
              }).length}):`}</h2>

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
                        <tr key={key} id={elem.id} onClick={handlePoint}>
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

      <div className={`pts--pointOptionsScreen ${props.optionsActiveClass}`}>
        <div className="pts--pointOptionsShadow" onClick={() => {
          props.setOptionsActiveClass('')
        }}></div>

        <div className="pts--pointOptions">
          <button onClick={handleUpdatePoint}>Editar</button>
          {props.inputs.id != 0 && (
            <button 
              onClick={() => {setDeleteActiveClass('pts--deleteActiveClass')}}
            >
              Deletar
            </button>
          )}
        </div>
      </div>
      
      <div className={`pts--areYouSureScreen ${deleteActiveClass}`}>
        <div className="pts--areYouSure">
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
          <div>
            <button onClick={handleDeletePoint}>Continuar</button>
            <button onClick={() => {setDeleteActiveClass('')}}>Cancelar</button>
          </div>
        </div>
      </div>
      
      {props.allPoints.length > 1 && (
        <p style={{color: 'gray', fontWeight: 'bold'}}>
          clique sobre um endereço para editar ou deletar
        </p>
      )}

      {props.allPoints.length > 0 && <div className="pts--divAddButton">
        <button className="pts--addButton" onClick={handleAddForm}>+</button>
      </div>}
      
    </div>
  )
}