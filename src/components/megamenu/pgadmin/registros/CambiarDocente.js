import React from 'react';

export default function CambiarDocente () {
  return (
    <div className='apuntes-canvas'>
      <div className='apuntes-titulo-descripcion'>Cambiar docente titular</div>
      <h1>Cambiar docente titular</h1>
      <div className='apunte-card1'>
        Trabajar desde sudcraaccess<br /><br />
        (1) En tabla sedes: capturar id_sede.<br />
        (2) En tabla docentes: capturar rut del nuevo docente.<br />
        (3) En tabla secciones: filtrar por sección y id_sede.<br />
        (4) En campo rut, sobreescribir por rut del nuevo docente.<br />
      </div>
      <div className='apunte-obs'>
        Crear docente en caso de no existir en tabla docentes.
      </div>
      {/* -------------------------------------- */}
    </div>
  );
};
