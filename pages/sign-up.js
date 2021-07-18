import Head from 'next/head'
import Link from "next/link"
import { useState, useContext, useRef } from 'react'
import { AuthContext } from '../contexts/authContext'
import Router from 'next/router'
import Image from 'next/image'
import logo from '../public/logoAV.png'

export default function SignUp() {
  const [signUpError, setSignUpError] = useState(false);
  const { signIn } = useContext(AuthContext)
  const sendButtonRef = useRef(null)
  const confirmPasswordRef = useRef(null)

  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    password: '',
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

  async function submitSignIn(e) {
    e.preventDefault()
  
    const req = await fetch(`${process.env.NEXT_PUBLIC_HOME_URL}/api/auth-services/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    })
    if(req.status === 200) {
      await signIn(inputs, false)
      Router.push('/')
    }else {
      const reqData = await req.json()
      setSignUpError(reqData.error)
    }
  }

  async function handleEmailAvailability(e) {
    const input = e.currentTarget
    let validate = emailTextValidate(input.value)
  
    if(validate) {
      const req = await fetch(`${process.env.NEXT_PUBLIC_HOME_URL}/api/auth-services/email-availability`, {
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
            <a className="login--logo"> <Image src={logo} alt="logo" /> </a>
          </Link>
          <form className="login--form" onSubmit={submitSignIn}>
            <h2>Criar nova conta</h2>
            <div className="login--user">
              <label htmlFor="login__user">Nome de usuário</label>
              <input 
                type="text" 
                name="name"
                placeholder="Digite seu nome"
                required
                onChange={e => {handleMaxChar(e); handleSetInputs(e)}}
              />
            </div>
            <div className="login--user">
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
                /><span className="login--validate"></span>
              </div>
            </div>
            <div className="login--password">
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
            <div className="login--password">
              <label htmlFor="login__confirmPassword">Confirmar senha</label>
              <input 
                type="password" 
                name="confirmPassword"
                autoComplete="current-password"
                required
                onChange={handleMaxChar}
                onBlur={handlePassword}
              /><span className="login--validate" ref={confirmPasswordRef}></span>
            </div>
            <div className="login--continue">
              <input className="login--button" type="submit" value="Criar conta" ref={sendButtonRef}/>
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