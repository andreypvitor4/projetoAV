import { useState } from 'react';
import { parseCookies } from 'nookies'

export default function ManageRoutes() {
  const [activeClass, setActiveClass] = useState('');
  const [inputs, setInputs] = useState({
    routeName: '',
    routeDescription: '',
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
    console.log(inputs)

    const data = await fetch('http://10.0.1.10:3000/api/routes-services/new-route', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(inputs),
      })

    if(data.status === 200) {
      console.log('ok')
    }
  }

  return (
    <div>
      <main className="cr--container">
        <div className="pts--points">
          <h2>Rotas</h2>
        </div>

        <div className="pts--divAddButton">
          <button 
          className="pts--addButton"
          onClick={() => { setActiveClass('npf--activeForm') }}
          >
            +
          </button>
        </div>
      </main>

      <div className={`npf--formContainer ${activeClass}`}>
        <div className="npf--formShadow"></div>

        <form className="npf--form" onSubmit={handleSubmitForm}>
          <h2>Digite o nome da nova rota</h2>

          <div className="npf--inputDiv">
            <label htmlFor="npf--name">nome</label>
            <input 
              type="text" 
              id="npf--name" 
              name="routeName" 
              value={inputs.routeName} 
              onChange={handleSetInputs}
            />
          </div>

          <div className="npf--inputDiv">
            <label htmlFor="npf--description">descrição</label>
            <input 
              type="text" 
              id="npf--description" 
              name="routeDescription" 
              value={inputs.routeDescription} 
              onChange={handleSetInputs}
            />
          </div>    

        <div>
          <button type="submit">Criar rota</button>
          <button type="button" onClick={() => {setActiveClass('')}}>Cancelar</button>
        </div>

      </form>
          
      </div>
      

    </div>
  )
}