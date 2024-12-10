import React from 'react';

export default function PlanillaBase () {
  return (
    <div className='apuntes-canvas'>
      <div className='apuntes-titulo-descripcion'>Emitir planillas de sección a partir de planilla base. (evaluaciones con planilla)</div>
      <h1>Correr rutina de python que crea planillas</h1>
      <div className='apunte-card1'>
        (1) Abrir rutina crea_planillas.py. <br />
        (2) Indicar igualación 1 == 1. <br />
        (3) Verificar que otros programas sean 1 == 2. <br />
        (4) Editar constantes: cod_asig, prueba(numeración interna) y sufijo. <br />
        (5) Ejecutar rutina.
      </div>
      <div className='apunte-obs'>
        Carpeta de destino se define en la constante: carp.
      </div>
      {/* -------------------------------------- */}
    </div>
  );
};
