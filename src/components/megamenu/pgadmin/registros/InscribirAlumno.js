import React from 'react';
import mod001 from '../../../../images/apuntes-modificarregistros/apuntes-mod001.png';
import mod002 from '../../../../images/apuntes-modificarregistros/apuntes-mod002.png';
import mod003 from '../../../../images/apuntes-modificarregistros/apuntes-mod003.png';

export default function InscribirAlumno() {
  return (
    <div className='apuntes-canvas'>
      <div className='apuntes-titulo-descripcion'>Inscribir alumno en sección</div>
      <h1>Inscribir Alumno</h1>
      <div className='apunte-card1'>
        (1) En tabla sección: capturar id_seccion según sección a asignar.<br />
        (2) En tabla alumnos: capturar rut, si no existe se debe crear.<br />
        (3) En tabla matricula: capturar id_matricula según rut. Verificar en SAP, mediante la transacción de Inscripción de Ramos, si el estudiante tiene inscrita la asignatura.<br />
          <div className='apunte-img'>
            <img style = {{ width: '400px'}} src={mod001} alt="mod001" />
          </div>
        (4) En tabla inscripción: agregar registro en campo id_inscripcion. (Primero verificar si ya existe)<br />
        (5) Ejecutar la consulta: <br />
        INSERT INTO inscripcion (id_inscripcion, id_matricula, id_seccion)<br />
        VALUES ('id_matricula-id_seccion', 'id_matricula', 'id_seccion');
        (6) Crear planilla nuevamente, especificando asignatura y número de la evaluación.<br />
        <div className='apunte-img'>
          <img style = {{ width: '300px'}} src={mod002} alt="mod002" />
        </div>
        (8) Modificar temporalmente el archivo: listado_planillas.sql, agregando coincidencia por el id de la sección requerida.<br />
        <div className='apunte-img'>
          <img style = {{ width: '450px'}} src={mod003} alt="mod003" />
        </div>
      </div>
      <div className='apunte-obs'>
        Observación: si tiene más de una matricula, se debe verificar en SAP, mediante la transacción de Inscripción de Ramos, el código de plan de estudios al que corresponda la asignatura tomada.
      </div>
      {/* -------------------------------------- */}
    </div>
  );
}
