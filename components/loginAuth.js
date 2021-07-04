import Router from 'next/router'
import { useEffect } from 'react';
import { parseCookies } from 'nookies'

export default function LoginAuth({ children }) {
  useEffect(() => {
    const { 'AV--token': token } = parseCookies()
    if(!token) {
      Router.push('/login')
    }

    if(token) {
      fetch('http://10.0.1.10:3000/api/auth-services/authenticated-user', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      }).then( data => {
        return data.json()
      }).then( ({ isAuthenticated }) => {
        if(!isAuthenticated) Router.push('/login')
      })
    }

  }, []);
  return (
    <>
      { children }
    </>
  )
}