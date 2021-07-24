import { useState, useEffect } from "react";
import { parseCookies } from 'nookies'
import Router from 'next/router'
import FadeInWindow from '../components/fadeInWindow';

export default function Adm() {
  useEffect(() => {
    const { 'AV--token': token } = parseCookies()
    if(!token) {
      Router.push('/login')
    }

    if(token) {
      fetch(`${process.env.NEXT_PUBLIC_HOME_URL}/api/auth-services/user`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      }).then( data => {
        return data.json()
      }).then( (user) => {
        if(user.permission != 'ADM') Router.push('/')
      })
    }

  }, []);

  const [input, setInput] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [optionsActiveClass, setOptionsActiveClass] = useState('');
  const [fadeInWindowActive, setFadeInWindowActive] = useState('');
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    permission: '',
    rCount: 0,
    data: '',
  });

  function handleSetInput(e) {
    setInput(e.target.value)
  }

  async function handleSearchSubmit(e) {
    e.preventDefault()

    const formOptions = e.target.firstChild
    const choosenQuery = formOptions.options[formOptions.selectedIndex].value

    const { 'AV--token': token } = parseCookies()

    const data = await fetch(`${process.env.NEXT_PUBLIC_HOME_URL}/api/adm-services/find-user?key=${choosenQuery}&value=${input}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
    })

    if(data.status === 200) {
      const users = await data.json()
      setSearchedUsers(users)
    }else {
      console.log('errrrou')
    }
  }

  function handleUser(e) {
    let tr = e.currentTarget
    tr.style.fontSize = '12pt'
    setTimeout(() => {
      tr.style.fontSize = '10pt'
    }, 100)

    updateInputs(searchedUsers[tr.id])
    setOptionsActiveClass('pts--activeOptions')
  }

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

    const data = await fetch(`${process.env.NEXT_PUBLIC_HOME_URL}/api/adm-services/update-user`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(inputs)
    })

    if(data.status === 200) {
      window.alert('atualizado com sucesso')
    }else {
      window.alert('houve algum erro')
    }
  }

  function handleSetInputs(e) {
    updateInputs({[e.target.name]: e.target.value})
  }

  return (
    <div>
      <form className="adm--search" onSubmit={handleSearchSubmit}>
        <select name="searchOption">
          <option value="email">email</option>
          <option value="name">nome</option>
          <option value="permission">permissão</option>
          <option value="gt">N de req maior que</option>
          <option value="lt">N de req menor que</option>
        </select>
        <input type="text" value={input} onChange={handleSetInput}/>
        <button type="submit">Buscar</button>
      </form>

      <div>
        {searchedUsers.length > 0 && (
          <div className="adm--searchedUsers">
            <table>
                <thead>
                  <tr>
                    <th>nome</th>
                    <th>email</th>
                    <th>permissão</th>
                    <th>rCount</th>
                  </tr>
                </thead>
                <tbody>
                  {searchedUsers.map( (elem, key) => (
                    <tr key={key} id={key} onClick={handleUser}>
                      <td>{elem.name}</td>
                      <td>{elem.email}</td>
                      <td>{elem.permission}</td>
                      <td>{elem.rCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        )}
      </div>

      <div className={`pts--pointOptionsScreen ${optionsActiveClass}`}>
        <div className="pts--pointOptionsShadow" onClick={() => {
          setOptionsActiveClass('')
        }}></div>

        <div className="pts--pointOptions">
          <button onClick={() => {setFadeInWindowActive(true)}}>Editar</button>

          <button>
            Deletar
          </button>

        </div>
      </div>

      <FadeInWindow 
        active={fadeInWindowActive}
        setActive={setFadeInWindowActive}
        action={handleConcludeRoute}
      >
        <div className="adm--userForm">
          <form>
            <div className="npf--inputDiv">
              <label htmlFor="npf--name">nome</label>
              <input 
                type="text" 
                id="npf--name" 
                name="name" 
                value={inputs.name} 
                onChange={handleSetInputs} 
              />
            </div>
            <div className="npf--inputDiv">
              <label htmlFor="npf--permission">permission</label>
              <input 
                type="text" 
                id="npf--permission" 
                name="permission" 
                value={inputs.permission} 
                onChange={handleSetInputs} 
              />
            </div>
            <div className="npf--inputDiv">
              <label htmlFor="npf--rCount">rCount</label>
              <input 
                type="text" 
                id="npf--rCount" 
                name="rCount" 
                value={inputs.rCount} 
                onChange={handleSetInputs}
              />
            </div>
          
          </form>
        </div>
      </FadeInWindow>

    </div>
  )
}

Adm.noAuthNeeded = true