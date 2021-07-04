import Head from 'next/head'
import Link from "next/link"
import { useState, useContext } from 'react'
import { AuthContext } from '../contexts/authContext'
import Router from 'next/router'

export default function SignUp() {
  const [signUpError, setSignUpError] = useState(false);
  const { signIn } = useContext(AuthContext)

  async function submitSignIn(e) {
    e.preventDefault()
    const login = document.querySelector('#login__user')
    const email = document.querySelector('#login__email')
    const password = document.querySelector('#login__password')
  
    let data = {
      name: login.value,
      email: email.value,
      password: password.value,
    }
  
    const req = await fetch('http://10.0.1.10:3000/api/auth-services/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if(req.status === 200) {
      await signIn(data, false)
      Router.push('/')
    }else {
      const reqData = await req.json()
      setSignUpError(reqData.error)
    }
  }

  async function handleEmailAvailability(e) {
    const input = e.currentTarget
    let validate = emailTextValidate(e.currentTarget.value)
  
    if(validate) {
      const req = await fetch('http://10.0.1.10:3000/api/auth-services/email-availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: input.value,
          }),
        })
      
      if(req.status === 200) {
        const { emailAvailable } = await req.json()
  
        if(emailAvailable) {
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
    const password = document.querySelector('#login__password')
    const confirmPassword = document.querySelector('#login__confirmPassword')
    const sendButton = document.querySelector('.login--button')
    if(password.value.length < 6) {
      confirmPassword.nextSibling.innerText = 'A senha deve conter no mínimo 6 caracteres'
      confirmPassword.nextSibling.style.color = 'red'
      sendButton.style.opacity = '40%'
      sendButton.disabled = true
    }else {
      if(password.value !== confirmPassword.value) {
        confirmPassword.nextSibling.innerText = 'As senhas não estão iguais'
        confirmPassword.nextSibling.style.color = 'red'
        sendButton.style.opacity = '40%'
        sendButton.disabled = true
      }else {
        confirmPassword.nextSibling.innerText = ''
        sendButton.style.opacity = '100%'
        sendButton.disabled = false
      }
    }
  }

  function handleMaxChar(e) {
    let maxChar = e.currentTarget.value
    if(e.currentTarget.value.length > 30) {
      e.currentTarget.value = maxChar.slice(0,30)
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
    <div className="login">
      <Head>
        <title>Criar conta</title>
      </Head>

      <div className="login--container">
          <Link href="/">
            <a className="login--logo"> <img src="logoAV.png" alt="logo" /> </a>
          </Link>
          <form className="login--form" onSubmit={submitSignIn}>
            <h2>Criar nova conta</h2>
            <div className="login--user">
              <label htmlFor="login__user">Nome de usuário</label>
              <input 
                type="text" 
                id="login__user"
                placeholder="Digite seu nome"
                required
                onChange={handleMaxChar}
              />
            </div>
            <div className="login--user">
              <label htmlFor="login__email">Email</label>
              <div>
                <input 
                  type="email" 
                  id="login__email"
                  placeholder="Digite seu email"
                  autoComplete="email"
                  required
                  onChange={handleMaxChar}
                  onBlur={handleEmailAvailability}
                /><span className="login--validate"></span>
              </div>
            </div>
            <div className="login--password">
              <label htmlFor="login__password">Senha</label>
              <input 
                type="password" 
                id="login__password"
                autoComplete="current-password"
                required
                onChange={(e) => {handlePassword(e); handleMaxChar(e)}}
              />
            </div>
            <div className="login--password">
              <label htmlFor="login__confirmPassword">Confirmar senha</label>
              <input 
                type="password" 
                id="login__confirmPassword"
                autoComplete="current-password"
                required
                onChange={(e) => {handlePassword(e); handleMaxChar(e)}}
              /><span className="login--validate"></span>
            </div>
            <div className="login--continue">
              <input className="login--button" type="submit" value="Criar conta"/>
            </div>
          </form>

          {signUpError && (
          <p className="login--error">
            {signUpError}
          </p>)}
      </div>
      
    </div>
  )
}

SignUp.noLayout = true
SignUp.noAuthNeeded = true