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

const LineChartWithTwoLines = ({ data }) => {
  // Procesar datos agrupados para calcular el conteo
  const processedData = useMemo(() => {
    const groupByField = (field) => {
      const groupedData = data.reduce((acc, item) => {
        const fecha = formatFecha(item.lectura_fecha); // Formatear fecha
        if (!acc[fecha]) {
          acc[fecha] = 0;
        }
        if (item[field]) {
          acc[fecha] += 1; // Incrementar el conteo para esa fecha
        }
        return acc;
      }, {});

      // Convertir el objeto agrupado en un arreglo
      const result = Object.entries(groupedData).map(([fecha, conteo]) => ({
        fecha,
        conteo,
      }));

      // Ordenar por fecha
      result.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

      // Calcular percentil 95
      const conteos = result.map((item) => item.conteo);
      const percentile95 = calculatePercentile(conteos, 95);

      // Limitar al percentil 95
      result.forEach((item) => {
        if (item.conteo > percentile95) {
          item.conteo = percentile95;
        }
      });

      return result;
    };

    // Generar datasets para ambos campos
    const imagenData = groupByField('imagen');
    const idArchivoLeidoData = groupByField('id_archivoleido');

    // Combinar los datasets con una clave adicional para distinguir las series
    return [
      ...imagenData.map((item) => ({ ...item, serie: 'Imagen' })),
      ...idArchivoLeidoData.map((item) => ({ ...item, serie: 'ID Archivo Leído' })),
    ];
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
    seriesField: 'serie', // Campo para distinguir las líneas
    colorField: 'serie', // Usar 'serie' para diferenciar los colores
    color: ['#1890ff', '#ff7f0e'], // Colores personalizados para cada serie
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
      shared: true, // Aseguramos que el tooltip sea compartido entre las series
      showMarkers: true,
      formatter: (datum) => {
        // Aquí nos aseguramos de que el nombre y valor sean correctos
        return {
          name: datum.serie, // Mostrar el nombre de la serie (Imagen o ID Archivo Leído)
          value: datum.conteo, // Mostrar el conteo
        };
      },
    },
    smooth: true, // Líneas suavizadas
    lineStyle: {
      lineWidth: 2,
    },
    legend: {
      position: 'top', // Ubicación de la leyenda
      itemName: {
        style: {
          fontSize: 14, // Tamaño de la fuente de la leyenda
        },
      },
    },
    label: {
      visible: true, // Habilitar la visibilidad de las etiquetas
      offset: 10, // Desplazar las etiquetas un poco por encima de los puntos
      style: {
        fontSize: 12,
        fill: '#000', // Color del texto de las etiquetas
        fontWeight: '400',
        position: 'top',
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%', padding: '10px' }}>
      <h3>Gráfico de Línea: Conteo de Lecturas por Fecha</h3>

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

export default LineChartWithTwoLines;
