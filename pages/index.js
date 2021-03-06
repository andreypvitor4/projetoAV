import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import FooterComponent from '../components/footer'
import styles from '../styles/home/style.module.css'
import FadeInWindow from '../components/fadeInWindow'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Home() {
  const [activeHelpWindow, setActiveHelpWindow ] = useState(false);

  return (
    <div className={styles.page}>
      <Head>
        <title>Home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

    <div className={styles.help} onClick={() => {setActiveHelpWindow(true)}}>
      <FontAwesomeIcon color="#444" size="2x" icon={faQuestionCircle} />
    </div>

    <FadeInWindow 
      active={activeHelpWindow} 
      setActive={setActiveHelpWindow}
    >
      <div style={{margin: '10px'}}>
        Esse é um aplicativo dedicado a criação de rotas para entregas.
        <br /><br />
        Adicione os endereços de parada, conclua a criação da rota<br /> e depois use a rota para ver os pontos de parada em ordem de distância.
      </div>
    </FadeInWindow>

    <nav className={styles.container}>
      <Link href="/manage-routes">
        <a className={styles.createRoute}>
          <p>Minhas rotas</p>
        </a>
      </Link>
      <a className={styles.useRoute} href="#footer--contact">
        <p>Contatos</p>
      </a>
    </nav>

    <FooterComponent />
      
    </div>
  )
}

Home.noAuthNeeded = true