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
                    <h2>Garantias</h2>
                    <p>Pagamentos 100% seguros</p>
                    <p>Devolução grátis dentro de 10 dias a partir da compra</p>
                    <p>Caso haja dúvidas, por favor entre em contato</p>
                </div>

                <div className="footer--contact">
                    <h2>Contatos</h2>
                    <p><FontAwesomeIcon className="footer--iconImage" icon={faWhatsapp} style={{
                        width: '15px'
                    }}/> (19) 9 9999-9999</p>
                    <p><FontAwesomeIcon className="footer--iconImage" icon={faWhatsapp} style={{
                        width: '15px'
                    }}/> (19) 9 9777-7777</p>
                    <p> <FontAwesomeIcon className="footer--iconImage" icon={faEnvelope} style={{
                        width: '15px'
                    }}/> larakelly@lojalk.com</p>
                </div>

                <div className="footer--contact">
                    <h2>Lara</h2>
                    <p>A lara é um lixo</p>
                    <p>A lara é um lixo</p>
                    <p>A lara é um lixo</p>
                </div>

            </div>
        </footer>
    )
}