import { useState, useEffect } from "react";

export default function AreYouSure(props) {
  const [activeClass, setActiveClass] = useState('');

  useEffect(() => {
    props.active && setActiveClass('pts--deleteActiveClass')
  }, [props.active]);

  return (
    <div className={`pts--areYouSureScreen ${activeClass} `}>
      <div className="pts--areYouSure">
        <div style={{marginBottom: '10px'}}>{props.children}</div>
        <div>
          <button onClick={props.action}>Continuar</button>
          <button onClick={() => {setActiveClass(''); props.setActive(false)}}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}