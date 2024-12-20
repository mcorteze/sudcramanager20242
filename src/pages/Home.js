import React, { useEffect, useState } from 'react';
import { Table, message, Pagination } from 'antd';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { ResponsiveContainer } from 'recharts';

import UltimoProcesoImagen from '../components/Home/UltimoProcesoImagen';
import UltimoProcesoPlanilla from '../components/Home/UltimoProcesoPlanilla';
import UltimoIdArchivoleidoImagen from '../components/Home/UltimoIdArchivoleidoImagen';

import './home.css';

// Columnas para la tabla de últimas calificaciones
const columnsUltimasCalificaciones = [
  {
    title: 'Programa',
    dataIndex: 'programa',
    key: 'programa',
  },
  {
    title: 'Fecha Lectura',
    dataIndex: 'lectura_fecha',
    key: 'lectura_fecha',
    render: (text) => {
      const date = new Date(text);
      const pad = (n) => n.toString().padStart(2, '0');
      const formattedDate = `${date.getDate()}-${pad(date.getMonth() + 1)}-${pad(date.getFullYear())}`;
      const formattedTime = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
      return `${formattedDate}, ${formattedTime}`;
    },
  },
  {
    title: 'Días Atrás',
    dataIndex: 'lectura_fecha',
    key: 'dias_atras',
    render: (text) => {
      const fechaLectura = new Date(text);
      const hoy = new Date();
  
      // Normalizar las fechas al inicio del día
      const normalizarFecha = (fecha) => {
        return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
      };
  
      const fechaLecturaNormalizada = normalizarFecha(fechaLectura);
      const hoyNormalizado = normalizarFecha(hoy);
  
      const diferenciaEnMilisegundos = hoyNormalizado - fechaLecturaNormalizada;
      const diasAtras = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));
  
      if (diasAtras === 0) return 'Hoy';
      if (diasAtras === 1) return 'Hace 1 día';
      return `Hace ${diasAtras} días`;
    },
  },
  {
    title: 'Nombre Prueba',
    dataIndex: 'nombre_prueba',
    key: 'nombre_prueba',
  },
  {
    title: 'Número Prueba',
    dataIndex: 'num_prueba',
    key: 'num_prueba',
  },
  {
    title: 'ID Evaluación',
    dataIndex: 'id_eval',
    key: 'id_eval',
  },
  {
    title: 'Logro Obtenido',
    dataIndex: 'logro_obtenido',
    key: 'logro_obtenido',
    render: (text) => `${(text * 100).toFixed(1)}%`,
  },
];

