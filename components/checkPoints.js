import { useEffect, useState } from "react"

export default function CheckPoints(props) {
  const [orderedCheckPoints, setOrderedCheckPoints] = useState([]);
  const [citiesCount, setCitiesCount] = useState([]);

  useEffect(() => {
    const orderedCheckPoints = props.allCheckPoints.sort((a, b) => {
      return a.posicao - b.posicao
    })
    setOrderedCheckPoints(orderedCheckPoints)
  
    const citiesCount = props.allCities.map( city => {
      let cityCount = orderedCheckPoints.filter( orderedCheckPoint => (
        orderedCheckPoint.cidade == city
      ))
      return cityCount.length
    })
    setCitiesCount(citiesCount)

  }, [props.allCheckPoints, props.allCities]);

  return (
    <div>
      {orderedCheckPoints.length > 0 && (
        orderedCheckPoints.map( (elem, key) => (
        <div key={key} className="tableContainer">
          <div style={{width: '100%', textAlign: 'center'}}>
            {key > 0 && (
              <h3> {'\u2193'} {elem.distance/1000} km</h3>
            )}
          </div>
          <h4 style={{margin: '2px'}}>
            {`${elem.cidade}: (${citiesCount[props.allCities.indexOf(elem.cidade)]})`}
          </h4>
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
                <td>{elem.id}</td>
                <td>{elem.bairro}</td>
                <td>{elem.rua}</td>
                <td>{elem.numero}</td>
              </tr>

            </tbody>
          </table>
        </div>
        ))
      )}
      <h3>Distância total: {(orderedCheckPoints.map(elem => (
        elem.id == 0? 0: elem.distance
      )).reduce( (a, b) => {
          return a + b
        }, 0))/1000} km
      </h3>
    </div>
  )
}