import React from 'react';

export default function SqlExtraccion () {
  return (
    <div className='apuntes-canvas' style={{ width: '600px'}}>
      <div className='apuntes-titulo-descripcion'>Extraer notas por alumno, según evaluación, asignatura, sede</div>
      <h1>Desde consulta nueva</h1>
      <div className='apunte-card1'>
        SELECT<br />
        &nbsp;&nbsp;&nbsp;&nbsp;s.cod_asig,<br />
        &nbsp;&nbsp;&nbsp;&nbsp;s.seccion,<br />
        &nbsp;&nbsp;&nbsp;&nbsp;s.rut_docente,<br />
        &nbsp;&nbsp;&nbsp;&nbsp;doc.nombre_doc,<br />
        &nbsp;&nbsp;&nbsp;&nbsp;doc.apellidos_doc,<br />
        &nbsp;&nbsp;&nbsp;&nbsp;s.jornada,<br />
        &nbsp;&nbsp;&nbsp;&nbsp;a.rut,<br />
        &nbsp;&nbsp;&nbsp;&nbsp;a.nombres,<br />
        &nbsp;&nbsp;&nbsp;&nbsp;a.apellidos,<br />
        &nbsp;&nbsp;&nbsp;&nbsp;a.sexo,<br />
        &nbsp;&nbsp;&nbsp;&nbsp;c.nota<br />
        FROM<br />
        &nbsp;&nbsp;&nbsp;&nbsp;calificaciones_obtenidas as co<br />
        JOIN calificaciones as c ON co.id_calificacion = c.id_calificacion<br />
        JOIN matricula_eval as mte ON co.id_matricula_eval = mte.id_matricula_eval<br />
        JOIN matricula as mt ON mte.id_matricula = mt.id_matricula<br />
        JOIN inscripcion as i ON mt.id_matricula = i.id_matricula<br />
        JOIN secciones as s ON i.id_seccion = s.id_seccion<br />
        JOIN docentes as doc ON s.rut_docente = doc.rut_docente<br />
        JOIN alumnos as a ON mt.rut = a.rut<br />
        WHERE s.id_sede = '10' <br />
        AND (<br />
          &nbsp;&nbsp;&nbsp;&nbsp;(mte.id_eval = 'MAT1111-2024001-4' AND s.cod_asig = 'MAT1111') <br />
          &nbsp;&nbsp;&nbsp;&nbsp;OR <br />
          &nbsp;&nbsp;&nbsp;&nbsp;(mte.id_eval = 'MAT5110-2024001-4' AND s.cod_asig = 'MAT5110')<br />
        );<br />
      </div>
      {/* -------------------------------------- */}
      <div className='apuntes-titulo-descripcion'>Extraer notas 0~10, todas las sedes, por asignatura</div>
      <h1>Desde consulta nueva</h1>
      <div className='apunte-card1'>
      SELECT<br />
      &nbsp;&nbsp;&nbsp;&nbsp;s.id_sede,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;s.cod_asig,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;s.seccion,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;s.rut_docente,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;doc.nombre_doc,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;doc.apellidos_doc,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;s.jornada,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;a.rut,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;a.nombres,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;a.apellidos,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;a.sexo,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '0' THEN c.nota END) AS nota_0,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '1' THEN c.nota END) AS nota_1,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '2' THEN c.nota END) AS nota_2,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '3' THEN c.nota END) AS nota_3,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '4' THEN c.nota END) AS nota_4,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '5' THEN c.nota END) AS nota_5,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '6' THEN c.nota END) AS nota_6,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '7' THEN c.nota END) AS nota_7,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '8' THEN c.nota END) AS nota_8,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '9' THEN c.nota END) AS nota_9,<br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '10' THEN c.nota END) AS nota_10<br />
      FROM calificaciones_obtenidas as co<br />
      JOIN calificaciones as c ON co.id_calificacion = c.id_calificacion<br />
      JOIN matricula_eval as mte ON co.id_matricula_eval = mte.id_matricula_eval<br />
      JOIN matricula as mt ON mte.id_matricula = mt.id_matricula<br />
      JOIN inscripcion as i ON mt.id_matricula = i.id_matricula<br />
      JOIN secciones as s ON i.id_seccion = s.id_seccion<br />
      JOIN docentes as doc ON s.rut_docente = doc.rut_docente<br />
      JOIN alumnos as a ON mt.rut = a.rut<br />
      WHERE s.id_sede IN (4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 16, 18, 19, 29, 74, 75, 76, 77, 79)<br />
      AND mte.id_eval IN ('PLC1101-2024001-0','PLC1101-2024001-1','PLC1101-2024001-2','PLC1101-2024001-3','PLC1101-2024001-4','PLC1101-2024001-5','PLC1101-2024001-6','PLC1101-2024001-7','PLC1101-2024001-8', 'PLC1101-2024002-9','PLC1101-2024002-10')<br />
      AND s.cod_asig = 'PLC1101'<br />
      GROUP BY s.id_sede, s.cod_asig, s.seccion, s.rut_docente, doc.nombre_doc, doc.apellidos_doc, s.jornada, a.rut, a.nombres, a.apellidos, a.sexo<br />
      ORDER BY s.id_sede ASC, s.seccion ASC, a.apellidos ASC;<br />
      </div>
      {/* -------------------------------------- */}
    </div>
  );
};
