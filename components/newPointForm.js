import { useRef, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { functionsContext } from '../contexts/globalFunctions'
import ClipLoader from "react-spinners/ClipLoader"
import { css } from "@emotion/react"
import styles from '../styles/newPointForm/style.module.css'

export default function NewPointForm(props) {
  const router = useRouter()
  const cancelButtonRef = useRef(null)
  const { fetchApiData, normalizeString: rs, handleMaxChar } = useContext(functionsContext)
  const [loading, setLoading] = useState(false);
  
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
    props.updateInputs({[e.target.name]: e.target.value})
  }

  function setInputsIndex() {
    let pointsIndexes = props.allPoints.map( elem => elem.id )
    let lastIndex = props.allPoints.length === 0? -1 : Math.max(...pointsIndexes)
    let newIndex = lastIndex + 1
    props.updateInputs({id: newIndex})
    
    if(newIndex === 0 ) {
      props.updateInputs({jaPassou: true})
    }else {
      props.updateInputs({jaPassou: false})
    }
  }
  
  async function handleSubmitForm(e) {
    e.preventDefault()
    
    if(props.submitFormOption === 'add') {
      setLoading(true)
      const { status } = await fetchApiData(`/api/routes-services/add-point?routeId=${router.query.routeId}`, 'POST', props.inputs)
      setLoading(false)

      if(status === 200) {
        props.setAllPoints(allPoints => [...allPoints, props.inputs])

        if(props.allCities.indexOf(rs(props.inputs.cidade)) == -1) {
          props.setAllCities(prev => [...prev, rs(props.inputs.cidade)])
        }
        resetInputs()
      }
    }
    if(props.submitFormOption === 'update') {
      setLoading(true)
      const { status } = await fetchApiData(`/api/routes-services/update-point?routeId=${router.query.routeId}`, 'PUT', props.inputs)
      setLoading(false)

      if(status === 200) {
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
    <div className={`${styles.formContainer} ${styles[props.activeFormClass]}`}>
        <div className={styles.formShadow}></div>
        
        <form className={styles.form} onSubmit={handleSubmitForm}>

          {loading? (
            <div className={styles.loading}>
              <ClipLoader size={150} />
            </div>
          ) : (
            <div>
              <div style={{fontSize: '10pt', textAlign: 'center'}}>
                Campos com * são obrigatórios
              </div>
              
              <div className={styles.inputDiv}>
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
              
              <div className={styles.twoInputsContainer}>
                <div className={styles.inputDiv}>
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

                <div className={styles.inputDiv}>
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

              <div className={styles.inputDiv}>
                <label htmlFor="npf--bairro">Bairro</label>
                <input 
                  type="text"
                  id="npf--bairro"
                  name="bairro"
                  value={props.inputs.bairro}
                  onChange={e => {handleMaxChar(e, 50); handleSetInputs(e);}}
                />
              </div>

              <div className={styles.twoInputsContainer}>
                <div className={styles.inputDiv}>
                  <label htmlFor="npf--rua">Rua</label>
                  <input 
                    type="text" 
                    id="npf--rua" 
                    name="rua" 
                    value={props.inputs.rua} 
                    onChange={e => {handleMaxChar(e, 50); handleSetInputs(e);}}
                  />
                </div>

                <div className={styles.inputDiv}>
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

              <div className={styles.buttons}>
                <button type="submit">Enviar</button>
                <button 
                type="button" 
                onClick={handleRemoveForm}
                ref={cancelButtonRef}>
                  Cancelar
                </button>
                <button type="reset" onClick={resetInputs}>Limpar dados</button>
              </div>
            </div>
          )}


        </form>
      </div>
  )
}