import Link from 'next/link'
import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/authContext'
import Account from './account'


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

            <Account 
                userMenuActiveClass={userMenuActiveClass}
                setUserMenuActiveClass={setUserMenuActiveClass}
                clickUserMenu={clickUserMenu}
            />

        </header>
    )
}