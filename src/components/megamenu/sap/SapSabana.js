import React from 'react';
import sabanaImage001 from '../../../images/apuntes-sap/sap001.png';
import sabanaImage002 from '../../../images/apuntes-sap/sap002.png';
import sabanaImage003 from '../../../images/apuntes-sap/sap003.png';
import sabanaImage004 from '../../../images/apuntes-sap/sap004.png';
import sabanaImage009 from '../../../images/apuntes-sap/sap009.png';

export default function SapSabana() {
  return (
    <div className = 'apuntes-canvas'>
      <div className='apuntes-titulo-descripcion'>Descargar "Sabana" desde SAP</div>
      <h1>Transacción: Horario por carrera</h1>
      <div className='apunte-card1'>
        Ingresar: (1) Año. (2) Período y (3) Ejecutar o presionar F8.
        <div className='apunte-img'>
          <img style = {{ width: '387px'}} src={sabanaImage001} alt="Sabana" />
        </div>
      </div>
      <div className='apunte-card1'>
        (1) Presionar boton continuar o Enter.
        <div className='apunte-img'>
          <img style = {{ width: '387px'}} src={sabanaImage002} alt="Sabana" />
        </div>
      </div>
      <div className='apunte-card1'>
        (1) Presionar botón continuar o Enter.
        <div className='apunte-img'>
          <img style = {{ width: '411px'}} src={sabanaImage003} alt="Sabana" />
        </div>
      </div>
      <div className='apunte-card1'>
        (1) Establecer directorio y fichero o sólo directorio y escribir fichero en (2) <br />
        (3) Presionar Crear para confirmar.
        <div className='apunte-img'>
          <img style = {{ width: '450px'}} src={sabanaImage009} alt="Sabana" />
        </div>
      </div>
      <div className='apunte-card1'>
        (1) Seleccionar texto con tabuladores. (2) Presionar botón continuar o Enter.
        <div className='apunte-img'>
          <img style = {{ width: '254px'}} src={sabanaImage004} alt="Sabana" />
        </div>
      </div>
    </div>
  );
};
