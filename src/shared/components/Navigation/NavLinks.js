import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom'

import Button from '../FormElements/Button'
import {AuthContext} from '../../context/auth-context'
import './NavLinks.css'

const NavLinks = (props) => {

    const auth = useContext(AuthContext);

    const logoutHandler = (event) => {
        event.preventDefault();
        auth.logout();
    };

    return <ul className='nav-links'>
        <li>
            <NavLink to="/" exact>ALL USERS</NavLink>
        </li>
        {auth.isLoggedIn && <li>
            <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>}
        {auth.isLoggedIn && <li>
            <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>}
        <li>
            {auth.isLoggedIn 
            ?<Button onClick={logoutHandler}>LOGOUT</Button>
            :<NavLink to="/auth">AUTHENTICATE</NavLink>}
        </li>
    </ul>
};

export default NavLinks;