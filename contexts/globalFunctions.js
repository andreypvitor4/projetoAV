import { createContext } from "react";
import { parseCookies } from 'nookies'


const updateInputs = (newInputs, setInputs) => {
  setInputs(prevState => (
      {
      ...prevState,
      ...newInputs
      }
  ))
}

const handleMaxChar = (e, max = 30) => {
  let maxChar = e.currentTarget.value
  if(e.currentTarget.value.length > max) {
    e.currentTarget.value = maxChar.slice(0,max)
  }
}

const normalizeString = (string) => {
  let normalizedString = string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  return normalizedString.toLowerCase()
}

const fetchApiData = async (url, method, body) => {
  const { 'AV--token': token } = parseCookies()

  if(body) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOME_URL}${url}`, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    return { data, status: res.status}
  }else {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOME_URL}${url}`, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
    })
    const data = await res.json()
    return { data, status: res.status}
  }
}

export const functionsContext = createContext({
  updateInputs, 
  handleMaxChar, 
  fetchApiData,
  normalizeString,
})