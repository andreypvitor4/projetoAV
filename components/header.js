import Link from 'next/link'
import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/authContext'
import Account from './account'
import Image from 'next/image'
import logo from '../public/logoAV.png'
import styles from '../styles/header/style.module.css'


export default function HeaderComponent() {
    const { user } = useContext(AuthContext)
    const accountText = !!user ? user.email : 'Log in'
    const [userMenuActiveClass, setUserMenuActiveClass] = useState('');

    function clickUserMenu() {
        const nextClassStatus = userMenuActiveClass == 'userMenuActive'?
            '': 'userMenuActive';
            setUserMenuActiveClass(nextClassStatus)
      }

    return (
        <header>
            <a name="header--top"></a>
            <div className={styles.presentation}>
                <Link href="/">
                    <a className={styles.logo}>
                        <Image src={logo} alt="logo"/>
                    </a>
                </Link>

                <div className={styles.login}>
                    {!user? (
                    <Link href="/login">
                        <a className={styles.loginText}>{accountText}</a>
                    </Link>) : (
                        <button 
                            className={styles.userText}
                            onClick={clickUserMenu}>
                                {accountText}
                        </button>
                    )}

                </div>
                
            </div>

            <Account 
                userMenuActiveClass={userMenuActiveClass}
                setUserMenuActiveClass={setUserMenuActiveClass}
                clickUserMenu={clickUserMenu}
            />

        </header>
    )
}