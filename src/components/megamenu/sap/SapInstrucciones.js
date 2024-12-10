import React from 'react';
// La secuencia del apunte es:
// Titulo recortado
// Parrafo de una linea que explique brevemente lo que se hara
// Punteo de pasos

export default function SapSabana() {
  return (
    <div className = 'apuntes-canvas'>
      <div className='apuntes-titulo-descripcion'>Instrucciones para la descarga de bases desde SAP</div>
      <h1>Descargas bases iniciales que no tienen requisitos</h1>
      <div className='apuntes-text'>
          <ul>
            <li>Descargar Sábana desde SAP (revisar apuntes)</li>
            <li>Descargar Índice desde SAP (revisar apuntes)</li>
          </ul>
      </div>
      <h1>Procesar bases descargadas</h1>
      <div className='apuntes-text'>
          <ul>
            <li>Consolidar índices</li>
            <li>Cambiar a tipo texto toda columna de rut presente en las descargas</li>
            <li>Copiar campos de las tablas respectivas de access a las descargas en planilla excel para asegurar compatibilidad en los nombres de los campos.</li>
            <li>Cargar manualmente Sábana e Índice a access 'actualizasudcra'.</li>
          </ul>
      </div>
      <h1>Descargar Docentes e Inscripción</h1>
      <ul>
        <li>Modificar consulta '1 crea asignaturas' para considerar a todos los programas actuales</li>
        <li>Ejecutar '1 crea asignaturas' para actualizar las consultas(no tablas) 'asignaturas' y secciones.</li>
        <li>Descargar Docente desde SAP (usar registros de cod_asig de la consulta 'asignatura')</li>
        <li>Descargar Inscripción desde SAP (usar registros id_secciones de consulta 'id_seccion')</li>
      </ul>
      <div className='apunte-obs'>Observación: consulta '1 crea asignaturas' crea tabla con registros de código de asignatura, requiere especificar, en el código SQL, todos los programas que se considerarán.</div>
      <h1>Procesar bases Docente e Inscripción</h1>
      <div className='apuntes-text'>
          <ul>
            <li>Cambiar a tipo texto toda columna de rut presente en las descargas</li>
            <li>Cargar manualmente Docente e Inscripción a access 'actualizasudcra'.</li>
          </ul>
      </div>
      <h1>Emitir consolidado para cargar en pgAdmin</h1>
      <ul>
        <li>Descargar el contenido de las consultas de: alumnos, asignatura, docentes, inscripcion(quitar la numeración en el nombre proveniente de la consulta de access), matrícula y secciones.</li>
        <li>Consolidar las descargas de access en un libro excel en el siguiente orden:
          <ul>
            <li>alumnos</li>
            <li>asignaturas</li>
            <li>docentes</li>
            <li>matrícula</li>
            <li>secciones</li>
            <li>inscripción</li>
          </ul>
        </li>
      </ul>
      <h1>Actualizar la base de datos en pgAdmin</h1>
      <ul>
        <li>Eliminar los registros actuales de las tablas <code>inscripcion</code> y <code>matricula</code> ejecutando los siguientes comandos SQL:
          <ul>
            <li><code>DELETE FROM inscripcion;</code></li>
            <li><code>DELETE FROM matricula;</code></li>
          </ul>
        </li>
        <li>Cargar los registros consolidados del archivo Excel usando el procedimiento <code>carga_tabla_actualiza</code>.</li>
      </ul>
      <div className='apuntes-footer'></div>
    </div>
  );
};
