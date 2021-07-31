import React from 'react'
import HeaderLogo from '../../images/logo.png'
import { Link } from 'react-router-dom'
import Menu from './Menu'
function Header() {
    return (
        <div className="header">
            <div className="header__container">
                <div className='header__logo'>
                    <Link to='/' onClick={() => window.scrollTo({ top: 0 })}>
                        <img style={{ width: '40px', }} src={HeaderLogo} alt='logo'>
                        </img>
                    </Link>
                </div>
                <Menu />
            </div>
        </div>
    )
}

export default Header
