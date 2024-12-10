import React from 'react';
import tablasImage001 from '../../../images/apuntes-tablas/tablas001.png';

export default function PlanillaBase () {
  return (
    <div className='apuntes-canvas'>
      <div className='apuntes-titulo-descripcion'>Crear planilla base, necesaria para emitir planillas. (evaluaciones con planilla)</div>
      <h1>Abrir app para crear planillas base. </h1>
      <div className='apunte-card1'>
          Listar asignaturas y número de la evaluación:
          <div className='apunte-img'>
            <img style = {{ width: '234px'}} src={tablasImage001} alt="Sabana" />
          </div>
      </div>
      <div className='apunte-obs'>
        App alojada en: C:\sudcraultra_access\
      </div>
      {/* -------------------------------------- */}
      <h1>Correr macros para crear planillas base.</h1>
      <div className='apunte-card1'>
          (1) Alt + F11. <br />
          (2) Seleccionar módulo: Para_Enviar_Planillas. <br />
          (3) Correr sub rutina: basespla(). <br />
      </div>
      <div className='apunte-obs'>
        Ruta de destino: C:/sudcraultra_access/SISTEMA/ - formato: cod_asig_prueba.xlsm
      </div>
       {/* -------------------------------------- */}
    </div>
  );
};
