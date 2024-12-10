import React from 'react';
import AjustesImage002 from '../../../images/apuntes-tablas/tablas002.png';

export default function TablaAjustes () {
  return (
    <div className='apuntes-canvas'>
      <div className='apuntes-titulo-descripcion'>Corregir validación item desarrollo en planilla base</div>
      <h1>Establecer lectura columna de desarrollo en planilla base</h1>
      <div className='apunte-card1'>
        (1) Mostrar 'columnas ocultas' comprendidas antes de DU. <br />
        (2) En 'columnas ocultas' referenciar columna de desarrollo a partir de BM con su columna correspondiente. <br />
        (3) Volver a ocultar 'celdas ocultas'.
      </div>
      <div className='apunte-obs'>
        Planillas base se ubican en: C:\sudcraultra_access\SISTEMA (computador de SUDCRA)
      </div>
      <h1>Reparar la validación de lista</h1>
      <div className='apunte-card1'>
        (1) En las celdas de desarrollo agregar validación de lista. <br />
        (2) Desmarcar 'Celda con lista desplegable'. <br />
        (3) Asignar Origen en hoja: 'Hoja1', rango a partir de columna: J.* <br />
        (4) Si las celdas pierden formato, aplicar 'Todos los bordes' y copiar formato para la primera celda.
          <div className='apunte-img'>
            <img style = {{ width: '186px'}} src={AjustesImage002} alt="Sabana" />
          </div> 
        (4) Guardar cambios y proceder con la emisión de planillas.
      </div>
      <div className='apunte-obs'>
        * La fila es correlativa a la posición que ocupa el item de desarrollo.
      </div>
      Si quiero volver a subir una tabla entonces debo Eliminar la tabla de especificaciones borrando el registro correspondiente desde la tabla "eval"
    </div>
  );
};
