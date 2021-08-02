import { useState, useRef, useContext } from 'react';
import Head from 'next/head'
import ClipLoader from "react-spinners/ClipLoader"
import Routes from '../components/routes';
import { functionsContext } from '../contexts/globalFunctions'
import styles from '../styles/manageRoutes/style.module.css'

export default function ManageRoutes() {
  const cancelButtonRef = useRef(null)
  const {fetchApiData, updateInputs, handleMaxChar } = useContext(functionsContext)

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [activeClass, setActiveClass] = useState('');
  const [allRoutes, setAllRoutes] = useState([]);
  const [inputs, setInputs] = useState({
    routeName: '',
    routeDescription: '',
    routeStatus: 'inacabada',
    points: [],
  });

  function handleSetInputs(e) {
    updateInputs({[e.target.name]: e.target.value}, setInputs)
  }

  async function handleSubmitForm(e) {
    e.preventDefault()
    setLoading(true)
    const {data: route, status } = await fetchApiData('/api/routes-services/new-route', 'POST', inputs)
    setLoading(false)

    if(status === 200) {
      cancelButtonRef.current.click()
      setAllRoutes(prev => ([...prev, route]))
      updateInputs({routeName: '', routeDescription: ''}, setInputs)
    }
    if(status === 401) {
      cancelButtonRef.current.click()
      setAuthError(true)
    }
  }

  return (
    <div>

      <Head>
        <title>Minhas rotas</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.routes}>
          <h2 style={{marginLeft: '2.5%'}}>Minhas rotas</h2>
        </div>

          <Routes allRoutes={allRoutes} setAllRoutes={setAllRoutes}/>

        <p className={styles.mobileText}>Arraste para a direita para editar ou para a esquerda para deletar</p>

        {authError && (
          <div className={styles.authError}>
            <p>Você não tem autorização para fazer esta ação, entre em contato para adquirir.</p>
          </div>
        )}

        <div className={styles.divAddButton}>
          <button 
          className={styles.addButton}
          onClick={() => { setActiveClass('activeForm') }}
          >
            +
          </button>
        </div>
      </main>

      <div className={`${styles.formContainer} ${styles[activeClass]}`}>
        <div className={styles.formShadow}></div>

        <form className={styles.form} onSubmit={handleSubmitForm}>
          <h2>Digite o nome da nova rota</h2>

          {loading? (
            <div className={styles.loading}>
              <ClipLoader size={150} />
            </div>
          ) : (
            <div>
              <div className={styles.inputDiv}>
                <label htmlFor="npf--name">nome</label>
                <input 
                  type="text" 
                  name="routeName"
                  required
                  value={inputs.routeName} 
                  onChange={e => {handleMaxChar(e, 30); handleSetInputs(e);}} 
                />
              </div>

              <div className={styles.inputDiv}>
                <label htmlFor="npf--description">descrição</label>
                <input 
                  type="text" 
                  name="routeDescription" 
                  value={inputs.routeDescription} 
                  onChange={e => {handleMaxChar(e, 120); handleSetInputs(e);}} 
                />
              </div>    

              <div>
                <button type="submit">Criar rota</button>
                <button 
                  type="button" 
                  ref={cancelButtonRef} 
                  onClick={() => {setActiveClass('')}}
                  >
                    Cancelar
                </button>
              </div>
            </div>
          )}
        </form>
          
      </div>

    </div>
  )
}