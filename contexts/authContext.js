import { useState, createContext, useEffect } from "react";
import { setCookie, parseCookies } from 'nookies'
import Router from 'next/router'

export const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState(false);
  const [rCount, setRCount] = useState(null);
  

  useEffect(() => {
    const { 'AV--token': token } = parseCookies()

      if(token) {
        fetch(`${process.env.NEXT_PUBLIC_HOME_URL}/api/auth-services/user`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
          },
        }).then( res => {
          return res.json()
        }).then( data => {
          setUser(data.user)
          setRCount(data.user.rCount)
        })
      }

  }, []);

  async function signIn({email, password}, redirect = true) {

    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_HOME_URL}/api/auth-services/auth`, {
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
        setRCount(user.rCount)
        
        redirect && Router.push('/')
        
      }else {
        setLoginError(data)
      }
      
    } catch (error) {
      window.alert('Ocorreu um erro, tente novamente')
    }

  }

  return (
    <AuthContext.Provider value={{ user, setUser, signIn, loginError, rCount, setRCount}}>
      {children}
    </AuthContext.Provider>
  )
}