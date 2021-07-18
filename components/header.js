import Link from 'next/link'
import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/authContext'
import Account from './account'
import Image from 'next/image'
import logo from '../public/logoAV.png'


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
            <div className="header--presentation">
                <Link href="/">
                    <div className="header--logo">
                        <Image src={logo} alt="logo"/>
                    </div>
                </Link>

                <div className="header--login">
                    {!user? (
                    <Link href="/login">
                        <div className="header--loginText">{accountText}</div>
                    </Link>) : (
                        <button 
                            className="header--userText"
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