export default function Home() {
  const [dataUltimasCalificaciones, setDataUltimasCalificaciones] = useState([]);
  const [dataRecuentoEvaluaciones, setDataRecuentoEvaluaciones] = useState([]);
  const [dataRecuentoPorPrograma, setDataRecuentoPorPrograma] = useState([]); // Nueva tabla
  const [loadingUltimasCalificaciones, setLoadingUltimasCalificaciones] = useState(true);
  const [loadingRecuentoEvaluaciones, setLoadingRecuentoEvaluaciones] = useState(true);
  const [loadingRecuentoPorPrograma, setLoadingRecuentoPorPrograma] = useState(true); // Nueva tabla

  const [dates, setDates] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
  const [paginatedData, setPaginatedData] = useState([]);
  const [paginatedDataByProgram, setPaginatedDataByProgram] = useState([]); // Nueva tabla
  const [chartData, setChartData] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [colors, setColors] = useState({});

  // Fetch de datos y procesamiento
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch últimas calificaciones
        const responseUltimasCalificaciones = await axios.get('http://localhost:3001/api/ultimas-calificaciones');
        setDataUltimasCalificaciones(responseUltimasCalificaciones.data);
        setLoadingUltimasCalificaciones(false);
        
        // Fetch recuento de evaluaciones
        const responseRecuentoEvaluaciones = await axios.get('http://localhost:3001/api/recuento-emitidos');
        
        const sortedDataForTable = responseRecuentoEvaluaciones.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setDataRecuentoEvaluaciones(sortedDataForTable);

        // Procesar datos para la tabla intermedia (por Programa)
        const groupedData = groupDataByProgramAndDate(sortedDataForTable);
        setDataRecuentoPorPrograma(groupedData);
        setLoadingRecuentoPorPrograma(false);

        // Obtener fechas únicas
        const uniqueDates = [...new Set(sortedDataForTable.map(item => item.fecha))].sort((a, b) => new Date(b) - new Date(a));
        setDates(uniqueDates);
        setCurrentDate(uniqueDates[0]);

        // Procesar datos para el gráfico (ordenado en forma ascendente)
        const processedData = processChartData(responseRecuentoEvaluaciones.data);
        setChartData(processedData.chartData);
        setAsignaturas(processedData.asignaturas);
        
        const newColors = {};
        processedData.asignaturas.forEach(cod_asig => {
          newColors[cod_asig] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        });
        setColors(newColors);

        setLoadingRecuentoEvaluaciones(false);
      } catch (error) {
        message.error('Error al cargar los datos');
        setLoadingUltimasCalificaciones(false);
        setLoadingRecuentoEvaluaciones(false);
        setLoadingRecuentoPorPrograma(false);
      }
    };

    fetchData();
  }, []);

  // Agrupar los datos por Programa y Fecha
  const groupDataByProgramAndDate = (data) => {
    const grouped = data.reduce((acc, curr) => {
      const key = `${curr.programa}-${curr.fecha}`;
      if (!acc[key]) {
        acc[key] = { programa: curr.programa, fecha: curr.fecha, total_evaluaciones: 0 };
      }
      acc[key].total_evaluaciones += Number(curr.total_evaluaciones);
      return acc;
    }, {});
    return Object.values(grouped);
  };

  // Filtrar los datos según la fecha seleccionada en la paginación
  useEffect(() => {
    if (currentDate) {
      const filteredData = dataRecuentoEvaluaciones.filter(item => item.fecha === currentDate);
      setPaginatedData(filteredData);

      const filteredDataByProgram = dataRecuentoPorPrograma.filter(item => item.fecha === currentDate);
      setPaginatedDataByProgram(filteredDataByProgram);
    }
  }, [currentDate, dataRecuentoEvaluaciones, dataRecuentoPorPrograma]);

  // Función para procesar los datos del gráfico
  const processChartData = (data) => {
    const today = new Date();
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(today.getDate() - 14);

    const filteredData = data.filter(item => {
      const itemDate = new Date(item.fecha);
      return itemDate >= fourteenDaysAgo && itemDate <= today;
    });

    const groupedData = filteredData.reduce((acc, item) => {
      const date = new Date(item.fecha);
      if (!acc[date]) {
        acc[date] = {};
      }
      acc[date][item.cod_asig] = item.total_evaluaciones;
      return acc;
    }, {});

    const chartData = Object.keys(groupedData).map(date => ({
      date: new Date(date),
      ...groupedData[date],
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    const asignaturas = [...new Set(filteredData.map(item => item.cod_asig))];

    return { chartData, asignaturas };
  };

  // Función para calcular el total de evaluaciones de la página actual
  const calculateTotalEvaluaciones = (data) => {
    return data.reduce((total, record) => total + Number(record.total_evaluaciones), 0);
  };

  // Manejar el cambio de página de la paginación
  const handlePageChange = (page) => {
    setCurrentDate(dates[page - 1]);
  };

  return (
    <div className='page-full'>
      <h1>Resumen</h1>
      
      <h2>Último procesamiento</h2>
      <Table className="table_formato1"
        columns={columnsUltimasCalificaciones} 
        dataSource={dataUltimasCalificaciones} 
        loading={loadingUltimasCalificaciones} 
        rowKey="id_eval"
        pagination={false} 
      />

      
      <div className="pagination-container">
        <Pagination 
          current={dates.indexOf(currentDate) + 1} 
          pageSize={1} 
          total={dates.length} 
          onChange={handlePageChange} 
        />
      </div>

      <UltimoProcesoImagen />
      <UltimoProcesoPlanilla />
      <UltimoIdArchivoleidoImagen />
      
      <h3>Resumen de Evaluaciones por Día (últimos 14 días)</h3>
      <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString()} // Formatear la fecha aquí
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {asignaturas.map(cod_asig => (
              <Bar 
                key={cod_asig} 
                dataKey={cod_asig} 
                stackId="a" 
                fill={colors[cod_asig]} // Usar el color fijo almacenado en el estado
              />
            ))}
          </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
