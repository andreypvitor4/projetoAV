import { parseCookies } from 'nookies'
import { useEffect, useState} from 'react';

export default function Points(props) {
  const [deleteActiveClass, setDeleteActiveClass] = useState('');

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

      props.setAllPoints(points)
  }

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
    
    const data = await fetch('http://10.0.1.10:3000/api/routes-services/delete-point', {
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
    <div className="pts--points">
      {props.allPoints.length === 0 && <div className="pts--divAddButton">
        <button className="pts--addButton" onClick={handleAddForm}>+</button>
      </div>}
      
      <h2>Pontos de parada</h2>
      {props.allPoints.length > 1 && (
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
            {props.allPoints.map( (elem, key) => {
              if(key > 0) {
                return (
                  <tr key={key} id={key} onClick={handlePoint}>
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

      {props.allPoints.length > 0 && <div className="pts--divAddButton">
        <button className="pts--addButton" onClick={handleAddForm}>+</button>
      </div>}
    </div>
  )
}