import React, { useMemo } from 'react';
import { Scatter } from '@ant-design/plots';
import * as XLSX from 'xlsx'; // Para manejar archivos Excel

// Función para formatear fechas consistentemente
const formatFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
};

const ScatterPlotComponent = ({ data }) => {
  // Procesar datos agrupados y calcular el promedio
  const processedData = useMemo(() => {
    const groupedData = data.reduce((acc, item) => {
      const fecha = formatFecha(item.lectura_fecha); // Formatear fecha
      const key = `${item.programa}-${fecha}`; // Clave única para combinación programa-fecha

      if (!acc[key]) {
        acc[key] = { programa: item.programa, fecha, suma: 0, cantidad: 0 };
      }

      // Validar si `logro_obtenido` es un número
      const logro = parseFloat(item.logro_obtenido);
      if (!isNaN(logro)) {
        acc[key].suma += logro; // Sumar valores válidos
        acc[key].cantidad += 1; // Contar elementos válidos
      }

      return acc;
    }, {});

    // Convertir el objeto agrupado en un arreglo con cálculo del promedio
    const result = Object.values(groupedData).map((item) => ({
      programa: item.programa,
      fecha: item.fecha,
      promedio: item.cantidad > 0 ? item.suma / item.cantidad : 0, // Evitar división por cero
    }));

    result.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Ordenar por fecha

    // Calcular el valor mínimo y máximo de los promedios
    const valoresPromedio = result.map((item) => item.promedio);
    const valorMin = Math.max(0, Math.min(...valoresPromedio)); // El mínimo no puede ser negativo
    const valorMax = Math.max(...valoresPromedio);

    // Normalizar los valores dentro de un rango [0.1, 0.7] para evitar tamaños grandes
    const valorOffset = 0.1; // Desplazamiento para asegurar que no haya valores cero
    result.forEach((item) => {
      // Normalizar el promedio en un rango de [0.1, 0.7]
      const normalized = (item.promedio - valorMin) / (valorMax - valorMin);
      item.promedioEscalado = normalized * (0.7 - valorOffset) + valorOffset; // Aplicar desplazamiento
    });

    return result;
  }, [data]);

  // Función para descargar la data como archivo Excel
  const handleDownloadData = () => {
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DataProcesada');
    XLSX.writeFile(workbook, 'DataProcesada.xlsx');
  };

  // Configuración del gráfico de dispersión
  const config = {
    data: processedData,
    xField: 'fecha', // Eje X: Fecha de lectura
    yField: 'programa', // Eje Y: Programa
    sizeField: 'promedioEscalado', // Tamaño de los puntos será el promedio escalado
    colorField: 'programa', // Color basado en el programa
    shapeField: 'circle',
    scale: {
      size: {
        range: [3, 15], // Ajustar el rango de tamaño de las burbujas para que sean pequeñas
      },
    },
    legend: false,
    tooltip: {
      title: 'Promedio',
      formatter: (datum) => ({
        name: datum.programa,
        value: datum.promedio.toFixed(2), // Mostrar el promedio con dos decimales
      }),
    },
    style: {
      stroke: 'black',
      opacity: 0.8,
      lineWidth: 1,
    },
  };

  return (
    <div style={{ width: '100%', height: '100%', padding: '10px' }}>
      <h3>Promedio por Programa y Fecha (ajuste de logro escalado)</h3>
      <Scatter {...config} />
      <button
        onClick={handleDownloadData}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Descargar Data
      </button>
    </div>
  );
};

export default ScatterPlotComponent;
