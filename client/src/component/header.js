import React from 'react';
import '../assets/styles.css'
import { Link } from 'react-router-dom';
import Menubar from './menubar';
import { useState } from 'react';

function Header(props) {

    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };


    return (
        <div className='header'>
            <Link to="/main" className='logo'>Lemon Tree</Link>
            <img src='assets/icon_header.png' alt="" className='header-icon' onClick={toggleMenu}/>
            <Menubar menuVisible={menuVisible} setMenuVisible={setMenuVisible}/>
        </div>
    );
}

export default Header;