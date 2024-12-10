import React from 'react';
import PowerAppsLogo from '../images/powerappslogo.png';
import PowerBiLogo from '../images/powerbilogo.png';
import FormsLogo from '../images/formslogo.png';
import './EnlacesFlotante.css';

export default function EnlacesFlotante() {
  return (
    <div className='sidebar'>
      <div className='sidebar-links'>
        {/* PowerApps */}
        <a href="https://apps.powerapps.com/play/e/default-72fd0b5a-8a6a-4cff-89f6-bde961f7e250/a/48675829-d9db-4fa7-ab75-8b6d6d2b032f?tenantId=72fd0b5a-8a6a-4cff-89f6-bde961f7e250&hint=c146b3e2-e175-46aa-9931-bd30bd54a870&sourcetime=1720104583100" target="_blank" rel="noopener noreferrer" className='sidebar-link'>
          <div className='sidebar-icon' style={{ backgroundImage: `url(${PowerAppsLogo})` }}></div>
          <span>Sistema Tickets</span>
        </a>
        <a href="https://apps.powerapps.com/play/e/default-72fd0b5a-8a6a-4cff-89f6-bde961f7e250/a/678f662e-2e2a-43da-abef-e7a009a1d951?tenantId=72fd0b5a-8a6a-4cff-89f6-bde961f7e250&hint=f3aa40ef-13fc-4fbd-92bd-622053fd035b&sourcetime=1720104629264" target="_blank" rel="noopener noreferrer" className='sidebar-link'>
          <div className='sidebar-icon' style={{ backgroundImage: `url(${PowerAppsLogo})` }}></div>
          <span>Sudcra Upload</span>
        </a>
        {/* PowerBi */}
        <a href="https://app.powerbi.com/groups/530c4e63-77c1-4129-a317-088008da3b84/reports/26e99117-7c49-43b4-af77-aa357c5d8dbe?experience=power-bi" target="_blank" rel="noopener noreferrer" className='sidebar-link'>
          <div className='sidebar-icon' style={{ backgroundImage: `url(${PowerBiLogo})` }}></div>
          <span>Monitor planillas</span>
        </a>
        <a href="https://app.powerbi.com/groups/530c4e63-77c1-4129-a317-088008da3b84/reports/3a4d7d7a-a44f-4b65-b6e1-f35b9847bb9d/6e316e19d1c27603d315?experience=power-bi" target="_blank" rel="noopener noreferrer" className='sidebar-link'>
          <div className='sidebar-icon' style={{ backgroundImage: `url(${PowerBiLogo})` }}></div>
          <span>Monitor SUDCRA</span>
        </a>
        {/* Forms */}
        <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=Wgv9cmqK_0yJ9r3pYffiULsiokZGRSBAgIwGh0xGo0dUQzhLQks3WThOUUQ0NjlSMlJWTUY1NUIyTC4u&origin=Invitation&channel=1" target="_blank" rel="noopener noreferrer" className='sidebar-link'>
          <div className='sidebar-icon' style={{ backgroundImage: `url(${FormsLogo})` }}></div>
          <span>Forms Matemáticas</span>
        </a>
        <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=Wgv9cmqK_0yJ9r3pYffiULsiokZGRSBAgIwGh0xGo0dURFBJMkE2OFpYU0pKTDkwQTFXNVVKNEFNRS4u" target="_blank" rel="noopener noreferrer" className='sidebar-link'>
          <div className='sidebar-icon' style={{ backgroundImage: `url(${FormsLogo})` }}></div>
          <span>Forms Lenguaje</span>
        </a>
        <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=Wgv9cmqK_0yJ9r3pYffiULsiokZGRSBAgIwGh0xGo0dUMlEyRkZTWkRaTlFBUjJMMjZKUFJUQkVTQS4u" target="_blank" rel="noopener noreferrer" className='sidebar-link'>
          <div className='sidebar-icon' style={{ backgroundImage: `url(${FormsLogo})` }}></div>
          <span>Forms Emprendimiento</span>
        </a>
        <a href="https://forms.office.com/r/6TKmmP25pe" target="_blank" rel="noopener noreferrer" className='sidebar-link'>
          <div className='sidebar-icon' style={{ backgroundImage: `url(${FormsLogo})` }}></div>
          <span>Forms Ética</span>
        </a>
        <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=Wgv9cmqK_0yJ9r3pYffiULsiokZGRSBAgIwGh0xGo0dURVZINlFBNjFOUUtONDJWN0tKOVpLWUtaRC4u" target="_blank" rel="noopener noreferrer" className='sidebar-link'>
          <div className='sidebar-icon' style={{ backgroundImage: `url(${FormsLogo})` }}></div>
          <span>Forms Inglés</span>
        </a>
      </div>
    </div>
  );
}
