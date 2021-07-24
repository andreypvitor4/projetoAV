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
      fetch(`${process.env.NEXT_PUBLIC_HOME_URL}/api/auth-services/user`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      }).then( data => {
        if(data.status != 200) Router.push('/login')
      })
    }

  }, []);
  return (
    <>
      { children }
    </>
  )
}