import React, { useMemo } from 'react';
import { Heatmap } from '@ant-design/plots';

// Función para formatear fechas consistentemente
const formatFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
};

// Función para calcular el percentil
const calculatePercentile = (data, percentile) => {
  const sorted = [...data].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index];
};

const HeatMapComponent = ({ data }) => {
  // Procesar datos agrupados
  const processedData = useMemo(() => {
    // Agrupar datos por programa y fecha única
    const groupedData = data.reduce((acc, item) => {
      const fecha = formatFecha(item.lectura_fecha); // Formatear fecha
      const key = `${item.programa}-${fecha}`; // Clave única para combinación programa-fecha

      if (!acc[key]) {
        acc[key] = { programa: item.programa, fecha, conteo: 0 };
      }

      acc[key].conteo += 1; // Incrementar frecuencia
      return acc;
    }, {});

    // Convertir el objeto agrupado en un arreglo
    const result = Object.values(groupedData);

    // Ordenar el arreglo por fecha (de más antigua a más reciente)
    result.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Extraer los valores de conteo
    const conteos = result.map((item) => item.conteo);

    // Calcular el percentil 90
    const percentile90 = calculatePercentile(conteos, 90);

    // Ajustar los valores de conteo que superen el percentil 90
    result.forEach((item) => {
      if (item.conteo > percentile90) {
        item.conteo = percentile90; // Reemplazar valor
      }
    });

    return result;
  }, [data]);

  // Configuración del gráfico
  const config = {
    data: processedData,
    xField: 'fecha', // Eje X: Fecha de lectura
    yField: 'programa', // Eje Y: Programa
    colorField: 'conteo', // Intensidad de color basada en el conteo
    color: ['#f5f5f5', '#d4e4f4', '#91c4ea', '#388fca', '#0b61a4'], // Escala de colores
    xAxis: {
      title: {
        text: 'Fecha de Lectura',
      },
      label: {
        rotate: Math.PI / 4, // Rotar etiquetas para mayor claridad
        style: {
          fontSize: 10,
        },
      },
    },
    yAxis: {
      title: {
        text: 'Programa',
      },
      label: {
        style: {
          fontSize: 10,
        },
      },
    },
    // Estilo de celda
    mark: 'cell',
    style: {
      inset: 0.5,
    },
  };

  return (
    <div style={{ width: '100%', height: '100%', padding: '10px' }}>
      <h3>Mapa de calor de procesamiento por programa (Redondeo de frecuencias al percentil 90)</h3>
      <Heatmap {...config} />
    </div>
  );
};

export default HeatMapComponent;
