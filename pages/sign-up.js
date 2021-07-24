import Head from 'next/head'
import Link from "next/link"
import { useState, useContext, useRef } from 'react'
import Router from 'next/router'
import Image from 'next/image'
import logo from '../public/logoAV.png'
import { AuthContext } from '../contexts/authContext'
import { functionsContext } from '../contexts/globalFunctions'
import styles from '../styles/login/style.module.css'

export default function SignUp() {
  const { signIn } = useContext(AuthContext)
  const { fetchApiData, updateInputs, handleMaxChar } = useContext(functionsContext)

  const [signUpError, setSignUpError] = useState(false);
  const sendButtonRef = useRef(null)
  const confirmPasswordRef = useRef(null)

  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    password: '',
  });

  function handleSetInputs(e) {
    updateInputs({[e.target.name]: e.target.value}, setInputs)
  }

  async function submitSignIn(e) {
    e.preventDefault()

    const { status, data } = await fetchApiData('/api/auth-services/register', 'POST', inputs)

    if(status === 200) {
      await signIn(inputs, false)
      Router.push('/')
    }else {
      setSignUpError(data.error)
    }
  }

  async function handleEmailAvailability(e) {
    const input = e.currentTarget
    let validate = emailTextValidate(input.value)
  
    if(validate) {
      const { status, data } = await fetchApiData('/api/auth-services/email-availability', 'POST', { email: input.value })
      
      if(status === 200) {
  
        if(data.emailAvailable) {
          input.nextSibling.innerText = 'Email disponível'
          input.nextSibling.style.color = 'green'
          
        }else {
          input.nextSibling.innerText = 'Este email já está em uso'
          input.nextSibling.style.color = 'red'
        }
      }
    }else {
      input.nextSibling.innerText = ''
    }
  }

  function handlePassword() {
    const { password } = inputs
    const confirmPassword = confirmPasswordRef.current.previousSibling.value
    
    const sendButton = sendButtonRef.current
    if(password.length < 6) {
      confirmPasswordRef.current.innerText = 'A senha deve conter no mínimo 6 caracteres'
      confirmPasswordRef.current.style.color = 'red'
      sendButton.style.opacity = '40%'
      sendButton.disabled = true
    }else {
      if(password !== confirmPassword) {
        confirmPasswordRef.current.innerText = 'As senhas não estão iguais'
        confirmPasswordRef.current.style.color = 'red'
        sendButton.style.opacity = '40%'
        sendButton.disabled = true
      }else {
        confirmPasswordRef.current.innerText = ''
        sendButton.style.opacity = '100%'
        sendButton.disabled = false
      }
    }
  }
  
  function emailTextValidate(text) {
    let charPosition = text.indexOf('@')
    if(charPosition !== -1 && text[charPosition + 1]) {
      return true
    }
    return false
  }

  return(
    <div className={styles.login}>
      <Head>
        <title>Criar conta</title>
      </Head>

      <div className={styles.container}>
          <Link href="/">
            <a className={styles.logo}> <Image src={logo} alt="logo" /> </a>
          </Link>
          <form className={styles.form} onSubmit={submitSignIn}>
            <h2>Criar nova conta</h2>
            <div className={styles.user}>
              <label htmlFor="login__user">Nome de usuário</label>
              <input 
                type="text" 
                name="name"
                placeholder="Digite seu nome"
                required
                onChange={e => {handleMaxChar(e); handleSetInputs(e)}}
              />
            </div>
            <div className={styles.user}>
              <label htmlFor="login__email">Email</label>
              <div>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Digite seu email"
                  autoComplete="email"
                  required
                  onChange={e => {handleMaxChar(e); handleSetInputs(e)}}
                  onBlur={handleEmailAvailability}
                /><span className={styles.validate}></span>
              </div>
            </div>
            <div className={styles.password}>
              <label htmlFor="login__password">Senha</label>
              <input 
                type="password" 
                name="password"
                autoComplete="current-password"
                required
                onChange={e => {handleSetInputs(e);handleMaxChar(e);}}
                onBlur={handlePassword}
              />
            </div>
            <div className={styles.password}>
              <label htmlFor="login__confirmPassword">Confirmar senha</label>
              <input 
                type="password" 
                name="confirmPassword"
                autoComplete="current-password"
                required
                onChange={handleMaxChar}
                onBlur={handlePassword}
              /><span className={styles.validate} ref={confirmPasswordRef}></span>
            </div>
            <div className={styles.continue}>
              <input className={styles.button} type="submit" value="Criar conta" ref={sendButtonRef}/>
            </div>
          </form>

          {signUpError && (
          <p className={styles.error}>
            {signUpError}
          </p>)}
      </div>
      
    </div>
  )
}

SignUp.noLayout = true
SignUp.noAuthNeeded = true