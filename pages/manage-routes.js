import { useState, useRef } from 'react';
import { parseCookies } from 'nookies'
import Head from 'next/head'
import Routes from '../components/routes';

export default function ManageRoutes() {
  const cancelButtonRef = useRef(null)
  const [authError, setAuthError] = useState(false);
  const [activeClass, setActiveClass] = useState('');
  const [allRoutes, setAllRoutes] = useState([]);
  const [inputs, setInputs] = useState({
    routeName: '',
    routeDescription: '',
    routeStatus: 'inacabada',
    points: [],
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

  function handleSetInputs(e) {
    updateInputs({[e.target.name]: e.target.value})
  }

  async function handleSubmitForm(e) {
    e.preventDefault()

    const { 'AV--token': token } = parseCookies()

    const data = await fetch('http://10.0.1.10:3000/api/routes-services/new-route', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(inputs),
      })

    if(data.status === 200) {
      cancelButtonRef.current.click()
      const route = await data.json()
      setAllRoutes(prev => ([...prev, route]))
      updateInputs({routeName: '', routeDescription: ''})
    }
    if(data.status === 401) {
      cancelButtonRef.current.click()
      setAuthError(true)
    }
  }

  function handleMaxChar(e, max) {
    let maxChar = e.currentTarget.value
    if(e.currentTarget.value.length > max) {
      e.currentTarget.value = maxChar.slice(0,max)
    }
  }

  return (
    <div>

      <Head>
        <title>Minhas rotas</title>
      </Head>

      <main className="mr--container">
        <div className="mr--routes">
          <h2 style={{marginLeft: '2.5%'}}>Minhas rotas</h2>
        </div>

        <Routes allRoutes={allRoutes} setAllRoutes={setAllRoutes}/>

        {authError && (
          <div className="mr--authError">
            <p>Você não tem autorização para fazer esta ação, entre em contato para adquirir.</p>
          </div>
        )}

        <div className="mr--divAddButton">
          <button 
          className="mr--addButton"
          onClick={() => { setActiveClass('mr--activeForm') }}
          >
            +
          </button>
        </div>
      </main>

      <div className={`mr--formContainer ${activeClass}`}>
        <div className="mr--formShadow"></div>

        <form className="mr--form" onSubmit={handleSubmitForm}>
          <h2>Digite o nome da nova rota</h2>

          <div className="mr--inputDiv">
            <label htmlFor="npf--name">nome</label>
            <input 
              type="text" 
              name="routeName"
              required
              value={inputs.routeName} 
              onChange={e => {handleMaxChar(e, 30); handleSetInputs(e);}} 
            />
          </div>

          <div className="mr--inputDiv">
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

      </form>
          
      </div>

    </div>
  )
}