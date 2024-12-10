import React from 'react';

import Image006 from '../../../images/apuntes-sap/sap006.png';
import Image007 from '../../../images/apuntes-sap/sap007.png';
import Image008 from '../../../images/apuntes-sap/sap008.png';
import Image010 from '../../../images/apuntes-sap/sap010.png';
import Image011 from '../../../images/apuntes-sap/sap011.png';

export default function SapDocente () {
  return (
    <div className = 'apuntes-canvas'>
      <div className='apuntes-titulo-descripcion'>Descargar "Reporte Moodle(docentes)" desde SAP</div>
      <h1>Transacción: Reporte Moodle</h1>
      <div className='apunte-card1'>
        Ingresar: <br />
        (1) Año. (2) Semestre, (3) Directorio.
        <div className='apunte-img'>
          <img style = {{ width: '330px'}} src={Image006} alt="Moodle" />
        </div>
      </div>
      <div className='apunte-card1'>
        (4) Digitar algún caracter, con el propósito de acceder a (5)
        <div className='apunte-img'>
          <img style = {{ width: '330px'}} src={Image007} alt="Moodle" />
        </div>
      </div>
      <div className='apunte-card1'>
        (5) Cargar codigo de asignaturas(COD_ASIG) pegando registros desde el portapapeles
        <div className='apunte-img'>
          <img style = {{ width: '330px'}} src={Image008} alt="Moodle" />
        </div>
      </div>
      <div className='apunte-obs'>
        Especificar ruta de directorio distinta de C.
      </div>
      <div className='apunte-card1'>
        (6) Cambiar Tipo de reporte a 'Profesores'
        <div className='apunte-img'>
          <img style = {{ width: '240px'}} src={Image010} alt="Moodle" />
        </div>
      </div>
      <div className='apunte-card1'>
        (7) Ejecutar (F8)'
        <div className='apunte-img'>
          <img style = {{ width: '200px'}} src={Image011} alt="Moodle" />
        </div>
      </div>
    </div>
  );
};
