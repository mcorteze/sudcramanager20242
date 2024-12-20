import React, { useEffect, useState } from 'react';

const PanelSeccionesPage = () => {
  // Estado para almacenar los datos de las secciones
  const [secciones, setSecciones] = useState([]);
  // Estado para manejar el estado de carga
  const [loading, setLoading] = useState(true);
  // Estado para manejar posibles errores
  const [error, setError] = useState(null);

  // Efecto para obtener los datos cuando el componente se monta
  useEffect(() => {
    const fetchSecciones = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/panelsecciones');
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        const data = await response.json();
        setSecciones(data); // Guardamos los datos en el estado
      } catch (err) {
        setError(err.message); // Guardamos el mensaje de error en caso de fallo
      } finally {
        setLoading(false); // Indicamos que la carga ha finalizado
      }
    };

    fetchSecciones();
  }, []); // Este efecto solo se ejecuta una vez, al montar el componente

  // Si hay un error, lo mostramos
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Si los datos se están cargando, mostramos un mensaje de carga
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Renderizamos los datos en una tabla
  return (
    <div>
      <h1>Panel de Secciones</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Programa</th>
            <th>Sede</th>
            <th>Código Asignatura</th>
            <th>Sección</th>
            <th>ID Sección</th>
            <th>Prueba 1</th>
            <th>Prueba 2</th>
            <th>Prueba 3</th>
            <th>Prueba 4</th>
            <th>Prueba 5</th>
            <th>Prueba 6</th>
            <th>Prueba 7</th>
            <th>Prueba 8</th>
            <th>Prueba 9</th>
            <th>Prueba 10</th>
            <th>Prueba 11</th>
            <th>Prueba 12</th>
          </tr>
        </thead>
        <tbody>
          {secciones.map((seccion, index) => (
            <tr key={index}>
              <td>{seccion.programa}</td>
              <td>{seccion.nombre_sede}</td>
              <td>{seccion.cod_asig}</td>
              <td>{seccion.seccion}</td>
              <td>{seccion.id_seccion}</td>
              <td>{seccion.prueba_1}</td>
              <td>{seccion.prueba_2}</td>
              <td>{seccion.prueba_3}</td>
              <td>{seccion.prueba_4}</td>
              <td>{seccion.prueba_5}</td>
              <td>{seccion.prueba_6}</td>
              <td>{seccion.prueba_7}</td>
              <td>{seccion.prueba_8}</td>
              <td>{seccion.prueba_9}</td>
              <td>{seccion.prueba_10}</td>
              <td>{seccion.prueba_11}</td>
              <td>{seccion.prueba_12}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PanelSeccionesPage;
