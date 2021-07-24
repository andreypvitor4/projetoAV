import { useState, createContext, useEffect, useContext } from "react";
import { setCookie, parseCookies } from 'nookies'
import Router from 'next/router'
import { functionsContext } from '../contexts/globalFunctions'

export const AuthContext = createContext({})

export function AuthProvider({ children }) {

  const { fetchApiData } = useContext(functionsContext)
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState(false);
  const [rCount, setRCount] = useState(null);

  useEffect(() => {
    fetchApiData('/api/auth-services/user', 'GET').then( ({status, data: user }) => {
      if(status == 200) {
        setUser(user)
        setRCount(user.rCount)
      }
    })

  }, []);

  async function signIn({email, password}, redirect = true) {

    try {
      const { data, status } = await fetchApiData('/api/auth-services/auth', 'POST', { email, password })

      if(status === 200) {
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