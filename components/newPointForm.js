import { parseCookies } from 'nookies'
import { useRef } from 'react'

export default function NewPointForm(props) {
  const cancelButtonRef = useRef(null)
  
  function resetInputs() {
    props.updateInputs({
      id: '',
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
    if(props.allPoints.length === 0 && props.inputs.id === '0') {
      props.updateInputs({jaPassou: true})
    }else {
      props.updateInputs({jaPassou: false})
    }
    props.updateInputs({[e.target.name]: e.target.value})
  }
  
  async function handleSubmitForm(e) {
    e.preventDefault()
    const { 'AV--token': token } = parseCookies()
    
    if(props.submitFormOption === 'add') {
      const data = await fetch('http://10.0.1.10:3000/api/routes-services/add-point', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(props.inputs),
      })
      if(data.status === 200) {
        props.setAllPoints(allPoints => [...allPoints, props.inputs])
        resetInputs()
      }
    }
    if(props.submitFormOption === 'update') {
      const data = await fetch('http://10.0.1.10:3000/api/routes-services/update-point', {
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

  function handleRemoveForm() {
    props.setActiveFormClass('')
  }

  return (
    <div className={`npf--formContainer ${props.activeFormClass}`}>
        <div className="npf--formShadow"></div>
        
        <form className="npf--form" onSubmit={handleSubmitForm}>
          <div className="npf--inputDiv">
            <label htmlFor="npf--id">id</label>
            <input type="text" id="npf--id" name="id" value={props.inputs.id} onChange={handleSetInputs}/>
          </div>

          <div className="npf--inputDiv">
            <label htmlFor="npf--cep">Cep</label>
            <input type="text" id="npf--cep" name="cep" value={props.inputs.cep} onChange={handleSetInputs} onBlur={handleCep}/>
          </div>
          
          <div className="twoInputsContainer">
            <div className="npf--inputDiv">
              <label htmlFor="cidade">Cidade</label>
              <input type="text" id="cidade" name="cidade" value={props.inputs.cidade} onChange={handleSetInputs}/>
            </div>

            <div className="npf--inputDiv">
              <label htmlFor="npf--estado">Estado</label>
              <input type="text" id="npf--estado" name="estado" value={props.inputs.estado} onChange={handleSetInputs}/>
            </div>
          </div>

          <div className="npf--inputDiv">
            <label htmlFor="npf--bairro">Bairro</label>
            <input type="text" id="npf--bairro" name="bairro" value={props.inputs.bairro} onChange={handleSetInputs}/>
          </div>

          <div className="twoInputsContainer">
            <div className="npf--inputDiv">
              <label htmlFor="npf--rua">Rua</label>
              <input type="text" id="npf--rua" name="rua" value={props.inputs.rua} onChange={handleSetInputs}/>
            </div>

            <div className="npf--inputDiv">
              <label htmlFor="npf--numero">Número</label>
              <input type="text" id="npf--numero" name="numero" value={props.inputs.numero} onChange={handleSetInputs}/>
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