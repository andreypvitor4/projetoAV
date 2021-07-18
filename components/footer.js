import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faTiktok } from '@fortawesome/free-brands-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

export default function FooterComponent() {
    return(
        <footer>
            <div className="footer--goToTop">
                <a href="#header--top" className="footer--GoToTopLink">
                    <div>Voltar para o topo da página.</div>
                </a>
            </div>

            <div className="footer--iconsContainer">
                <div id="icons" className="footer--divIcons">
                    <a href="/" className='footer--icon'> <FontAwesomeIcon className="footer--iconImage" icon={faInstagram} /> </a>
                    <a href="/" className='footer--icon'> <FontAwesomeIcon className="footer--iconImage" icon={faFacebookSquare} /> </a>
                    <a href="/" className='footer--icon'> <FontAwesomeIcon className="footer--iconImage" icon={faYoutube} /> </a>
                    <a href="/" className='footer--icon'> <FontAwesomeIcon className="footer--iconImage" icon={faTiktok} /> </a>
                </div>
            </div>

            <div className="footer--container">

                <div className="footer--info">
                    <h2>Acesso</h2>
                    <p>Caso tenha interesse em testar</p>
                    <p>esse serviço, entre em contato</p>
                    <p>para solicitar acesso</p>
                </div>

                <div className="footer--contact">
                    <a name="footer--contact"></a>
                    <h2>Contatos</h2>
                    <p><FontAwesomeIcon className="footer--iconImage" icon={faWhatsapp} style={{
                        width: '15px'
                    }}/> (19) 9 9997-4291</p>
                    <p><FontAwesomeIcon className="footer--iconImage" icon={faWhatsapp} style={{
                        width: '15px'
                    }}/> (19) 3481-6123</p>
                    <p> <FontAwesomeIcon className="footer--iconImage" icon={faEnvelope} style={{
                        width: '15px'
                    }}/> andreypvitor@gmail.com</p>
                </div>

                <div className="footer--contact">
                    <h2>Projeto</h2>
                    <p>Esse é um projeto pessoal</p>
                    <p>sem fins lucrativos</p>
                </div>

            </div>
        </footer>
    )
}