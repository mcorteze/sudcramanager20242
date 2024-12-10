const express = require('express'); 
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// Configuración de conexión a la base de datos de tareas
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tareas',
  password: 'fec4a5n5',
  port: 5432,
});

// ---------------------------------------
//       Endpoints tabla DEPOSITO
//----------------------------------------
// Obtener todos los depósitos
app.get('/obtener_depositos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_deposito, deposito FROM Deposito ORDER BY id_deposito ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los depósitos' });
  }
});


// Endpoint para crear un nuevo deposito
app.post('/crear_deposito', async (req, res) => {
  const { deposito } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO Deposito (deposito) VALUES ($1) RETURNING *',
      [deposito]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
});

// Endpoint para eliminar un deposito por ID
app.delete('/eliminar_deposito/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM Deposito WHERE id_deposito = $1 RETURNING *',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.status(200).json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

// ---------------------------------------
//       Endpoints tabla TAREA
//----------------------------------------
// OBTENER todas las tareas con detalles simples
app.get('/tareas_simple', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.id_tarea,
        t.nombre,
		    t.tipo_tarea,
        t.prioridad,
        t.id_deposito,
		    d.deposito,
        t.id_estado,
        e.estado,
        t.configurada
      FROM tarea AS t
      JOIN estado AS e ON t.id_estado = e.id_estado
	    JOIN deposito as d ON d.id_deposito = t.id_deposito
      ORDER BY t.id_tarea;
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});


// Endpoint: OBTENER una tarea por ID
app.get('/tarea/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        t.id_tarea,
        t.nombre,
        t.descripcion,
        t.tipo_tarea,
        t.id_deposito,
        d.deposito,      
        t.id_estado,
        e.estado,
        t.prioridad,
        t.fecha_inicio,
        t.fecha_vencimiento,
        t.lunes,
        t.martes,
        t.miercoles,
        t.jueves,
        t.viernes,
        t.configurada
      FROM tarea AS t
      JOIN estado AS e ON t.id_estado = e.id_estado
      JOIN deposito AS d ON d.id_deposito = t.id_deposito
      WHERE t.id_tarea = $1
    `, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la tarea' });
  }
});

// Endpoint: AGREGAR una tarea por ID
app.post('/agregar_tarea', async (req, res) => {
  const { nombre, tipo_tarea, prioridad, id_deposito, id_estado } = req.body; // Cambié estado a id_estado

  try {
      const result = await pool.query(
          `INSERT INTO Tarea (nombre, tipo_tarea, prioridad, id_deposito, id_estado) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [nombre, tipo_tarea, prioridad, id_deposito, id_estado] 
      );
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

// Endpoint: ELIMINAR una tarea por ID
app.delete('/eliminar_tarea/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM Tarea WHERE id_tarea = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.status(200).json({ message: 'Tarea eliminada correctamente', deletedTask: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});



// Endpoint para MODIFICAR una tarea por ID
app.put('/tarea/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    tipo_tarea,
    id_deposito,
    id_estado,
    prioridad,
    fecha_inicio,
    fecha_vencimiento,
    lunes,
    martes,
    miercoles,
    jueves,
    viernes,
    sabado,
    domingo,
    configurada, // Asegúrate de que este campo esté presente
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE Tarea SET 
        nombre = COALESCE($1, nombre), 
        descripcion = COALESCE($2, descripcion),
        tipo_tarea = COALESCE($3, tipo_tarea), 
        id_deposito = COALESCE($4, id_deposito), 
        id_estado = COALESCE($5, id_estado), 
        prioridad = COALESCE($6, prioridad), 
        fecha_inicio = COALESCE($7, fecha_inicio), 
        fecha_vencimiento = COALESCE($8, fecha_vencimiento),
        lunes = COALESCE($9, lunes), 
        martes = COALESCE($10, martes), 
        miercoles = COALESCE($11, miercoles), 
        jueves = COALESCE($12, jueves), 
        viernes = COALESCE($13, viernes), 
        sabado = COALESCE($14, sabado), 
        domingo = COALESCE($15, domingo),
        configurada = COALESCE($16, configurada)  -- Asegúrate de que este campo se actualice
      WHERE id_tarea = $17 RETURNING *`,
      [
        nombre,
        descripcion,
        tipo_tarea,
        id_deposito,
        id_estado,
        prioridad,
        fecha_inicio,
        fecha_vencimiento,
        lunes,
        martes,
        miercoles,
        jueves,
        viernes,
        sabado,
        domingo,
        configurada,
        id,
      ]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al modificar la tarea' });
  }
});

// --------------------------------------
//       Endpoints tabla ESTADO_TAREA
//----------------------------------------
app.get('/tareas_completo/:fechaSeleccionada/:diaSeleccionado', async (req, res) => {
  const { fechaSeleccionada, diaSeleccionado } = req.params;
  const diaBooleano = {
    lunes: 'lunes',
    martes: 'martes',
    miercoles: 'miercoles',
    jueves: 'jueves',
    viernes: 'viernes',
    sabado: 'sabado',
    domingo: 'domingo'
  }[diaSeleccionado];

  if (!diaBooleano) {
    return res.status(400).json({ error: 'Día no válido' });
  }

  try {
    const result = await pool.query(`
      SELECT
        t.id_tarea,
        t.nombre,
        t.descripcion,
        t.tipo_tarea,
        t.id_deposito,
        d.deposito,
        COALESCE(et.id_estado, 1) AS id_estado,
        COALESCE(et.id_fecha, NULL) AS "fecha_actualizacion",
        t.prioridad,
        t.fecha_inicio,
        t.fecha_vencimiento,
        t.lunes,
        t.martes,
        t.miercoles,
        t.jueves,
        t.viernes,
        t.sabado,
        t.domingo,
        t.configurada
      FROM tarea AS t
      JOIN estado AS e ON t.id_estado = e.id_estado
      JOIN deposito AS d ON d.id_deposito = t.id_deposito
      LEFT JOIN (
        SELECT DISTINCT ON (id_tarea) id_tarea, id_estado, id_fecha
        FROM estado_tarea
        WHERE DATE(id_fecha) = $1  -- Filtra las fechas para el día seleccionado
        ORDER BY id_tarea, id_fecha DESC
      ) AS et ON t.id_tarea = et.id_tarea
      WHERE
        t.fecha_inicio <= $1 AND
        t.fecha_vencimiento >= $1 AND
        t.${diaBooleano} = TRUE
      ORDER BY t.id_tarea;
    `, [fechaSeleccionada]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});



// Endpoint: AGREGAR un nuevo estado de tarea
app.post('/agregar_estado_tarea', async (req, res) => {
  const { id_tarea, id_estado, id_fecha } = req.body; 

  try {
    const result = await pool.query(
      `INSERT INTO estado_tarea (id_tarea, id_estado, id_fecha) VALUES ($1, $2, $3) RETURNING *`,
      [id_tarea, id_estado, id_fecha]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar estado de tarea' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
