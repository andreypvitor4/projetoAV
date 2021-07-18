import { useState } from "react";
import { parseCookies } from 'nookies'

export default function Adm() {
  const [input, setInput] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);

  function handleSetInput(e) {
    setInput(e.target.value)
  }

  async function handleSearchSubmit(e) {
    e.preventDefault()

    const formOptions = e.target.firstChild
    const choosenQuery = formOptions.options[formOptions.selectedIndex].value

    const { 'AV--token': token } = parseCookies()

    const data = await fetch(`http://10.0.1.10:3000/api/adm-services/find-user?key=${choosenQuery}&value=${input}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
    })

    if(data.status === 200) {
      const user = await data.json()
      setSearchedUsers(user)
    }else {
      console.log('errrrou')
    }
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
                    <tr key={key} id={elem.id}>
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
    </div>
  )
}