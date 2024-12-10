import React from 'react';

export default function SeguimientoHoja () {
  return (
    <div className='apuntes-canvas'>
      <div className='apuntes-titulo-descripcion'>Seguimiento de hoja de respuesta</div>
      <h1>Primer paso</h1>
      <div className='apunte-card1'>
        pasos<br /><br />
        (1) corroborar errores en la subida de imagen viendo las imágenes, buscando errores con la consulta.<br />
        (2) ver el id de subida y ver el id actual de revisión, ya sea en la carpeta por procesar o en la lista de 'imagenes' en SharePoint <br />
        (3) si el id ya paso se puede consultar si ya existe nota. <br />
        (4) si ya tiene nota debería tener informe emitido.
      </div>
      <div className='apunte-obs'>
        Observaciones.
      </div>
      {/* -------------------------------------- */}
    </div>
  );
};
