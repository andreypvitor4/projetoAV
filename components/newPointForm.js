import { parseCookies } from 'nookies'
import { useRef } from 'react'
import { useRouter } from 'next/router'

export default function NewPointForm(props) {
  const router = useRouter()
  const cancelButtonRef = useRef(null)
  
  function resetInputs() {
    props.updateInputs({
      id: 0,
      cep: '',
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      numero: '',
    })
  }

  async function handleCep(){
    if(props.inputs.cep) {
      try {
        const data = await fetch('https://viacep.com.br/ws/'+props.inputs.cep+'/json/')
        const endereco = await data.json()
        props.updateInputs({
          estado: endereco?.uf,
          cidade: endereco?.localidade,
          bairro: endereco?.bairro,
          rua: endereco?.logradouro,
        })    
      } catch (error) {
        alert('Digite um cep válido')
      }
    }
  }

  function handleSetInputs(e) {
    if(props.allPoints.length === 0) {
      props.updateInputs({jaPassou: true})
    }else {
      props.updateInputs({jaPassou: false})
    }
    props.updateInputs({[e.target.name]: e.target.value})
  }

  function setInputsIndex() {
    let pointsIndexes = props.allPoints.map( elem => elem.id )
    let lastIndex = props.allPoints.length === 0? -1 : Math.max(...pointsIndexes)
    let newIndex = lastIndex + 1
    props.updateInputs({id: newIndex})
  }

  function rs(string) {
    let normalizedString = string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return normalizedString.toLowerCase()
  }
  
  async function handleSubmitForm(e) {
    e.preventDefault()
    const { 'AV--token': token } = parseCookies()
    
    if(props.submitFormOption === 'add') {
      const data = await fetch(`http://10.0.1.10:3000/api/routes-services/add-point?routeName=${router.query.routeName}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(props.inputs),
      })
      if(data.status === 200) {
        props.setAllPoints(allPoints => [...allPoints, props.inputs])

        if(props.allCities.indexOf(rs(props.inputs.cidade)) == -1) {
          props.setAllCities(prev => [...prev, rs(props.inputs.cidade)])
        }

        resetInputs()
      }
    }
    if(props.submitFormOption === 'update') {
      const data = await fetch(`http://10.0.1.10:3000/api/routes-services/update-point?routeName=${router.query.routeName}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(props.inputs),
      })

      if(data.status === 200) {
        props.setAllPoints(allPoints => {
          allPoints[props.choosenPointKey] = props.inputs
          return allPoints
        })
        resetInputs()
        cancelButtonRef.current.click()
      }
    }
  }

  function handleMaxChar(e, max) {
    let maxChar = e.currentTarget.value
    if(e.currentTarget.value.length > max) {
      e.currentTarget.value = maxChar.slice(0,max)
    }
  }

  function handleRemoveForm() {
    props.setActiveFormClass('')
  }

  return (
    <div className={`npf--formContainer ${props.activeFormClass}`}>
        <div className="npf--formShadow"></div>
        
        <form className="npf--form" onSubmit={handleSubmitForm}>

          <div className="npf--inputDiv">
            <label htmlFor="npf--cep">Cep</label>
            <input 
              type="text" 
              id="npf--cep" 
              name="cep" 
              value={props.inputs.cep} 
              onChange={e => {handleMaxChar(e, 20); handleSetInputs(e);}} 
              onBlur={handleCep} 
              onClick={setInputsIndex}
            />
          </div>
          
          <div className="twoInputsContainer">
            <div className="npf--inputDiv">
              <label htmlFor="cidade">Cidade*</label>
              <input 
                type="text" 
                id="cidade" 
                name="cidade"
                required
                value={props.inputs.cidade} 
                onChange={e => {handleMaxChar(e, 30); handleSetInputs(e);}}
                onBlur={setInputsIndex}
              />
            </div>

            <div className="npf--inputDiv">
              <label htmlFor="npf--estado">Estado*</label>
              <input 
                type="text" 
                id="npf--estado" 
                name="estado"
                required
                value={props.inputs.estado} 
                onChange={e => {handleMaxChar(e, 2); handleSetInputs(e);}}
              />
            </div>
          </div>

          <div className="npf--inputDiv">
            <label htmlFor="npf--bairro">Bairro</label>
            <input 
              type="text"
              id="npf--bairro"
              name="bairro"
              value={props.inputs.bairro}
              onChange={e => {handleMaxChar(e, 50); handleSetInputs(e);}}
            />
          </div>

          <div className="twoInputsContainer">
            <div className="npf--inputDiv">
              <label htmlFor="npf--rua">Rua</label>
              <input 
                type="text" 
                id="npf--rua" 
                name="rua" 
                value={props.inputs.rua} 
                onChange={e => {handleMaxChar(e, 50); handleSetInputs(e);}}
              />
            </div>

            <div className="npf--inputDiv">
              <label htmlFor="npf--numero">Número</label>
              <input 
                type="text"
                id="npf--numero"
                name="numero"
                value={props.inputs.numero}
                onChange={e => {handleMaxChar(e, 10); handleSetInputs(e);}}
              />
            </div>
          </div>

          <div className="npf--buttons">
            <button type="submit">Enviar</button>
            <button 
            type="button" 
            onClick={handleRemoveForm}
            ref={cancelButtonRef}>
              Cancelar
            </button>
            <button type="reset" onClick={resetInputs}>Limpar dados</button>
          </div>

        </form>
      </div>
  )
}