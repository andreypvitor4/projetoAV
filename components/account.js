import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext'
import { destroyCookie } from 'nookies'


export default function Account() {
  const { user, setUser } = useContext(AuthContext)

  function clickUserMenu(e) {
    const userMenu = document.querySelector('#header__userMenu')
    userMenu.classList.toggle('userMenuActive')
    const shadow = document.querySelector('#header__shadowBackground')
    shadow.classList.toggle('userMenuActive')
    const active = userMenu.classList.contains('userMenuActive')
    e.currentTarget.setAttribute('aria-expanded', active)
    if(active) {
        e.currentTarget.setAttribute('aria-label', 'Fechar Menu')
    }else {
        e.currentTarget.setAttribute('aria-label', 'Abrir Menu')
    }
  }

  function handleLogOut(setUser) {
    return () => {
      destroyCookie(null, 'AV--token')
      setUser(null)
      document.querySelector('.header--shadow').click()
    }
  }

  return (
    <>
      <div className="header--shadowBackground" id="header__shadowBackground"></div>

      <div className="header--user" id="header__userMenu">
        <div className="header--shadow" onClick={clickUserMenu}>
          <div>
            X <span></span>
          </div>
        </div>

        <div className="header--userMenu">
          <h1>Usuário</h1>
          
          <div>
            <div>
              {user?.name}<br />
            </div>
            <p>{user?.email}</p>
            <button onClick={handleLogOut(setUser)}>Log out</button>
          </div>

        </div>

      </div>
    </>
  )
}