import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Pagination } from 'antd';
import axios from 'axios';

const UltimoProcesoPlanilla = () => {
  const [data, setData] = useState([]); // Datos completos del backend
  const [loading, setLoading] = useState(true); // Estado de carga
  const [currentPage, setCurrentPage] = useState(1); // Página actual de las fechas (paginación horizontal)
  const [datesPerPage, setDatesPerPage] = useState(10); // Número de fechas visibles por página
  const [currentDates, setCurrentDates] = useState([]); // Fechas actuales visibles en columnas
  const [totalDates, setTotalDates] = useState([]); // Lista de todas las fechas únicas

  // Obtener datos del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/listado_calificaciones_obtenidas_planilla');
        const rawData = response.data;

        // Extraer fechas únicas
        const uniqueDates = Array.from(new Set(rawData.map((item) => item.fecha)));
        setTotalDates(uniqueDates);

        // Establecer las fechas iniciales visibles
        setCurrentDates(uniqueDates.slice(0, datesPerPage));

        // Guardar los datos en el estado
        setData(rawData);
      } catch (err) {
        console.error('Error al obtener los datos:', err);
        message.error('Hubo un error al obtener los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [datesPerPage]);

  // Manejar el cambio de página para las fechas (paginación horizontal)
  const handlePageChange = (page) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * datesPerPage;
    setCurrentDates(totalDates.slice(startIndex, startIndex + datesPerPage));
  };

  // Transformar los datos para la tabla
  const getTableData = () => {
    const programs = Array.from(new Set(data.map((item) => item.programa))); // Programas únicos

    // Crear filas basadas en los programas
    return programs.map((programa) => {
      const row = { programa }; // Inicializar fila con el programa
      currentDates.forEach((date) => {
        // Encontrar la frecuencia correspondiente
        const record = data.find((item) => item.programa === programa && item.fecha === date);
        row[date] = record ? record.frecuencia : 0; // Asignar frecuencia o 0 si no hay datos
      });
      return row;
    });
  };

  // Configurar columnas dinámicas
  const columns = [
    {
      title: 'Programa',
      dataIndex: 'programa',
      key: 'programa',
      fixed: 'left', // Fijar la primera columna
    },
    ...currentDates.map((date) => ({
      title: date,
      dataIndex: date,
      key: date,
    })),
  ];

  return (
    <div>
      <Spin spinning={loading} tip="Cargando...">
      <h2>Procesamientos de planilla</h2>
        <Table
          columns={columns} // Columnas dinámicas basadas en las fechas visibles
          dataSource={getTableData()} // Filas transformadas
          rowKey="programa" // Usar 'programa' como clave única para cada fila
          bordered
          pagination={false} // Sin paginación interna de la tabla
          scroll={{ x: true }} // Habilitar scroll horizontal
        />
      </Spin>
      
      {/* Paginación horizontal para las fechas */}
      <Pagination
        current={currentPage} // Página actual
        total={totalDates.length} // Total de fechas
        pageSize={datesPerPage} // Fechas por página
        onChange={handlePageChange} // Cambiar página
        showSizeChanger={false} // Deshabilitar cambio de tamaño de página
        style={{ marginTop: '16px', textAlign: 'center' }}
      />
    </div>
  );
};

export default UltimoProcesoPlanilla;
