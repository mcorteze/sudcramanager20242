import React from 'react';

import Image005 from '../../../images/apuntes-sap/sap005.png';

export default function SapIndice () {
  return (
    <div className = 'apuntes-canvas'>
      <div className='apuntes-titulo-descripcion'>Descargar "Indice" desde SAP</div>
      <h1>Transacción: Programa ZCMD_INDICE</h1>
      <div className='apunte-card1'>
        Ingresar: (1) Año. (2) Semestre, (3) Sede, (4) Directorio. (5) Ejecutar (F8)
        <div className='apunte-img'>
          <img style = {{ width: '320px'}} src={Image005} alt="Indice" />
        </div>
        (1) Presionar boton continuar o Enter.
      </div>
    </div>
  );
};