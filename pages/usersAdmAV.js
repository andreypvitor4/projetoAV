import { useState, useEffect, useContext } from "react";
import { parseCookies } from 'nookies'
import Router from 'next/router'
import FadeInWindow from '../components/fadeInWindow';
import { functionsContext } from '../contexts/globalFunctions'
import style from '../styles/adm/style.module.css'
import pStyle from '../styles/points/style.module.css'

export default function Adm() {
  const { fetchApiData, updateInputs } = useContext(functionsContext)

  useEffect(() => {
    const { 'AV--token': token } = parseCookies()
    if(!token) {
      Router.push('/login')
    }else {
      fetchApiData('/api/auth-services/user', 'GET').then( ({data: user}) => {
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

    const {data: users, status} = await fetchApiData(`/api/adm-services/find-user?key=${choosenQuery}&value=${input}`)

    if(status === 200) {
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

    updateInputs(searchedUsers[tr.id], setInputs)
    setOptionsActiveClass('activeOptions')
  }

  async function handleUserSubmit() {
    const {status} = await fetchApiData('/api/adm-services/update-user', 'POST', inputs)

    if(status === 200) {
      window.alert('atualizado com sucesso')
    }else {
      window.alert('houve algum erro')
    }
  }

  function handleSetInputs(e) {
    updateInputs({[e.target.name]: e.target.value}, setInputs)
  }

  return (
    <div>
      <form className={style.search} onSubmit={handleSearchSubmit}>
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
          <div className={style.searchedUsers}>
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

      <div className={`${pStyle.pointOptionsScreen} ${pStyle[optionsActiveClass]}`}>
        <div className={pStyle.pointOptionsShadow} onClick={() => {
          setOptionsActiveClass('')
        }}></div>

        <div className={pStyle.pointOptions}>
          <button onClick={() => {setFadeInWindowActive(true)}}>Editar</button>

          <button>
            Deletar
          </button>

        </div>
      </div>

      <FadeInWindow 
        active={fadeInWindowActive}
        setActive={setFadeInWindowActive}
        action={handleUserSubmit}
      >
        <div className={style.userForm}>
          <form>
            <div className={style.inputDiv}>
              <label htmlFor="npf--name">nome</label>
              <input 
                type="text" 
                id="npf--name" 
                name="name" 
                value={inputs.name} 
                onChange={handleSetInputs} 
              />
            </div>
            <div className={style.inputDiv}>
              <label htmlFor="npf--permission">permission</label>
              <input 
                type="text" 
                id="npf--permission" 
                name="permission" 
                value={inputs.permission} 
                onChange={handleSetInputs} 
              />
            </div>
            <div className={style.inputDiv}>
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