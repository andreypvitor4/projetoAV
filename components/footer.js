import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faTiktok } from '@fortawesome/free-brands-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import styles from '../styles/footer/style.module.css'

export default function FooterComponent() {
    return(
        <footer className={styles.footer}>
            <div className={styles.goToTop}>
                <a href="#header--top" className={styles.goToTopLink}>
                    <div>Voltar para o topo da página.</div>
                </a>
            </div>

            <div className={styles.iconsContainer}>
                <div id="icons" className={styles.divIcons}>
                    <Link href="/">
                        <a  className={styles.icon}> <FontAwesomeIcon className={styles.iconImage} icon={faInstagram} /> </a>
                    </Link>
                    <Link href="/">
                        <a  className={styles.icon}> <FontAwesomeIcon className={styles.iconImage} icon={faFacebookSquare} /> </a>
                    </Link>
                    <Link href="/">
                        <a  className={styles.icon}> <FontAwesomeIcon className={styles.iconImage} icon={faYoutube} /> </a>
                    </Link>
                    <Link href="/">
                        <a  className={styles.icon}> <FontAwesomeIcon className={styles.iconImage} icon={faTiktok} /> </a>
                    </Link>
                </div>
            </div>

            <div className={styles.container}>

                <div className={styles.info}>
                    <h2>Acesso</h2>
                    <p>Caso tenha interesse em testar</p>
                    <p>esse serviço, entre em contato</p>
                    <p>para solicitar acesso</p>
                </div>

                <div className={styles.contact}>
                    <a name="footer--contact"></a>
                    <h2>Contatos</h2>
                    <p><FontAwesomeIcon className={styles.iconImage} icon={faWhatsapp} style={{
                        width: '15px'
                    }}/> (19) 9 9997-4291</p>
                    <p><FontAwesomeIcon className={styles.iconImage} icon={faWhatsapp} style={{
                        width: '15px'
                    }}/> (19) 3481-6123</p>
                    <p> <FontAwesomeIcon className={styles.iconImage} icon={faEnvelope} style={{
                        width: '15px'
                    }}/> andreypvitor@gmail.com</p>
                </div>

                <div className={styles.contact}>
                    <h2>Projeto</h2>
                    <p>Esse é um projeto pessoal</p>
                    <p>sem fins lucrativos</p>
                </div>

            </div>
        </footer>
    )
}