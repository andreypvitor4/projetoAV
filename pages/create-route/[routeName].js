import { useState, useEffect} from 'react';
import { parseCookies } from 'nookies'
import Router, { useRouter } from 'next/router'
import Head from 'next/head'
import NewPointForm from '../../components/newPointForm';
import Points from '../../components/points';
import AreYouSure from '../../components/areYouSure';

export default function CreateRoute() {
  const [areYouSureActive, setAreYouSureActive] = useState(false);

  const [allPoints, setAllPoints] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [activeFormClass, setActiveFormClass] = useState('');
  const [submitFormOption, setSubmitFormOption] = useState('');
  const [choosenPointKey, setChoosenPointKey] = useState(null);
  const [optionsActiveClass, setOptionsActiveClass] = useState('');
  const [inputs, setInputs] = useState({
    id: 0,
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    jaPassou: false,
    posicao: 0,
  });
  const router = useRouter()

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

  async function handleConcludeRoute() {
    const { 'AV--token': token } = parseCookies()
      
    const data = await fetch(`http://10.0.1.10:3000/api/routes-services/set-route-status?routeName=${router.query.routeName}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
    })

    if(data.status === 200) {
      Router.push(`/use-route/${router.query.routeName}`)
    }
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
      <Head>
        <title>Criar rota</title>
      </Head>

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
          optionsActiveClass={optionsActiveClass}
          allCities={allCities}
          setAllCities={setAllCities}
        />
        
      </main>

      <NewPointForm 
        setAllPoints={setAllPoints}
        allPoints={allPoints}
        activeFormClass={activeFormClass}
        setActiveFormClass={setActiveFormClass}
        submitFormOption={submitFormOption}
        choosenPointKey={choosenPointKey}
        updateInputs={updateInputs}
        inputs={inputs}
        allCities={allCities}
        setAllCities={setAllCities}
      />

      <AreYouSure 
        active={areYouSureActive}
        setActive={setAreYouSureActive}
        action={handleConcludeRoute}
      >
        <div>Tem certeza que deseja concluir esta rota?</div>
      </AreYouSure>

      {allPoints.length > 1 && (
        <div style={{marginBottom: '30px'}}>
          <button onClick={() => {setAreYouSureActive(true)}}>Concluir rota</button>
        </div>
      )}

    </div>
  )
}