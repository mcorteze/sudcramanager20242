import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SharepointPage = () => {
  const [planillas, setPlanillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/tabla_especificaciones_recibidas')  // Cambia a la URL de tu nueva API
      .then((response) => {
        setPlanillas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
        setError('No se pudieron obtener los datos');
        setLoading(false);
      });
  }, []);

  // If data is loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // If an error occurred
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Planillas Recibidas</h1>
      <table>
        <thead>
          <tr>
            {/* Dynamically create headers based on the first planilla object */}
            {planillas.length > 0 && Object.keys(planillas[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {planillas.map((planilla, index) => (
            <tr key={index}>
              {/* Dynamically create cells based on the keys of each planilla */}
              {Object.keys(planilla).map((key) => (
                <td key={key}>{planilla[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SharepointPage;
