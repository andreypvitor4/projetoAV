import { useState, useEffect } from "react";
import styles from '../styles/fadeInWindow/style.module.css'

export default function FadeInWindow(props) {
  const [activeClass, setActiveClass] = useState('');

  useEffect(() => {
    props.active && setActiveClass('deleteActiveClass')
  }, [props.active]);

  const noAction = () => {
    setActiveClass('')
    props.setActive(false)
  }
  return (
    <div className={`${styles.areYouSureScreen} ${styles[activeClass]}`}>
      <div className={styles.areYouSure}>
        <div className={styles.areYouSureChildren}>{props.children}</div>
        <div>
          <button onClick={props.action || noAction}>Continuar</button>
          <button 
            onClick={() => {setActiveClass(''); props.setActive(false)}}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}