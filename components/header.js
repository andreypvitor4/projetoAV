import Link from 'next/link'
import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext'
import Account from './account'


export default function HeaderComponent() {
    const { user } = useContext(AuthContext)
    const accountText = !!user ? user.email : 'Log in'

    function clickUserMenu(e) {
        const userMenu = document.querySelector('#header__userMenu')
        userMenu.classList.toggle('userMenuActive')
        const shadow = document.querySelector('#header__shadowBackground')
        shadow.classList.toggle('userMenuActive')
        const active = userMenu.classList.contains('userMenuActive')
        e.currentTarget.setAttribute('aria-expanded', active)
        if(active) {
            e.currentTarget.setAttribute('aria-label', 'Fechar Menu')
        }else {
            e.currentTarget.setAttribute('aria-label', 'Abrir Menu')
        }
      }

    return (
        <header>
            <a name="header--top"></a>
            <div className="header--presentation">
                <Link href="/">
                    <a className="header--logo">
                        <img src="/logoAV.png" alt="logo" />
                    </a>
                </Link>

                <div className="header--login">
                    {!user? (
                    <Link href="/login">
                        <a className="header--loginText">{accountText}</a>
                    </Link>) : (
                        <button 
                            className="header--userText"
                            onClick={clickUserMenu}>
                                {accountText}
                        </button>
                    )}

                </div>
                
            </div>

            <Account />

        </header>
    )
}