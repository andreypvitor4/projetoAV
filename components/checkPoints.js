export default function CheckPoints(props) {

  const OrderedCheckPoints = props.allCheckPoints.sort((a, b) => {
    return a.posicao - b.posicao
  })

  return (
    <div className="pts--points">
      {OrderedCheckPoints.length > 0 && (
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
            {OrderedCheckPoints.map( (elem, key) => (
                  <tr key={key} id={key}>
                    <td>{elem.id}</td>
                    <td>{elem.bairro}</td>
                    <td>{elem.rua}</td>
                    <td>{elem.numero}</td>
                  </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}