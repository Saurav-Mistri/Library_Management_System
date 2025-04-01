import React from 'react'

function Nav() {
    return (
        <div className='nav-bar'>
            <div className='title'>
                Admin
            </div>
            <ul className='top-nav'>
                <li>
                    <a href='/'>Logout</a>
                </li>
            </ul>
        </div>
    )
}

export default Nav
