import React from 'react';
import PowerAppsLogo from '../images/powerappslogo.png';
import PowerBiLogo from '../images/powerbilogo.png';
import FormsLogo from '../images/formslogo.png'
import './EnlacePage.css';

export default function EnlacePage() {
  return (
    <div className='page-full'>
      <h1>Enlaces a aplicaciones de SUDCRA</h1>
      {/* PowerApss */}
      <div className='grid-apps'>
        {/* Tickets app*/}
        <a href="https://apps.powerapps.com/play/e/default-72fd0b5a-8a6a-4cff-89f6-bde961f7e250/a/48675829-d9db-4fa7-ab75-8b6d6d2b032f?tenantId=72fd0b5a-8a6a-4cff-89f6-bde961f7e250&hint=c146b3e2-e175-46aa-9931-bd30bd54a870&sourcetime=1720104583100" target="_blank" rel="noopener noreferrer" className='app-container'>
          <div
            className='app-image'
            style={{ backgroundImage: `url(${PowerAppsLogo})` }}
          ></div>
          <h4>Sistema Tickets</h4>
          <p>Comunicación</p>
        </a>
        {/* Upload app*/}
        <a href="https://apps.powerapps.com/play/e/default-72fd0b5a-8a6a-4cff-89f6-bde961f7e250/a/678f662e-2e2a-43da-abef-e7a009a1d951?tenantId=72fd0b5a-8a6a-4cff-89f6-bde961f7e250&hint=f3aa40ef-13fc-4fbd-92bd-622053fd035b&sourcetime=1720104629264" target="_blank" rel="noopener noreferrer" className='app-container'>
          <div
            className='app-image'
            style={{ backgroundImage: `url(${PowerAppsLogo})` }}
          ></div>
          <h4>Sudcra upload</h4>
          <p>Subida de imágenes</p>
        </a>
        {/* ----------*/}
      </div>
      {/* PowerBi */}
      <div className='grid-apps'>
        {/* Monitor de planillas*/}
        <a href="https://app.powerbi.com/groups/530c4e63-77c1-4129-a317-088008da3b84/reports/26e99117-7c49-43b4-af77-aa357c5d8dbe?experience=power-bi" target="_blank" rel="noopener noreferrer" className='app-container'>
          <div
            className='app-image'
            style={{ backgroundImage: `url(${PowerBiLogo})` }}
          ></div>
          <h4>Monitor planillas</h4>
          <p>Ver planillas subidas</p>
        </a>
        {/* Monitor SUDCRA */}
        <a href="https://app.powerbi.com/links/Smfn-mqVmu?ctid=72fd0b5a-8a6a-4cff-89f6-bde961f7e250&pbi_source=linkShare&bookmarkGuid=521694c0-40c4-4fed-a3fc-aec482bc22c5" target="_blank" rel="noopener noreferrer" className='app-container'>
          <div
            className='app-image'
            style={{ backgroundImage: `url(${PowerBiLogo})` }}
          ></div>
          <h4>Monitor SUDCRA</h4>
          <p>Resultados académicos</p>
        </a>
        {/* ----------*/}
      </div>
      {/* Forms */}
      <div className='grid-apps'>
        {/* Forms Matemáticas */}
        <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=Wgv9cmqK_0yJ9r3pYffiULsiokZGRSBAgIwGh0xGo0dUQzhLQks3WThOUUQ0NjlSMlJWTUY1NUIyTC4u&origin=Invitation&channel=1" target="_blank" rel="noopener noreferrer" className='app-container'>
          <div
            className='app-image'
            style={{ backgroundImage: `url(${FormsLogo})` }}
          ></div>
          <h4>Forms Matemáticas</h4>
          <p>Subir planilla</p>
        </a>
        {/* Forms Lenguaje */}
        <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=Wgv9cmqK_0yJ9r3pYffiULsiokZGRSBAgIwGh0xGo0dURFBJMkE2OFpYU0pKTDkwQTFXNVVKNEFNRS4u" target="_blank" rel="noopener noreferrer" className='app-container'>
          <div
            className='app-image'
            style={{ backgroundImage: `url(${FormsLogo})` }}
          ></div>
          <h4>Forms Lenguaje</h4>
          <p>Subir planilla</p>
        </a>
        {/* Forms Emprendimiento */}
        <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=Wgv9cmqK_0yJ9r3pYffiULsiokZGRSBAgIwGh0xGo0dUQTRWWjk5Q1E1Mk9JMjFUMTlFWkZYVE81Ny4u" target="_blank" rel="noopener noreferrer" className='app-container'>
          <div
            className='app-image'
            style={{ backgroundImage: `url(${FormsLogo})` }}
          ></div>
          <h4>Forms Emprendimiento</h4>
          <p>Subir planilla</p>
        </a>
        {/* Forms Ética */}
        <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=Wgv9cmqK_0yJ9r3pYffiULsiokZGRSBAgIwGh0xGo0dUMjdRTEFHWUVMUFRMUDVUS01MMk5XTE0xTy4u" target="_blank" rel="noopener noreferrer" className='app-container'>
          <div
            className='app-image'
            style={{ backgroundImage: `url(${FormsLogo})` }}
          ></div>
          <h4>Forms Ética</h4>
          <p>Subir planilla</p>
        </a>
        {/* Forms Inglés */}
        <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=Wgv9cmqK_0yJ9r3pYffiULsiokZGRSBAgIwGh0xGo0dUQjdFN1owOUdQOTA5VllBRUtXNlNESjZKWC4u" target="_blank" rel="noopener noreferrer" className='app-container'>
          <div
            className='app-image'
            style={{ backgroundImage: `url(${FormsLogo})` }}
          ></div>
          <h4>Forms Inglés</h4>
          <p>Subir planilla</p>
        </a>
        {/* ----------*/}
      </div>
    </div>
  );
}
