const express = require('express');
const odbc = require('odbc');
const app = express();
const port = 5000;

// Configura la conexión ODBC (si prefieres usar la cadena de conexión directa, descomenta la siguiente línea)
const connectionString = 'DSN=sharepoint2024';  // Cambia 'sharepoint2024' por tu DSN configurado.

// Si prefieres una cadena de conexión directa:
// const connectionString = 'Driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=C:\\ruta\\a\\tu\\archivo.accdb;';

async function connectToAccess() {
    try {
        const connection = await odbc.connect(connectionString);
        const result = await connection.query('SELECT * FROM tabla_especificaciones_recibidas');
        return result;
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        console.error('Detalles del error:', err.odbcErrors);
        return null;
    }
}

app.get('/api/tabla_especificaciones_recibidas', async (req, res) => {
    const data = await connectToAccess();
    if (data) {
        res.json(data);  // Devuelve los datos obtenidos como una respuesta JSON
    } else {
        res.status(500).send('Error al obtener los datos de la base de datos');
    }
});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
