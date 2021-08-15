import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
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
                    <Link href="https://github.com/andreypvitor4">
                        <a  className={styles.icon}> <FontAwesomeIcon className={styles.iconImage} icon={faGithub} size="2x"/> </a>
                    </Link>
                    <Link href="https://www.linkedin.com/in/andrey-vitor-862670213/">
                        <a  className={styles.icon}> <FontAwesomeIcon className={styles.iconImage} icon={faLinkedin} size="2x"/> </a>
                    </Link>
                    <Link href="https://www.facebook.com/andrey.vitor.3">
                        <a  className={styles.icon}> <FontAwesomeIcon className={styles.iconImage} icon={faFacebookSquare} size="2x"/> </a>
                    </Link>
                    <Link href="https://www.instagram.com/andreypvitor/">
                        <a  className={styles.icon}> <FontAwesomeIcon className={styles.iconImage} icon={faInstagram} size="2x"/> </a>
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