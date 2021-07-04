import { useState, createContext, useEffect } from "react";
import { setCookie, parseCookies } from 'nookies'
import Router from 'next/router'

export const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    const { 'AV--token': token } = parseCookies()

      if(token) {
        fetch('http://10.0.1.10:3000/api/auth-services/user', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
          },
        }).then( res => {
          return res.json()
        }).then( data => {
          setUser(data.user)
        })
      }

  }, []);

  async function signIn({email, password}, redirect = true) {

    try {
      const req = await fetch('http://10.0.1.10:3000/api/auth-services/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, 
          password,
        })
      })

      const data = await req.json()

      if(req.status === 200) {
        const {token , user} = data
    
        setCookie(undefined, 'AV--token', token, {
          maxAge: 60 * 60 * 24,
        })
    
        setUser(user)
        
        redirect && Router.push('/')
        
      }else {
        setLoginError(data)
      }
      
    } catch (error) {
      window.alert('Ocorreu um erro, tente novamente')
    }

  }

  return (
    <AuthContext.Provider value={{ user, setUser, signIn, loginError }}>
      {children}
    </AuthContext.Provider>
  )
}