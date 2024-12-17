const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(cors()); // Middleware para permitir solicitudes CORS desde cualquier origen
app.use(express.json()); // Middleware para permitir que Express entienda JSON en las solicitudes

const pool = new Pool({
  user: 'postgres',
  //host: '10.10.101.99',
  //database: 'sudcra',
  host: 'localhost',
  database: 'sudcra_1123',
  password: 'fec4a5n5',
  port: 5432,
});

// Definir la variable anio_periodo
const anio_periodo = '2024002';

// -----------------------------------
//          BUSCAR INFORME
// -----------------------------------
// Endpoint para obtener los programas
app.get('/api/programas', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT programa, cod_programa FROM asignaturas');
    res.json(result.rows); // Devuelve los datos de las sedes como JSON en la respuesta
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' }); // En caso de error, responde con un código de estado 500 y un mensaje de error JSON
  }
});

// Endpoint para obtener las sedes
app.get('/api/sedes', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_sede, nombre_sede FROM sedes ORDER BY nombre_sede ASC');
    res.json(result.rows); // Devuelve los datos de las sedes como JSON en la respuesta
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener las asignaturas por 'cod_programa'
app.get('/api/asignaturas/:cod_programa', async (req, res) => {
  const { cod_programa } = req.params;
  try {
    const result = await pool.query('SELECT cod_asig FROM asignaturas WHERE cod_programa = $1 ORDER BY cod_asig ASC', [cod_programa]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener las secciones por 'cod_asig' y 'id_sede' con la nueva consulta
app.get('/api/secciones/:cod_asig/:id_sede', async (req, res) => {
  const { cod_asig, id_sede } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM secciones as s JOIN docentes as d ON s.rut_docente = d.rut_docente WHERE cod_asig = $1 AND id_sede = $2 ORDER BY seccion ASC',
      [cod_asig, id_sede]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

app.get('/api/docentes_secciones/:id_seccion', async (req, res) => {
  const { id_seccion } = req.params;  // Obtenemos solo el parámetro id_seccion
  try {
    const query = `
      SELECT * 
      FROM seccion_docente as sdoc
      JOIN secciones as s ON sdoc.id_seccion = s.id_seccion
      JOIN asignaturas as a ON a.cod_asig = s.cod_asig
      JOIN sedes as sd ON s.id_sede = sd.id_sede
      JOIN docentes as d ON sdoc.rut_docente = d.rut_docente
      WHERE sdoc.id_seccion = $1;
    `;
    
    const result = await pool.query(query, [id_seccion]); // Solo pasamos id_seccion
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Eliminar un docente de la seccion
app.delete('/api/eliminar_docente_seccion', async (req, res) => {
  const { id_seccion, rut_docente } = req.body;

  try {
    // Usamos CTID para eliminar el primer registro que coincida
    const query = `
      DELETE FROM seccion_docente
      WHERE ctid IN (
        SELECT ctid
        FROM seccion_docente
        WHERE id_seccion = $1 AND rut_docente = $2
        LIMIT 1
      )
      RETURNING *;
    `;
    
    // Ejecutamos la consulta para eliminar el primer registro que coincide
    const result = await pool.query(query, [id_seccion, rut_docente]);

    if (result.rows.length > 0) {
      res.json({ message: 'Docente eliminado exitosamente' });
    } else {
      res.status(404).json({ error: 'No se encontró el docente' });
    }
  } catch (err) {
    console.error('Error al eliminar el docente:', err);
    res.status(500).json({ error: 'Error al eliminar el docente' });
  }
});


// Endpoint para obtener las pruebas por asignatura
app.get('/api/eval/:cod_asig', async (req, res) => {
  const { cod_asig } = req.params;
  try {
    const result = await pool.query('SELECT num_prueba, nombre_prueba FROM public.eval WHERE cod_asig = $1 ORDER BY id_eval ASC', [cod_asig]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener las matrículas por 'id_seccion'
app.get('/api/matriculas/:id_seccion/:cod_asig', async (req, res) => {
  const { id_seccion, cod_asig } = req.params;
  try {
    const result = await pool.query(
      `SELECT i.id_matricula, a.rut, a.apellidos, a.nombres, a.user_alum, a.sexo
       FROM public.inscripcion AS i
       JOIN public.matricula AS m ON i.id_matricula = m.id_matricula
       JOIN public.alumnos AS a ON a.rut = m.rut
       WHERE i.id_seccion = $1
       ORDER BY a.apellidos ASC`,
      [id_seccion]
    );

    const matriculas = result.rows;

    // Obtener las pruebas asociadas a la asignatura
    const pruebasResult = await pool.query(
      'SELECT num_prueba FROM public.eval WHERE cod_asig = $1 ORDER BY id_eval ASC',
      [cod_asig]
    );
    const pruebas = pruebasResult.rows;

    // Endpoint para enlace a informes de alumno
    for (let matricula of matriculas) {
      for (let prueba of pruebas) {
        const id_matricula_eval = `${matricula.id_matricula}.${cod_asig}-${anio_periodo}-${prueba.num_prueba}`;
        const calificacionesResult = await pool.query(
          `SELECT id_matricula_eval, logro_obtenido, informe_listo 
           FROM public.calificaciones_obtenidas 
           WHERE id_matricula_eval = $1`,
          [id_matricula_eval]
        );
        const calificaciones = calificacionesResult.rows[0];
        matricula[`logro_obtenido_${prueba.num_prueba}`] = calificaciones ? calificaciones.logro_obtenido : null;
        matricula[`informe_listo_${prueba.num_prueba}`] = calificaciones ? calificaciones.informe_listo : null;
        matricula[`id_matricula_eval_${prueba.num_prueba}`] = calificaciones ? calificaciones.id_matricula_eval : null;

        // Construir el enlace basado en id_matricula_eval
        if (calificaciones && calificaciones.id_matricula_eval) {
          matricula[`enlace_eval_${prueba.num_prueba}`] = `https://duoccl0-my.sharepoint.com/personal/lgutierrez_duoc_cl/Documents/SUDCRA/informes/2024002/alumnos/${calificaciones.id_matricula_eval}.html`;
        } else {
          matricula[`enlace_eval_${prueba.num_prueba}`] = null;
        }
      }
    }
    res.json(matriculas);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para enlace a informe de seccion
app.get('/informes-secciones/:asignatura/:num_evaluacion/:seccion', async (req, res) => {
  try {
    const { asignatura, num_evaluacion, seccion } = req.params;
    const id_eval = `${asignatura}-${anio_periodo}-${num_evaluacion}_${seccion}`;

    const result = await pool.query(
      'SELECT id_eval, informe_listo FROM public.informes_secciones WHERE id_eval = $1',
      [id_eval]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron informes para el id_eval proporcionado.' });
    }

    const informe = result.rows[0];

    // Construir el enlace basado en id_eval
    if (informe && informe.id_eval) {
      informe.enlace_informe = `https://duoccl0-my.sharepoint.com/personal/lgutierrez_duoc_cl/Documents/SUDCRA/informes/2024002/secciones/${informe.id_eval}.html`;
    } else {
      informe.enlace_informe = null;
    }

    res.json(informe);
  } catch (error) {
    console.error('Error ejecutando la consulta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ---- Fin ------

// Endpoint para obtener la información de un alumno por rut
app.get('/api/alumnos/:rut', async (req, res) => {
  const { rut } = req.params;
  try {
    const query = `
SELECT 
    al.rut, 
    al.apellidos,    
    al.nombres,
    al.sexo,
    mt.id_matricula, 
    sd.nombre_sede,
    al.user_alum, 
    i.id_seccion, 
    s.seccion,
    asig.asig, 
    d.rut_docente,
    d.nombre_doc,
    d.apellidos_doc,
    s.cod_asig
FROM 
    matricula mt 
JOIN 
    inscripcion i ON i.id_matricula = mt.id_matricula
JOIN 
    secciones s ON s.id_seccion = i.id_seccion
JOIN 
    docentes d ON d.rut_docente = s.rut_docente
JOIN 
    alumnos al ON al.rut = mt.rut
JOIN 
    sedes sd ON sd.id_sede = mt.id_sede
JOIN 
    asignaturas asig ON asig.cod_asig = s.cod_asig
WHERE 
    al.rut = $1
ORDER BY 
    asig.cod_asig;

    `;
    
    const result = await pool.query(query, [rut]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener el registro de la calificación por id_matricula_eval (dawner de busqueda por rut)
app.get('/api/calificaciones/:id_matricula_eval', async (req, res) => {
  const { id_matricula_eval } = req.params;
  try {
    const query = `
    SELECT
      co.id_matricula_eval,
      co.id_calificacion,
      co.lectura_fecha,
      co.num_prueba,
      co.logro_obtenido,
      co.puntaje_total_obtenido,
      c.nota,
      c.condicion
    FROM calificaciones_obtenidas as co
    JOIN calificaciones as c on co.id_calificacion = c.id_calificacion
    WHERE co.id_matricula_eval = $1
    `;
    
    const result = await pool.query(query, [id_matricula_eval]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener el detalle de respuesta por item de la calificación por id_matricula_eval (segundo dawner de busqueda por rut)
app.get('/api/calificacion_item/:id_matricula_eval', async (req, res) => {
  const { id_matricula_eval } = req.params;
  try {
    const query = `
      SELECT * FROM public.matricula_eval_itemresp
      where id_matricula_eval like $1 || '%'
      ORDER BY id_itemresp ASC 
    `;
    const result = await pool.query(query, [id_matricula_eval]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener la información de inscripciones por id_matricula
app.get('/api/inscripciones/:id_matricula', async (req, res) => {
  const { id_matricula } = req.params;
  try {
    const query = `
      SELECT 
        i.id_inscripcion,
        i.id_matricula,
        s.id_seccion,
        d.rut_docente,
        d.apellidos_doc || ' ' || d.nombre_doc as nombre_docente,
        sd.nombre_sede,
        s.cod_asig,
        s.seccion
      FROM inscripcion as i
      JOIN secciones as s ON i.id_seccion = s.id_seccion
      JOIN docentes as d on s.rut_docente = d.rut_docente
      JOIN sedes as sd ON s.id_sede = sd.id_sede
      WHERE i.id_matricula = $1
    `;
    const result = await pool.query(query, [id_matricula]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});


// Endpoint para obtener mails enviados a la seccion
app.get('/api/mails_seccion/:id_seccion', async (req, res) => {
  const { id_seccion } = req.params;
  try {
    const result = await pool.query('SELECT * FROM informes_secciones WHERE id_seccion = $1', [id_seccion]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener mails enviados al alumno
app.get('/api/mails_alumno/:rut', async (req, res) => {
  const { rut } = req.params;
  try {
    const query = `
      SELECT ia.id_informealum, ia.id_matricula_eval, ia.marca_temporal, ia.mail_enviado, ia.marca_temp_mail 
      FROM matricula as m
      JOIN informe_alumnos as ia ON ia.id_matricula_eval LIKE m.id_matricula || '%'
      WHERE m.rut = $1
    `;
    
    const result = await pool.query(query, [rut]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para buscar docentes por palabra clave
app.get('/api/buscar-alumno/:keyword', async (req, res) => {
  const { keyword } = req.params;
  try {
    const query = `
    SELECT DISTINCT 
      sd.nombre_sede,
      a.rut,
      a.nombres,
      a.apellidos,
      a.user_alum,
      a.sexo
    FROM alumnos as a
    JOIN matricula as m on m.rut=a.rut
    JOIN sedes as sd on sd.id_sede = m.id_sede
    WHERE a.rut ILIKE $1
        OR a.nombres ILIKE $1
        OR a.apellidos ILIKE $1
        OR a.user_alum ILIKE $1
        OR a.sexo ILIKE $1
    ORDER BY 
      sd.nombre_sede ASC, 
      a.apellidos ASC, 
      a.nombres ASC
    `;
    const result = await pool.query(query, [`%${keyword}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para buscar docentes por palabra clave
app.get('/api/buscar-docente/:keyword', async (req, res) => {
  const { keyword } = req.params;
  try {
    const query = `
      SELECT DISTINCT sd.nombre_sede, d.rut_docente, d.nombre_doc, d.apellidos_doc, d.username_doc, d.mail_doc
      FROM docentes as d
      JOIN secciones AS s ON s.rut_docente = d.rut_docente
      JOIN sedes AS sd ON sd.id_sede = s.id_sede
      WHERE d.rut_docente ILIKE $1
         OR d.nombre_doc ILIKE $1
         OR d.apellidos_doc ILIKE $1
         OR d.username_doc ILIKE $1
         OR d.mail_doc ILIKE $1
    `;
    const result = await pool.query(query, [`%${keyword}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener la información de secciones y asignaturas de un docente por rut_docente
app.get('/api/docente/:rut_docente', async (req, res) => {
  const { rut_docente } = req.params;
  try {
    const query = `
      SELECT * 
      FROM seccion_docente as sdoc
      JOIN secciones as s ON sdoc.id_seccion = s.id_seccion
      JOIN asignaturas as a ON a.cod_asig = s.cod_asig
      JOIN sedes as sd ON s.id_sede = sd.id_sede
      JOIN docentes as d ON sdoc.rut_docente = d.rut_docente
      WHERE sdoc.rut_docente = $1;
    `;
    
    const result = await pool.query(query, [rut_docente]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});



// Endpoint de listado de ultimo proceso, por programa, para Home
app.get('/api/ultimas-calificaciones', async (req, res) => {
  try {
    const query = `
      WITH ranked_calificaciones AS (
        SELECT 
            asig.programa, 
            asig.cod_asig, 
            asig.asig, 
            e.nombre_prueba, 
            e.num_prueba, 
            e.id_eval, 
            calo.lectura_fecha, 
            calo.logro_obtenido,
            ROW_NUMBER() OVER (PARTITION BY asig.programa ORDER BY calo.lectura_fecha DESC) AS rn
        FROM 
            calificaciones_obtenidas AS calo
        JOIN
            calificaciones AS cal
        ON
            calo.id_calificacion = cal.id_calificacion
        JOIN
            eval AS e
        ON
            cal.id_eval = e.id_eval
        JOIN
            asignaturas AS asig
        ON
            e.cod_asig = asig.cod_asig
        WHERE
            calo.lectura_fecha IS NOT NULL
      )

      SELECT 
          programa, 
          cod_asig, 
          asig, 
          nombre_prueba, 
          num_prueba, 
          id_eval, 
          lectura_fecha, 
          logro_obtenido
      FROM 
          ranked_calificaciones
      WHERE 
          rn = 1
      ORDER BY
          programa;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// End point para contar evaluaciones por programa y asignatura
app.get('/api/recuento-emitidos', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.programa,
        a.cod_asig,
        DATE(co.lectura_fecha) AS fecha,
        COUNT(co.id_matricula_eval) AS total_evaluaciones
      FROM 
        calificaciones_obtenidas AS co
      JOIN 
        asignaturas AS a ON co.id_matricula_eval LIKE '%' || a.cod_asig || '%'
      GROUP BY 
        a.programa,
        a.cod_asig,
        DATE(co.lectura_fecha)
      ORDER BY 
        DATE(co.lectura_fecha) ASC,
        a.cod_asig ASC,
        fecha ASC;
    `;

    const result = await pool.query(query);
    
    if (result.rows.length > 0) {
      res.json(result.rows);  // Enviar datos como JSON si hay resultados
    } else {
      res.status(404).json({ error: 'No se encontraron datos.' });  // Manejo cuando no hay resultados
    }
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener archivos leídos basado en coincidencia parcial o total con nombre de archivo
app.get('/api/archivos-leidos/:keyword', async (req, res) => {
  const { keyword } = req.params;
  const archivoPatron = `%${keyword}%`;
  try {
    const result = await pool.query(
      'SELECT * FROM archivosleidos WHERE archivoleido LIKE $1',
      [archivoPatron]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener archivos leídos y sus lecturas temporales basados en coincidencia parcial o total con nombre de archivo
app.get('/api/archivos-leidos-temp/:keyword', async (req, res) => {
  const { keyword } = req.params;
  const archivoPatron = `%${keyword}%`;
  try {
    const result = await pool.query(
      `SELECT * 
       FROM archivosleidos AS al
       JOIN lectura_temp AS lt ON al.id_archivoleido = lt.id_archivoleido 
       WHERE al.archivoleido LIKE $1`,
      [archivoPatron]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener archivos leídos y sus lecturas basados en coincidencia parcial o total con nombre de archivo
app.get('/api/archivos-leidos-lectura/:keyword', async (req, res) => {
  const { keyword } = req.params;
  const archivoPatron = `%${keyword}%`;
  try {
    const result = await pool.query(
      `
      SELECT DISTINCT ON (al.id_archivoleido) 
          al.id_archivoleido,
          al.archivoleido,
          l.id_lectura,
          al.marcatemporal
      FROM 
          archivosleidos al
      JOIN 
          lectura l 
          ON al.id_archivoleido = l.id_archivoleido
      WHERE 
          al.archivoleido LIKE $1
      ORDER BY 
          al.id_archivoleido, al.marcatemporal ASC;
      `,
      [archivoPatron]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

app.get('/api/archivoleido/:id', async (req, res) => {
  const { id } = req.params; // Obtenemos el parámetro "id" desde la URL
  try {
    const result = await pool.query(
      `
      SELECT 
          MAX(l.id_lectura) AS id_lectura,            -- Obtener el valor máximo de id_lectura
          MAX(l.id_archivoleido) AS id_archivoleido,    -- Obtener el valor máximo de id_archivoleido
          l.rut,                                       -- Agrupar solo por rut
          MAX(me.id_matricula_eval) AS id_matricula_eval,
          BOOL_OR(l.reproceso) AS reproceso,            -- Agregación de valores booleanos
          MAX(l.imagen) AS imagen,
          MAX(l.instante_forms) AS instante_forms,
          MAX(co.logro_obtenido) AS logro_obtenido
      FROM lectura AS l
      JOIN matricula AS m ON m.rut = l.rut
      JOIN asignaturas AS a ON l.cod_interno = a.cod_interno
      LEFT JOIN matricula_eval AS me ON me.id_matricula_eval = m.id_matricula || '.' || a.cod_asig || '-2024002-2'
      LEFT JOIN calificaciones_obtenidas AS co ON co.id_matricula_eval = m.id_matricula || '.' || a.cod_asig || '-2024002-2'
      WHERE l.id_archivoleido = $1
      GROUP BY l.rut                                    -- Agrupar solo por rut
      ORDER BY id_lectura ASC;
      `,
      [id] // Pasamos el id_archivoleido como parámetro
    );
    res.json(result.rows); // Enviamos los resultados como respuesta JSON
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});


// Endpoint para obtener información de una sección por id_seccion
app.get('/api/seccion/:id_seccion', async (req, res) => {
  const { id_seccion } = req.params;
  try {
    const query = `
      SELECT * 
      FROM secciones AS s
      JOIN docentes AS doc
      ON s.rut_docente = doc.rut_docente
      WHERE s.id_seccion = $1
    `;
    
    const result = await pool.query(query, [id_seccion]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// End point para traer listado de asignaturas al ingresar cualquier programa
app.get('/api/monitor/:programa', async (req, res) => {
  const { programa } = req.params;
  try {
    const query = `
      SELECT 
        cod_asig, 
        asig
      FROM
        asignaturas
      WHERE
        cod_programa = $1
      ORDER BY
        cod_asig;
    `;

    const result = await pool.query(query, [programa]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener información de secciones por asignatura
app.get('/api/monitor/:programa/:asignatura', async (req, res) => {
  const { asignatura } = req.params;
  try {
    const query = `
SELECT 
    (si.id_seccion || '_' || si.id_eval::text) AS id_seccion_eval,
    si.id_seccion,
    si.id_eval,
    asig.cod_asig,
    asig.asig,
    asig.programa,
    asig.cod_programa,
    e.num_prueba,
    s.seccion,
    sd.nombre_sede,
    MAX(si.marca_temp_mail) AS enviado
FROM 
    informes_secciones si
JOIN 
    secciones s ON s.id_seccion = si.id_seccion
JOIN 
    eval e ON si.id_eval = e.id_eval
JOIN 
    asignaturas asig ON asig.cod_asig = s.cod_asig
JOIN 
    sedes sd ON s.id_sede = sd.id_sede
WHERE
    asig.cod_asig = $1
GROUP BY 
    sd.nombre_sede,
    asig.cod_asig,
    s.seccion,
    e.num_prueba,
    (si.id_seccion || '_' || si.id_eval::text), 
    si.id_seccion, 
    si.id_eval, 
    asig.asig, 
    asig.programa, 
    asig.cod_programa
ORDER BY 
    sd.nombre_sede ASC,
    asig.cod_asig ASC,
    s.seccion ASC;
    `;

    const result = await pool.query(query, [asignatura]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Extraer notas //

// Endpoint para obtener calificaciones por sede y asignatura (FALTA, USAR EL DE ABAJO PARA ESPECIFICAR)

// Endpoint para obtener calificaciones por asignatura
app.get('/api/notas/:cod_asig/', async (req, res) => {
  const { cod_asig } = req.params; // Obtener parámetros de la ruta

  // Validar que los parámetros existen
  if (!cod_asig) {
    return res.status(400).json({ error: 'Faltan parámetros: cod_asig' });
  }

  // Generar dinámicamente los valores para mte.id_eval basados en cod_asig
  const idEvals = [
    `${cod_asig}-${anio_periodo}-0`,
    `${cod_asig}-${anio_periodo}-1`,
    `${cod_asig}-${anio_periodo}-2`,
    `${cod_asig}-${anio_periodo}-3`,
    `${cod_asig}-${anio_periodo}-4`,
    `${cod_asig}-${anio_periodo}-5`,
    `${cod_asig}-${anio_periodo}-6`,
    `${cod_asig}-${anio_periodo}-7`,
    `${cod_asig}-${anio_periodo}-8`,
    `${cod_asig}-${anio_periodo}-9`,
    `${cod_asig}-${anio_periodo}-10`
  ];

  // Crear una cadena con los valores para la cláusula IN
  const idEvalPlaceholders = idEvals.map((_, index) => `$${index + 2}`).join(', ');

  // Definir la consulta SQL
  const query = `
  SELECT
      sd.nombre_sede,
      s.cod_asig,
      s.seccion,
      s.rut_docente,
      doc.nombre_doc,
      doc.apellidos_doc,
      s.jornada,
      a.rut,
      a.nombres,
      a.apellidos,
      a.sexo,
    MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '0' THEN c.nota END) AS nota_0,
    MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '1' THEN c.nota END) AS nota_1,
    MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '2' THEN c.nota END) AS nota_2,
    MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '3' THEN c.nota END) AS nota_3,
    MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '4' THEN c.nota END) AS nota_4,
    MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '5' THEN c.nota END) AS nota_5,
    MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '6' THEN c.nota END) AS nota_6,
    MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '7' THEN c.nota END) AS nota_7,
    MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '8' THEN c.nota END) AS nota_8,
    MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '9' THEN c.nota END) AS nota_9,
    MAX(CASE WHEN RIGHT(mte.id_eval, 1) = '10' THEN c.nota END) AS nota_10
  FROM calificaciones_obtenidas as co
  JOIN calificaciones as c ON co.id_calificacion = c.id_calificacion
  JOIN matricula_eval as mte ON co.id_matricula_eval = mte.id_matricula_eval
  JOIN matricula as mt ON mte.id_matricula = mt.id_matricula
  JOIN inscripcion as i ON mt.id_matricula = i.id_matricula
  JOIN secciones as s ON i.id_seccion = s.id_seccion
  JOIN docentes as doc ON s.rut_docente = doc.rut_docente
  JOIN alumnos as a ON mt.rut = a.rut
  JOIN sedes as sd ON s.id_sede = sd.id_sede
  WHERE s.id_sede IN (4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 16, 18, 19, 29, 74, 75, 76, 77, 79)
  AND mte.id_eval IN (${idEvalPlaceholders})
  AND s.cod_asig = $1
  GROUP BY sd.nombre_sede, s.cod_asig, s.seccion, s.rut_docente, doc.nombre_doc, doc.apellidos_doc, s.jornada, a.rut, a.nombres, a.apellidos, a.sexo
  ORDER BY sd.nombre_sede ASC, s.seccion ASC, a.apellidos ASC;
  `;

  try {
    // Ejecutar la consulta SQL con los parámetros proporcionados
    const result = await pool.query(query, [cod_asig, ...idEvals]);
    res.json(result.rows); // Devolver los resultados en formato JSON
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});


// Endpoint para capturar errores usando parámetros en la ruta
app.get('/imagenes-errores/:id_sede/:cod_asig/:num_seccion/:jornada', async (req, res) => {
  const { id_sede, cod_asig, num_seccion, jornada } = req.params;

  if (!cod_asig || !num_seccion || !jornada || !id_sede) {
    return res.status(400).json({ error: 'Todos los parámetros son necesarios' });
  }

  try {
    const query = `
      SELECT DISTINCT *
      FROM imagenes AS i
      JOIN errores AS e ON i.id_imagen = e.imagen
      WHERE i.cod_asig = $1 AND i.num_seccion = $2 AND i.jornada = $3 AND i.id_sede = $4
    `;
    const values = [cod_asig, num_seccion, jornada, id_sede];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error ejecutando la consulta', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// End point para contar evaluaciones por programa y asignatura
app.get('/api/monitor/evaluaciones', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.programa, 
        a.cod_asig, 
        COUNT(co.id_matricula_eval) AS total_evaluaciones
      FROM 
        calificaciones_obtenidas AS co
      JOIN 
        asignaturas AS a ON co.id_matricula_eval LIKE '%' || a.cod_asig || '%'
      GROUP BY 
        a.programa, a.cod_asig
      ORDER BY 
        a.programa ASC, a.cod_asig ASC;
    `;

    const result = await pool.query(query);
    
    if (result.rows.length > 0) {
      res.json(result.rows);  // Enviar datos como JSON si hay resultados
    } else {
      res.status(404).json({ error: 'No se encontraron datos.' });  // Manejo cuando no hay resultados
    }
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener informes de secciones pendientes de envío por correo
app.get('/api/informes/pendientes', async (req, res) => {
  try {
    const query = `
    SELECT 
      eval.id_eval,
      informes_secciones.id_informeseccion,
      CONCAT(docentes.nombre_doc, ' ', docentes.apellidos_doc) AS docente,
      docentes.mail_doc,
      docentes.rut_docente,
      eval.nombre_prueba,
      CONCAT(informes_secciones.id_eval, '_', informes_secciones.id_seccion, '.html') AS informe,
      secciones.seccion,
      secciones.id_seccion,
      asignaturas.programa,
      sd.nombre_sede,
      informes_secciones.marca_temporal
    FROM 
      informes_secciones
    JOIN 
      eval ON informes_secciones.id_eval = eval.id_eval
    JOIN 
      secciones ON secciones.id_seccion = informes_secciones.id_seccion
    JOIN 
      docentes ON secciones.rut_docente = docentes.rut_docente
    JOIN 
      asignaturas ON asignaturas.cod_asig = secciones.cod_asig
    JOIN
      sedes as sd ON sd.id_sede = secciones.id_sede
    WHERE 
      informes_secciones.mail_enviado = false 
      AND docentes.mail_doc <> 'no_mail' 
      AND eval.maildisponible = false
    ORDER BY 
      asignaturas.programa ASC, 
      secciones.seccion ASC;
  `;
  

    const result = await pool.query(query);

    // Asegúrate de que la respuesta sea JSON
    res.setHeader('Content-Type', 'application/json');
    
    if (result.rows.length > 0) {
      return res.status(200).json(result.rows);  // Devolver los datos como JSON
    } else {
      return res.status(404).json({ error: 'No se encontraron informes pendientes.' });  // En caso de no encontrar datos
    }
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    return res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});


// Endpoint para obtener las secciones con mail_enviado = false
app.get('/api/informes/pendientes-mail', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        a.programa,
        sd.nombre_sede,
        s.cod_asig,
        s.seccion,
        iss.id_informeseccion,
        iss.id_eval,
        iss.marca_temporal,
        iss.mail_enviado,
        iss.marca_temp_mail
      FROM informes_secciones as iss
      JOIN secciones as s ON iss.id_seccion = s.id_seccion
      JOIN sedes as sd ON sd.id_sede = s.id_sede
      JOIN asignaturas as a ON a.cod_asig = s.cod_asig
      WHERE iss.mail_enviado = false
      ORDER BY a.programa, s.cod_asig, s.seccion, sd.nombre_sede`
    );

    // Enviamos los resultados como un JSON
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener los informes de alumnos pendientes con mail_enviado = false
app.get('/api/informes/pendientes-mail-alumnos', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        e.cod_asig,
        e.nombre_prueba,
        a.rut,
        a.user_alum,
        m.id_matricula,
        ia.id_matricula_eval,
        ia.id_informealum,
        ia.marca_temporal,
        ia.mail_enviado,
        ia.marca_temp_mail
      FROM informe_alumnos as ia
      JOIN matricula_eval as me ON ia.id_matricula_eval = me.id_matricula_eval
      JOIN eval as e ON me.id_eval = e.id_eval
      JOIN matricula as m ON m.id_matricula = me.id_matricula
      JOIN alumnos as a ON a.rut = m.rut
      WHERE ia.marca_temporal IS NOT NULL
        AND ia.mail_enviado = FALSE
      ORDER BY ia.marca_temp_mail ASC`
    );

    // Enviamos los resultados como un JSON
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// SEGUIMIENTO DE IMAGENES
// Endpoint para obtener el id_eval de matricula_eval
app.get('/api/seguimientoimageneval/:num_imagen', async (req, res) => {
  const { num_imagen } = req.params; // Obtener el parámetro de la URL
  try {
    const result = await pool.query(
      `
      SELECT
        id_eval
      FROM matricula_eval
      WHERE imagen LIKE $1 ESCAPE '\\'
      LIMIT 1;
      `,
      [`${num_imagen}\\_%`] // Patrón con escape del guion bajo
    );

    // Si no se encuentra un resultado, devolver un mensaje adecuado
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró la evaluación para la imagen dada' });
    }

    // Responder con el resultado
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener errores con los campos específicos
app.get('/api/errores/:num_imagen', async (req, res) => {
  const { num_imagen } = req.params; // Obtener el parámetro de la URL
  try {
    const result = await pool.query(
      `
      SELECT 
        id_error, 
        rut, 
        num_prueba, 
        cod_interno, 
        forma, 
        grupo, 
        id_archivoleido, 
        imagen,
        instante_forms,
        valida_rut,
        valida_matricula,
        valida_inscripcion,
        valida_eval,
        valida_forma,
        mail_enviado,
        marca_temp_mail 
      FROM public.errores 
      WHERE imagen LIKE $1 ESCAPE '\\'
      ORDER BY imagen ASC
      `,
      [`${num_imagen}\\_%`] // Patrón con escape del guion bajo
    );

    // Responder con los resultados
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});


// Endpoint para obtener las imágenes de una sección específica
app.get('/subidasporidseccion/:id_seccion', async (req, res) => {
  const { id_seccion } = req.params;

  const query = `
    SELECT DISTINCT ON (i.id_lista)
      i.id_imagen,
      i.subidapor, 
      i.id_lista, 
      i.id_sede, 
      i.evaluacion, 
      i.cod_asig, 
      i.num_seccion, 
      i.imagen, 
      i.url_imagen 
    FROM imagenes AS i
    JOIN secciones AS s 
      ON s.id_sede = i.id_sede 
      AND s.cod_asig = i.cod_asig 
      AND s.num_seccion = i.num_seccion
    WHERE s.id_seccion = $1
    ORDER BY i.id_lista, i.id_imagen ASC;
  `;

  try {
    // Ejecutar la consulta con el parámetro id_seccion
    const result = await pool.query(query, [id_seccion]);
    
    // Devolver los resultados como respuesta JSON
    res.json(result.rows);
  } catch (error) {
    console.error('Error ejecutando la consulta:', error);
    res.status(500).json({ error: 'Error en la consulta de la base de datos' });
  }
});

// nombre archivo con registro en matricula_eval es decir con calificacion
app.get('/api/archivosleidosconcalificacion', async (req, res) => {
  const { string1 = '', string2 = '', string3 = '', string4 = '' } = req.query;

  // Construcción dinámica del patrón de búsqueda
  const searchPattern = `%${string1}%${string2}%${string3}%${string4}%`;

  const query = `
    SELECT DISTINCT ON (al.id_archivoleido)
        al.id_archivoleido,
        al.marcatemporal,
      EXTRACT(YEAR FROM al.marcatemporal) AS anio,
      EXTRACT(MONTH FROM al.marcatemporal) AS mes,
      EXTRACT(DAY FROM al.marcatemporal) AS dia,
        me.id_matricula,
        me.id_eval,
        me.id_seccion,
        al.archivoleido,
        CASE 
            WHEN me.id_archivoleido IS NOT NULL THEN 'Sí'
            ELSE 'No'
        END AS tiene_coincidencia
    FROM 
        public.archivosleidos al
    LEFT JOIN 
        (
            SELECT 
                me.id_archivoleido,
                me.id_matricula,
                me.id_eval,
                ins.id_seccion,
                s.id_seccion AS id_seccion_s,
                s.cod_asig
            FROM 
                matricula_eval me
            LEFT JOIN 
                inscripcion ins ON ins.id_matricula = me.id_matricula
            LEFT JOIN 
                secciones s ON s.id_seccion = ins.id_seccion
                AND s.cod_asig = split_part(me.id_eval, '-', 1)
        ) AS me ON al.id_archivoleido = me.id_archivoleido
    WHERE 
        al.archivoleido LIKE $1
    ORDER BY 
        al.id_archivoleido, me.id_matricula;
  `;
  const values = [searchPattern];

  try {
      const result = await pool.query(query, values);
      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});


// Endpoint para obtener imágenes con campos específicos
app.get('/api/imagenes/:num_imagen', async (req, res) => {
  const { num_imagen } = req.params; // Obtener el parámetro de la URL

  try {
    // Consulta SQL con escape para el guion bajo
    const query = `
      SELECT
          s.id_seccion,
          i.id_imagen, 
          i.id_lista, 
          i.id_sede, 
          i.evaluacion, 
          i.cod_asig, 
          i.num_seccion, 
          i.imagen, 
          i.url_imagen 
      FROM imagenes AS i
      JOIN secciones AS s 
      ON s.id_sede = i.id_sede 
        AND s.cod_asig = i.cod_asig 
        AND s.num_seccion = i.num_seccion
      WHERE i.id_imagen LIKE $1 ESCAPE '\\'
      ORDER BY i.id_imagen ASC;
    `;

    // Escapar el patrón para LIKE
    const values = [`${num_imagen}\\_%`]; // Escape del guion bajo

    // Ejecutar la consulta con valores parametrizados
    const result = await pool.query(query, values);

    // Manejo de resultados vacíos
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron imágenes.' });
    }

    // Respuesta con los datos obtenidos
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: 'Error al obtener las imágenes.' });
  }
});

// Endpoint para obtener lecturas con los campos específicos
app.get('/api/lectura/:num_imagen', async (req, res) => {
  const { num_imagen } = req.params; // Obtener parámetro de la URL
  try {
    const result = await pool.query(
      `
      SELECT *
        FROM (
            SELECT DISTINCT ON (l.rut)
                l.id_lectura,
                m.id_matricula || '.' || i.id_eval AS id_matricula_eval,
                l.rut, 
                l.id_archivoleido, 
                c.logro_obtenido,
                l.reproceso, 
                l.imagen, 
                l.instante_forms, 
                l.num_prueba, 
                l.forma, 
                l.grupo
            FROM lectura AS l
            LEFT JOIN matricula AS m ON l.rut = m.rut
            LEFT JOIN item_respuesta AS ir ON ir.id_itemresp = l.id_itemresp
            LEFT JOIN item AS i ON i.id_item = ir.id_item
            LEFT JOIN calificaciones_obtenidas AS c 
                ON c.id_matricula_eval = (m.id_matricula || '.' || i.id_eval)
            WHERE l.imagen LIKE $1 ESCAPE '\\'
            ORDER BY l.rut, l.imagen ASC
        ) AS subquery
        ORDER BY subquery.imagen ASC;
      `,
      [`${num_imagen}\\_%`] // Patrón con escape del guion bajo
    );

    // Responder con los resultados
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});


// Endpoint para obtener lectura_temp
app.get('/api/lectura_temp/:searchTerm', async (req, res) => {
  const { searchTerm } = req.params; // Obtener parámetro de la URL
  try {
    const result = await pool.query(
      `
      SELECT DISTINCT ON (rut) 
        id_lectura, 
        rut, 
        id_archivoleido, 
        imagen, 
        instante_forms 
      FROM lectura_temp 
      WHERE imagen LIKE $1 ESCAPE '\\'
      `,
      [`${searchTerm}\\_%`] // Patrón con escape del guion bajo
    );

    // Responder con los resultados
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err.message);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});


// Endpoint para obtener la información de las secciones por id_seccion
app.get('/api/secciones', async (req, res) => {
  const { id_seccion } = req.query; // Obtener el id_seccion del query string
  try {
    // Utilizar un parámetro para prevenir inyecciones SQL
    const result = await pool.query(`
      SELECT 
        s.id_seccion,
        sd.nombre_sede,
        s.cod_asig,
        s.seccion,
        d.rut_docente,
        d.nombre_doc,
        d.apellidos_doc,
        d.mail_doc
      FROM 
        secciones as s
      JOIN
        docentes as d ON d.rut_docente = s.rut_docente
      JOIN
        sedes as sd ON sd.id_sede = s.id_sede
      WHERE s.id_seccion = $1
    `, [id_seccion]); // Usar $1 para el parámetro
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener los informes de una sección específica
app.get('/api/seccion_informes', async (req, res) => {
  try {
    // Definir la consulta
    const query = `
      SELECT
          ise.id_informeseccion,
          ise.id_eval,
          e.nombre_prueba,
          ise.mail_enviado,
          ise.marca_temp_mail,
          'https://duoccl0-my.sharepoint.com/personal/lgutierrez_duoc_cl/Documents/SUDCRA/informes/2024002/secciones/' || ise.id_eval || '_' || ise.id_seccion || '.html' AS link_informe
      FROM informes_secciones as ise
      JOIN eval as e on e.id_eval = ise.id_eval
      WHERE ise.id_seccion = $1
      ORDER BY ise.id_eval ASC;
    `;

    // Capturar el parámetro id_seccion desde la query string
    const { id_seccion } = req.query;

    if (!id_seccion) {
      return res.status(400).json({ error: 'El parámetro id_seccion es requerido' });
    }

    // Ejecutar la consulta con el parámetro
    const result = await pool.query(query, [id_seccion]);

    // Enviar los resultados como respuesta JSON
    res.json(result.rows);
  } catch (err) {
    console.error('Error ejecutando la consulta', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para obtener las estadísticas sin parámetros en la URL
app.get('/api/estadisticas', async (req, res) => {
  try {
    const query = `
      SELECT 
        co.lectura_fecha,
        c.nota,
        e.cod_asig,
        e.num_prueba,
        a.programa
      FROM 
        calificaciones_obtenidas as co
      JOIN 
        calificaciones as c ON c.id_calificacion = co.id_calificacion
      JOIN
        matricula_eval as me ON me.id_matricula_eval = co.id_matricula_eval
      JOIN
        eval as e ON e.id_eval = me.id_eval
      JOIN
        asignaturas as a ON a.cod_asig = e.cod_asig
      ORDER BY e.cod_asig;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error ejecutando la consulta', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para obtener información de lectura por RUT
app.get('/api/lectura/:rut', async (req, res) => {
  const { rut } = req.params; // Obtener el rut desde los parámetros de la ruta
  try {
    // Consulta SQL utilizando un parámetro para evitar inyección SQL
    const result = await pool.query(`
      SELECT
        a.programa,
        a.cod_programa,
        sd.nombre_sede,
        m.id_sede,
        a.cod_asig,
        i.id_seccion,
        m.rut,
        m.id_matricula || '.' || a.cod_asig || '-2024002-' || l.num_prueba as id_matricula_eval,
        arl.marcatemporal,
        l.id_archivoleido,
        arl.archivoleido
      FROM lectura as l
      JOIN asignaturas as a ON l.cod_interno = a.cod_interno
      JOIN matricula AS m ON l.rut = m.rut
      JOIN inscripcion AS i ON m.id_matricula = i.id_matricula
      JOIN sedes as sd ON m.id_sede = sd.id_sede
      JOIN archivosleidos as arl ON l.id_archivoleido = arl.id_archivoleido
      JOIN secciones AS s ON s.id_seccion = i.id_seccion AND s.cod_asig = a.cod_asig
      WHERE m.rut LIKE $1
      GROUP BY 
        a.programa,
        a.cod_programa,
        sd.nombre_sede,
        m.id_sede,
        a.cod_asig,
        i.id_seccion,
        m.rut,
        m.id_matricula || '.' || a.cod_asig || '-2024002-' || l.num_prueba,
        arl.marcatemporal,
        l.id_archivoleido,
        arl.archivoleido
    `, [`%${rut}%`]); // Usar LIKE con el parámetro RUT

    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener la información de los informes de alumnos por id_matricula
app.get('/api/informes-enviados-alumno/:id_matricula', async (req, res) => {
  const { id_matricula } = req.params; // Obtener el id_matricula desde los parámetros de ruta
  try {
    const result = await pool.query(`
      SELECT
        e.cod_asig,
        e.nombre_prueba,
        ia.id_informealum,
        ia.id_matricula_eval,
        ia.marca_temporal,
        ia.mail_enviado,
        ia.marca_temp_mail
      FROM informe_alumnos as ia
      JOIN matricula_eval as me ON ia.id_matricula_eval = me.id_matricula_eval
      JOIN eval as e ON me.id_eval = e.id_eval
      WHERE ia.id_matricula_eval LIKE $1
      ORDER BY e.cod_asig, e.nombre_prueba, ia.id_informealum, ia.marca_temp_mail ASC
    `, [`${id_matricula}%`]); // Usar LIKE con el patrón dado
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// API PARA ESCRIBIR
app.put('/api/rehacerinformealumno', async (req, res) => {
  const { idMatriculaEval } = req.body; // Recibimos el id_matricula_eval
  console.log("idMatriculaEval recibido:", idMatriculaEval);

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Iniciamos la transacción

    const query = `
      UPDATE calificaciones_obtenidas
      SET informe_listo = False
      WHERE id_matricula_eval = $1
      RETURNING *;
    `;

    const result = await client.query(query, [idMatriculaEval]);

    console.log("Resultado de la consulta:", result.rows);

    if (result.rowCount === 0) {
      console.log("No se encontró ningún registro para actualizar.");
      throw new Error('No se encontró ninguna matrícula para actualizar.');
    }

    await client.query('COMMIT'); // Confirmamos la transacción

    res.status(200).json({
      message: 'Campo informe_listo actualizado correctamente a false.',
      updatedRows: result.rows, // Retorna el registro actualizado
    });
  } catch (err) {
    await client.query('ROLLBACK'); // Deshacemos cambios si ocurre un error
    console.error('Error en el servidor:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    client.release(); // Liberamos la conexión
  }
});

app.put('/api/reenviarinformealumno', async (req, res) => {
  const { idMatriculaEval } = req.body; // Recibimos el id_matricula_eval
  console.log("idMatriculaEval recibido:", idMatriculaEval);

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Iniciamos la transacción

    const query = `
      UPDATE informe_alumnos
      SET mail_enviado = true
      WHERE id_matricula_eval = $1
      RETURNING *;
    `;

    const result = await client.query(query, [idMatriculaEval]);

    console.log("Resultado de la consulta:", result.rows);

    if (result.rowCount === 0) {
      console.log("No se encontró ningún registro para actualizar.");
      throw new Error('No se encontró ninguna matrícula para actualizar.');
    }

    await client.query('COMMIT'); // Confirmamos la transacción

    res.status(200).json({
      message: 'Campo mail_enviado actualizado correctamente a false.',
      updatedRows: result.rows, // Retorna el registro actualizado
    });
  } catch (err) {
    await client.query('ROLLBACK'); // Deshacemos cambios si ocurre un error
    console.error('Error en el servidor:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    client.release(); // Liberamos la conexión
  }
});



app.get('/api/listado_calificaciones_obtenidas', async (req, res) => { 
  try {
    const result = await pool.query(`
      SELECT
        co.logro_obtenido,
        co.lectura_fecha,
        co.id_matricula_eval,
        co.num_prueba AS co_num_prueba,
        sd.nombre_sede,
        e.cod_asig,
        e.num_prueba,
        e.nombre_prueba,
        a.asig,
        a.programa,
        me.imagen,
        me.id_archivoleido
      FROM calificaciones_obtenidas AS co
      JOIN matricula_eval AS me ON co.id_matricula_eval = me.id_matricula_eval
      JOIN matricula AS m ON me.id_matricula = m.id_matricula
      JOIN sedes AS sd ON sd.id_sede = m.id_sede
      JOIN eval AS e ON me.id_eval = e.id_eval
      JOIN asignaturas AS a ON a.cod_asig = e.cod_asig
      ORDER BY co.lectura_fecha;
    `);

    res.json(result.rows); // Enviar los resultados como respuesta
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener las calificaciones obtenidas con imagen
app.get('/api/listado_calificaciones_obtenidas_imagen', async (req, res) => {
  try {
    // Consulta SQL
    const result = await pool.query(`
    SELECT
        ROW_NUMBER() OVER (ORDER BY EXTRACT(MONTH FROM co.lectura_fecha), EXTRACT(DAY FROM co.lectura_fecha)) AS numeracion,  -- Campo de numeración
        MAX(co.lectura_fecha) AS ultima_lectura_fecha, -- Última fecha de lectura
        EXTRACT(DAY FROM co.lectura_fecha) || '-' || EXTRACT(MONTH FROM co.lectura_fecha) AS fecha, -- Fecha en formato mes-día
        a.programa,
        COUNT(*) AS frecuencia
    FROM calificaciones_obtenidas AS co
    JOIN matricula_eval AS me ON co.id_matricula_eval = me.id_matricula_eval
    JOIN matricula AS m ON me.id_matricula = m.id_matricula
    JOIN sedes AS sd ON sd.id_sede = m.id_sede
    JOIN eval AS e ON me.id_eval = e.id_eval
    JOIN asignaturas AS a ON a.cod_asig = e.cod_asig
    WHERE me.imagen IS NOT NULL AND me.imagen <> ''
    GROUP BY
        EXTRACT(MONTH FROM co.lectura_fecha),
        EXTRACT(DAY FROM co.lectura_fecha),
        a.programa
    ORDER BY numeracion DESC, fecha, a.programa;
    `);

    // Enviar los resultados como respuesta
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para obtener las calificaciones obtenidas con planilla
app.get('/api/listado_calificaciones_obtenidas_planilla', async (req, res) => {
  try {
    // Consulta SQL
    const result = await pool.query(`
    SELECT
        ROW_NUMBER() OVER (ORDER BY EXTRACT(MONTH FROM co.lectura_fecha), EXTRACT(DAY FROM co.lectura_fecha)) AS numeracion,  -- Campo de numeración
        MAX(co.lectura_fecha) AS ultima_lectura_fecha, -- Última fecha de lectura
        EXTRACT(DAY FROM co.lectura_fecha) || '-' || EXTRACT(MONTH FROM co.lectura_fecha) AS fecha, -- Fecha en formato mes-día
        a.programa,
        COUNT(*) AS frecuencia
    FROM calificaciones_obtenidas AS co
    JOIN matricula_eval AS me ON co.id_matricula_eval = me.id_matricula_eval
    JOIN matricula AS m ON me.id_matricula = m.id_matricula
    JOIN sedes AS sd ON sd.id_sede = m.id_sede
    JOIN eval AS e ON me.id_eval = e.id_eval
    JOIN asignaturas AS a ON a.cod_asig = e.cod_asig
    WHERE me.id_archivoleido IS NOT NULL
    GROUP BY
        EXTRACT(MONTH FROM co.lectura_fecha),
        EXTRACT(DAY FROM co.lectura_fecha),
        a.programa
    ORDER BY numeracion DESC, fecha, a.programa;
    `);

    // Enviar los resultados como respuesta
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});
// ---------------------------------
//      API PARA ESCRIBIR !!!
// ---------------------------------
// Endpoint para reemplazar el docente en la tabla de secciones
app.put('/api/reemplazar-docente', async (req, res) => {
  const { rutNuevoDocente, seccion } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const query1 = `
      UPDATE public.secciones
      SET rut_docente = $1
      WHERE id_seccion = $2
      RETURNING *;`;

    const result1 = await client.query(query1, [rutNuevoDocente, seccion]);

    if (result1.rowCount === 0) {
      throw new Error('No se encontró ninguna sección para actualizar en "secciones".');
    }

    const query2 = `
      UPDATE public.seccion_docente
      SET rut_docente = $1
      WHERE id_seccion = $2
      RETURNING *;`;

    const result2 = await client.query(query2, [rutNuevoDocente, seccion]);

    if (result2.rowCount === 0) {
      throw new Error('No se encontró ninguna sección para actualizar en "seccion_docente".');
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Docente reemplazado exitosamente en ambas tablas.'
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Error en la consulta SQL' });
  } finally {
    client.release();
  }
});


// Endpoint para obtener las evaluaciones ordenadas
app.get('/api/evaluaciones', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.programa,
        e.id_eval,
        e.cod_asig,
        e.num_prueba,
        e.nombre_prueba,
        e.tiene_formas,
        e.tiene_grupo,
        e.cargado_fecha,
        e.archivo_tabla
      FROM eval as e
      JOIN asignaturas as a ON a.cod_asig = e.cod_asig
      ORDER BY a.programa ASC, e.cod_asig ASC, e.num_prueba ASC
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error ejecutando la consulta', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Endpoint para agregar un docente a la sección
app.post('/api/agregar-docente-seccion', async (req, res) => {
  const { idSeccion, rutDocente } = req.body;

  try {
    const query = `
      INSERT INTO public.seccion_docente (id_seccion, rut_docente)
      VALUES ($1, $2)
      RETURNING *;`;

    const result = await pool.query(query, [idSeccion, rutDocente]);

    if (result.rowCount > 0) {
      res.status(201).json({ message: 'Docente agregado a la sección exitosamente.', data: result.rows[0] });
    } else {
      res.status(404).json({ error: 'No se pudo agregar el docente a la sección.' });
    }
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Borrar un id_matricula_eval (sirve para eliminar el registro de resultado de una evaluacion)
app.delete('/api/matricula/:id', async (req, res) => {
  const idMatriculaEval = req.params.id;

  try {
    const result = await pool.query(
      'DELETE FROM public.matricula_eval WHERE id_matricula_eval = $1',
      [idMatriculaEval]
    );

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Registro eliminado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Registro no encontrado.' });
    }
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
    res.status(500).json({ message: 'Error al eliminar el registro.' });
  }
});

// Borrar un id_informeseccion
app.delete('/api/informes_secciones/:id', async (req, res) => {
  const idInformeSeccion = req.params.id; // Captura el parámetro de la URL

  try {
    const result = await pool.query(
      'DELETE FROM public.informes_secciones WHERE id_informeseccion = $1',
      [idInformeSeccion]
    );

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Registro eliminado exitosamente.' });
    } else {
      res.status(404).json({ message: 'Registro no encontrado.' });
    }
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
    res.status(500).json({ message: 'Error al eliminar el registro.' });
  }
});


//-------------------------------------------
// Endpoint para actualizar el campo maildisponible en eval
app.put('/api/eval/update-maildisponible', async (req, res) => {
  const { id_eval } = req.body;

  if (!id_eval) {
    return res.status(400).json({ error: 'El parámetro id_eval es requerido' });
  }

  try {
    const query = `
      UPDATE eval
      SET maildisponible = true
      WHERE id_eval = $1 AND maildisponible = false;
    `;
    
    const result = await pool.query(query, [id_eval]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Registro actualizado correctamente' });
    } else {
      res.status(404).json({ error: 'No se encontró el registro o ya está actualizado' });
    }
  } catch (err) {
    console.error('Error en la actualización:', err);
    res.status(500).json({ error: 'Error en la actualización de la base de datos' });
  }
});

// Endpoint para actualizar inscripcion de alumno
app.put('/api/cambiarinscripcion', async (req, res) => {
  const { id_inscripcion, nuevo_id_inscripcion, id_matricula, nuevo_id_seccion } = req.body;

  try {
    const query = `
      UPDATE public.inscripcion
      SET id_inscripcion = $2,         -- Actualizar el id_inscripcion
          id_matricula = $3,           -- Actualizar el id_matricula
          id_seccion = $4              -- Actualizar el id_seccion
      WHERE id_inscripcion = $1        -- Condición para buscar la inscripción original
      RETURNING *;`;

    // Ejecutar la consulta con los parámetros en el orden correcto
    const result = await pool.query(query, [nuevo_id_inscripcion, id_matricula, nuevo_id_seccion, id_inscripcion]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Inscripción actualizada exitosamente.' });
    } else {
      res.status(404).json({ error: 'No se encontró ninguna inscripción para actualizar.' });
    }
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});

// Endpoint para agregar una nueva inscripción de alumno
app.post('/api/agregarinscripcion', async (req, res) => {
  const { id_inscripcion, id_matricula, id_seccion } = req.body;

  try {
    const query = `
      INSERT INTO public.inscripcion (id_inscripcion, id_matricula, id_seccion) 
      VALUES ($1, $2, $3) 
      RETURNING *;`;

    // Ejecutar la consulta con los parámetros en el orden correcto
    const result = await pool.query(query, [id_inscripcion, id_matricula, id_seccion]);

    if (result.rowCount > 0) {
      res.status(201).json({ message: 'Inscripción creada exitosamente.', data: result.rows[0] });
    } else {
      res.status(400).json({ error: 'Error al crear la inscripción.' });
    }
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});


// Endpoint para actualizar el registro del alumno en la tabla de alumnos
app.put('/api/actualizar-alumno', async (req, res) => {
  const { rut, nombres, apellidos, sexo, user_alum } = req.body;

  try {
    const query = `
      UPDATE public.alumnos
      SET 
        nombres = COALESCE($1, nombres),
        apellidos = COALESCE($2, apellidos),
        sexo = COALESCE($3, sexo),
        user_alum = COALESCE($4, user_alum)
      WHERE rut = $5
      RETURNING *;`;

    const result = await pool.query(query, [nombres, apellidos, sexo, user_alum, rut]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Alumno actualizado exitosamente.', alumno: result.rows[0] });
    } else {
      res.status(404).json({ error: 'No se encontró ningún alumno con el RUT especificado.' });
    }
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});


// ---------------------------------
//      API PARA BORRAR !!!
// ---------------------------------
// Endpoint para eliminar una inscripción por id_inscripcion
app.delete('/api/eliminar_inscripcion/:id_inscripcion', async (req, res) => {
  const { id_inscripcion } = req.params; // Obtener el id_inscripcion desde los parámetros de la ruta

  try {
    // Consulta SQL para eliminar la inscripción según id_inscripcion
    const result = await pool.query(`
      DELETE FROM public.inscripcion
      WHERE id_inscripcion = $1
    `, [id_inscripcion]); // Usar $1 para prevenir inyección SQL

    // Verificar si alguna fila fue afectada (es decir, si el id_inscripcion existía)
    if (result.rowCount > 0) {
      res.json({ message: 'Inscripción eliminada correctamente' });
    } else {
      res.status(404).json({ error: 'Inscripción no encontrada' });
    }
  } catch (err) {
    console.error('Error en la consulta SQL:', err);
    res.status(500).json({ error: 'Error en la consulta SQL' });
  }
});


// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});