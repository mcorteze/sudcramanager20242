import React from 'react';
import './CabezalSidebar.css'
import logo from '../images/logo3.png';

export default function CabezalSidebar () {
    const logoStyle = {
        height: '46px',
        backgroundImage: `url(${logo})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      };

  return (
    <div className='cabezal-sidebar'>
        <div className='cabezal-img' style={logoStyle} />
        <span>Sudcra Manager</span>
    </div>
  );
};