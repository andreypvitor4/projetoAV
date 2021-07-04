import Head from 'next/head'
import Link from "next/link"
import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext'

export default function Login() {
  const { signIn, loginError } = useContext(AuthContext)
  
  function submitLogin(e) {
      e.preventDefault(0)
  
      const login = document.querySelector('#login__user')
      const password = document.querySelector('#login__password')
      let data = {
        email: login.value,
        password: password.value,
      }
      signIn(data)
  }

  return(
    <div className="login">
      <Head>
        <title>Login</title>
      </Head>

      <div className="login--container">
          <div>
          <Link href="/">
            <a className="login--logo"> <img src="logoAV.png" alt="logo" /> </a>
          </Link>
          </div>
          <form className="login--form" onSubmit={submitLogin}>
            <h2>Login</h2>
            <div className="login--user">
              <label htmlFor="login__user">Email</label>
              <input 
                type="email" 
                id="login__user"
                placeholder="Digite seu email"
                autoComplete="email" 
                required 
              />
            </div>
            <div className="login--password">
              <label htmlFor="login__password">Senha</label>
              <input 
                type="password" 
                id="login__password"
                autoComplete="current-password"
                required 
              />
            </div>
            <div className="login--continue">
              <input className="login--button" type="submit" value="Continuar"/>
            </div>
            <div className="login--createAccount">
              <Link href="/sign-up">
                <a className="login--button">Criar conta</a>
              </Link>
            </div>
          </form>
          
          {loginError && (
          <p className="login--error">
            {loginError.error}
          </p>)}
      </div>
      
    </div>
  )
}

Login.noLayout = true
Login.noAuthNeeded = true