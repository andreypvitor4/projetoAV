import Head from 'next/head'
import Link from "next/link"
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/authContext'
import { functionsContext } from '../contexts/globalFunctions'
import Image from 'next/image'
import logo from '../public/logoAV.png'
import styles from '../styles/login/style.module.css'

export default function Login() {
  const { updateInputs } = useContext(functionsContext)
  const { signIn, loginError } = useContext(AuthContext)
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });
  
  function submitLogin(e) {
      e.preventDefault()

      signIn(inputs)
  }

  function handleSetInputs(e) {
    updateInputs({[e.target.name]: e.target.value}, setInputs)
  }

  return(
    <div className={styles.login}>
      <Head>
        <title>Login</title>
      </Head>

      <div className={styles.container}>
          <div>
            <Link href="/">
              <a className={styles.logo}> <Image src={logo} alt="logo" /> </a>
            </Link>
          </div>
          <form className={styles.form} onSubmit={submitLogin}>
            <h2>Login</h2>
            <div className={styles.user}>
              <label htmlFor="login__user">Email</label>
              <input 
                type="email" 
                name="email"
                placeholder="Digite seu email"
                autoComplete="email" 
                required
                onChange={handleSetInputs}
              />
            </div>
            <div className={styles.password}>
              <label htmlFor="login__password">Senha</label>
              <input 
                type="password" 
                name="password"
                autoComplete="current-password"
                required
                onChange={handleSetInputs}
              />
            </div>
            <div className={styles.continue}>
              <input className={styles.button} type="submit" value="Continuar"/>
            </div>
            <div className={styles.createAccount}>
              <Link href="/sign-up">
                <a className={styles.button}>Criar conta</a>
              </Link>
            </div>
          </form>
          
          {loginError && (
          <p className={styles.error}>
            {loginError.error}
          </p>)}
      </div>
      
    </div>
  )
}

Login.noLayout = true
Login.noAuthNeeded = true