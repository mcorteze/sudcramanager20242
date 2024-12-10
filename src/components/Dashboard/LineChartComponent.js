import React, { useMemo } from 'react';
import { Line } from '@ant-design/plots'; // Asegúrate de usar el gráfico de tipo Line
import * as XLSX from 'xlsx'; // Para descargar la data

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

const LineChartComponent = ({ data }) => {
  // Procesar datos agrupados para calcular el conteo
  const processedData = useMemo(() => {
    // Agrupar los datos por fecha y contar cuántos registros existen por cada fecha
    const groupedData = data.reduce((acc, item) => {
      const fecha = formatFecha(item.lectura_fecha); // Formatear fecha
      if (!acc[fecha]) {
        acc[fecha] = 0;
      }
      acc[fecha] += 1; // Incrementar el conteo para esa fecha
      return acc;
    }, {});

    // Convertir el objeto agrupado en un arreglo
    const result = Object.entries(groupedData).map(([fecha, conteo]) => ({
      fecha,
      conteo,
    }));

    // Ordenar por fecha (de más antigua a más reciente)
    result.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Calcular el percentil 95
    const conteos = result.map((item) => item.conteo);
    const percentile95 = calculatePercentile(conteos, 95);

    // Reemplazar los valores superiores al percentil 95 por el valor del percentil 95
    result.forEach((item) => {
      if (item.conteo > percentile95) {
        item.conteo = percentile95;
      }
    });

    return result;
  }, [data]);

  // Función para descargar la data procesada
  const handleDownloadData = () => {
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DataProcesada');
    XLSX.writeFile(workbook, 'DataProcesada.xlsx');
  };

  // Configuración del gráfico de línea
  const config = {
    data: processedData,
    xField: 'fecha', // Eje X: Fecha de lectura
    yField: 'conteo', // Eje Y: Conteo de lecturas
    color: '#1890ff',
    xAxis: {
      title: {
        text: 'Fecha de Lectura',
      },
      label: {
        rotate: Math.PI / 4, // Rotar etiquetas para mayor claridad
        style: {
          fontSize: 12,
        },
      },
    },
    yAxis: {
      title: {
        text: 'Conteo de Lecturas',
      },
      label: {
        style: {
          fontSize: 12,
        },
      },
    },
    tooltip: {
      title: 'Conteo',
      formatter: (datum) => ({
        name: 'Conteo',
        value: datum.conteo,
      }),
    },
    // Línea: Dibujar la línea en rojo
    lineStyle: {
      lineWidth: 2, // Grosor de la línea
      stroke: '#ff0000', // Color de la línea: rojo
      opacity: 1, // Opacidad 100% para asegurar que se vea bien
    },
    smooth: true, // Esto suaviza las líneas y puede ayudar a hacerlas más visibles
    // Área debajo de la línea: Si lo deseas
    area: {
      style: {
        fill: 'l(270) 0:rgb(24,144,255) 0.5:rgb(0,64,128)', // Área de color con degradado
        opacity: 0.1, // Opacidad del área debajo de la línea
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%', padding: '10px' }}>
      <h3>Gráfico de Línea: Conteo de Lecturas por Fecha (conteo de las lecturas por fecha ajustado al percentil 95)</h3>

      {/* Gráfico de línea */}
      <Line {...config} />

      {/* Botón para descargar la data procesada */}
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

export default LineChartComponent;
