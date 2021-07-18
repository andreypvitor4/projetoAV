import { useContext, useRef} from 'react'
import { AuthContext } from '../contexts/authContext'
import { destroyCookie } from 'nookies'


export default function Account(props) {
  const { user, setUser, rCount } = useContext(AuthContext)
  const headerShadowRef = useRef(null)

  function handleLogOut(setUser) {
    return () => {
      destroyCookie(null, 'AV--token')
      setUser(null)
      headerShadowRef.current.click()
    }
  }

  return (
    <>
      <div className={`header--shadowBackground ${props.userMenuActiveClass}`}></div>

      <div className={`header--user ${props.userMenuActiveClass}`} id="header__userMenu">
        <div 
          className="header--shadow" 
          ref={headerShadowRef} 
          onClick={props.clickUserMenu}
        >
          <div>
            X <span></span>
          </div>
        </div>

        <div className="header--userMenu">
          <h1>Usuário</h1>
          
          <div>
            <p>{user?.name}</p>
            <p>{user?.email}</p>
            <p>Criado em {(new Date(user?.date)).toLocaleDateString()}</p>
            <p>Requisições restantes: {rCount}</p>
            {rCount == 0 && (
              <p style={{color: 'red', fontSize: '10pt'}}>
                Entre em contato para adquirir o direto de fazer mais requisições
              </p>
            )}
            <button onClick={handleLogOut(setUser)}>Log out</button>
          </div>

        </div>

      </div>
    </>
  )
}