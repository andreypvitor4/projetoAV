import { useState, useContext} from 'react';
import Router, { useRouter } from 'next/router'
import Head from 'next/head'
import NewPointForm from '../../components/newPointForm';
import Points from '../../components/points';
import FadeInWindow from '../../components/fadeInWindow';
import { functionsContext } from '../../contexts/globalFunctions'
import styles from '../../styles/createRoute/style.module.css'

export default function CreateRoute() {
  const { fetchApiData } = useContext(functionsContext)

  const [fadeInWindowActive, setFadeInWindowActive] = useState(false);
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

  const updateInputs = (newInputs) => {
    setInputs(prevState => (
        {
        ...prevState,
        ...newInputs
        }
    ))
  }

  async function handleConcludeRoute() {
    const { status } = await fetchApiData(`/api/routes-services/set-route-status?routeId=${router.query.routeId}`, 'PUT')

    if(status === 200) {
      Router.push(`/use-route/${router.query.routeId}`)
    }
  }

  function handleInitialPoint(e) {
    let tr = e.currentTarget
    tr.style.fontSize = '12pt'
    setTimeout(() => {
      tr.style.fontSize = '10pt'
    }, 100)
    setChoosenPointKey('0')
    updateInputs(allPoints[0], setInputs)
    setOptionsActiveClass('activeOptions')
  }

  function handleAddForm() {
    setActiveFormClass('activeForm')
    setSubmitFormOption('add')
  }

  return (
    <div>
      <Head>
        <title>Criar rota</title>
      </Head>

      <main className={styles.container}>
        <div className="tableContainer">
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

        {allPoints.length === 0 && <div className={styles.divAddButton}>
          <button className={styles.addButton} onClick={handleAddForm}>+</button>
        </div>}

        <Points 
          allPoints={allPoints} 
          setAllPoints={setAllPoints}
          activeFormClas={activeFormClass}
          setActiveFormClass={setActiveFormClass}
          setSubmitFormOption={setSubmitFormOption}
          setChoosenPointKey={setChoosenPointKey}
          inputs={inputs}
          setInputs={setInputs}
          updateInputs={updateInputs}
          setOptionsActiveClass={setOptionsActiveClass}
          optionsActiveClass={optionsActiveClass}
          allCities={allCities}
          setAllCities={setAllCities}
        />

        {allPoints.length > 0 && <div className={styles.divAddButton}>
          <button className={styles.addButton} onClick={handleAddForm}>+</button>
        </div>}
        
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

      <FadeInWindow 
        active={fadeInWindowActive}
        setActive={setFadeInWindowActive}
        action={handleConcludeRoute}
      >
        <div>Tem certeza que deseja concluir esta rota?</div>
      </FadeInWindow>

      {allPoints.length > 1 && (
        <div style={{marginBottom: '30px'}}>
          <button onClick={() => {setFadeInWindowActive(true)}}>Concluir rota</button>
        </div>
      )}

    </div>
  )
}