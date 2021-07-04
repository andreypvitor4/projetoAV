import { useState } from 'react';
import NewPointForm from '../components/newPointForm';
import Points from '../components/points';

export default function CreateRoute() {

  const [allPoints, setAllPoints] = useState([]);
  const [activeFormClass, setActiveFormClass] = useState('');
  const [submitFormOption, setSubmitFormOption] = useState('');
  const [choosenPointKey, setChoosenPointKey] = useState(null);
  const [optionsActiveClass, setOptionsActiveClass] = useState('');
  const [inputs, setInputs] = useState({
    id: '',
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    jaPassou: false,
    posicao: 0,
  });
  function updateInputs(newInputs) {
    setInputs(prevState => {
      return (
        {
        ...prevState,
        ...newInputs
        }
      )
    })
  }

  function handleConcludeRoute() {
    
  }
  function handleInitialPoint(e) {
    let tr = e.currentTarget
    tr.style.fontSize = '12pt'
    setTimeout(() => {
      tr.style.fontSize = '10pt'
    }, 100)
    updateInputs(allPoints[0])
    setOptionsActiveClass('pts--activeOptions')
  }

  return (
    <div>
      <main className="cr--container">
        <div className="cr--startPoint">
          <h2>Ponto de partida</h2>
          {allPoints.length > 0 && (
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
                <tr onClick={handleInitialPoint}>
                  <td>{allPoints[0]?.id}</td>
                  <td>{allPoints[0]?.bairro}</td>
                  <td>{allPoints[0]?.rua}</td>
                  <td>{allPoints[0]?.numero}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <Points 
        allPoints={allPoints} 
        setAllPoints={setAllPoints}
        activeFormClas={activeFormClass}
        setActiveFormClass={setActiveFormClass}
        setSubmitFormOption={setSubmitFormOption}
        setChoosenPointKey={setChoosenPointKey}
        inputs={inputs}
        updateInputs={updateInputs}
        setOptionsActiveClass={setOptionsActiveClass}
        optionsActiveClass={optionsActiveClass}/>
      </main>

      <NewPointForm 
      setAllPoints={setAllPoints}
      allPoints={allPoints}
      activeFormClass={activeFormClass}
      setActiveFormClass={setActiveFormClass}
      submitFormOption={submitFormOption}
      choosenPointKey={choosenPointKey}
      updateInputs={updateInputs}
      inputs={inputs}/>

      <div>
        <button onClick={handleConcludeRoute}>Concluir rota</button>
      </div>

    </div>
  )
}