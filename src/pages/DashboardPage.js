import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, Table, Segmented, Button } from 'antd';
import { ClearOutlined, DownloadOutlined } from '@ant-design/icons';
import { Calendar } from 'primereact/calendar';
import * as XLSX from 'xlsx'; // Importar la librería XLSX
import PieChartComponent from '../components/Dashboard/PieChartComponent';
import HeatMapComponent from '../components/Dashboard/HeatmapComponent';
import ScatterChartComponent from '../components/Dashboard/ScatterChartComponent';
import HorizontalBarChartComponent from '../components/Dashboard/HorizontalBarChartComponent';
import LineChartWithTwoLines from '../components/Dashboard/LineChartWithTwoLines';

import './home.css';
import './DashboardPage.css';

const formatFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DashboardPage() {
  const [data, setData] = useState([]); // Datos originales
  const [filteredData, setFilteredData] = useState([]); // Datos filtrados
  const [loading, setLoading] = useState(true);

  const [selectedProgram, setSelectedProgram] = useState('Todos');
  const [selectedSede, setSelectedSede] = useState('Todos');
  const [selectedAsignatura, setSelectedAsignatura] = useState('Todos');
  const [selectedPrueba, setSelectedPrueba] = useState('Todos');
  const [selectedFecha, setSelectedFecha] = useState(null);

  const [programOptions, setProgramOptions] = useState([]);
  const [sedeOptions, setSedeOptions] = useState([]);
  const [asignaturaOptions, setAsignaturaOptions] =useState([]);
  const [pruebaOptions, setPruebaOptions] = useState([]);

  const columns = [
    { title: 'Programa', dataIndex: 'programa', key: 'programa' },
    { title: 'Nombre Sede', dataIndex: 'nombre_sede', key: 'nombre_sede' },
    { title: 'Asignatura', dataIndex: 'asig', key: 'asig' },
    { title: 'Código Asignatura', dataIndex: 'cod_asig', key: 'cod_asig' },
    { title: 'Nombre Prueba', dataIndex: 'nombre_prueba', key: 'nombre_prueba' },
    { title: 'Número de Prueba', dataIndex: 'num_prueba', key: 'num_prueba' },
    {
      title: 'Fecha de Lectura',
      dataIndex: 'lectura_fecha',
      key: 'lectura_fecha',
      render: (text) => formatFecha(text),
    },
    { title: 'Logro Obtenido', dataIndex: 'logro_obtenido', key: 'logro_obtenido' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/listado_calificaciones_obtenidas');
        const fetchedData = response.data;
  
        setData(fetchedData); // Establecer datos originales
        setFilteredData(fetchedData); // Establecer datos filtrados inicialmente iguales
  
        // Generar opciones iniciales basadas en todos los datos
        const sortedPrograms = ['Todos', ...[...new Set(fetchedData.map(item => item.programa))].sort()];
        const sortedSedes = ['Todos', ...[...new Set(fetchedData.map(item => item.nombre_sede))].sort()];
        const sortedAsignaturas = ['Todos', ...[...new Set(fetchedData.map(item => item.cod_asig))].sort()];
        const sortedPruebas = ['Todos', ...[...new Set(fetchedData.map(item => item.num_prueba))].sort()];
  
        setProgramOptions(sortedPrograms);
        setSedeOptions(sortedSedes);
        setAsignaturaOptions(sortedAsignaturas);
        setPruebaOptions(sortedPruebas);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    const updateOptions = () => {
      // Generar nuevas opciones basadas en los datos filtrados
      const updatedPrograms = ['Todos', ...[...new Set(filteredData.map(item => item.programa))].sort()];
      const updatedSedes = ['Todos', ...[...new Set(filteredData.map(item => item.nombre_sede))].sort()];
      const updatedAsignaturas = ['Todos', ...[...new Set(filteredData.map(item => item.cod_asig))].sort()];
      const updatedPruebas = ['Todos', ...[...new Set(filteredData.map(item => item.num_prueba))].sort()];
  
      // Actualizar los estados con las nuevas opciones, asegurando que "Todos" siempre sea la primera opción
      setProgramOptions(updatedPrograms);
      setSedeOptions(updatedSedes);
      setAsignaturaOptions(updatedAsignaturas);
      setPruebaOptions(updatedPruebas);
    };
  
    updateOptions();
  }, [filteredData]); // Ejecutar cuando los datos filtrados cambien
  

  const applyFilters = () => {
    let tempData = data;

    if (selectedProgram !== 'Todos') {
      tempData = tempData.filter(item => item.programa === selectedProgram);
    }
    if (selectedSede !== 'Todos') {
      tempData = tempData.filter(item => item.nombre_sede === selectedSede);
    }
    if (selectedAsignatura !== 'Todos') {
      tempData = tempData.filter(item => item.cod_asig === selectedAsignatura);
    }
    if (selectedPrueba !== 'Todos') {
      tempData = tempData.filter(item => item.num_prueba === selectedPrueba);
    }
    if (selectedFecha) {
      const selectedDateStr = formatFecha(selectedFecha);
      tempData = tempData.filter(item => formatFecha(item.lectura_fecha) === selectedDateStr);
    }

    setFilteredData(tempData);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedProgram, selectedSede, selectedAsignatura, selectedPrueba, selectedFecha]);

  const handleClearDate = () => {
    setSelectedFecha(null);
  };

  const handleDownloadXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DatosFiltrados');
    XLSX.writeFile(workbook, 'DatosFiltrados.xlsx');
  };

  return (
    <div className="home-container">
    <h1>Listado de Calificaciones Obtenidas</h1>
    <div className= 'menu-icons-container'>
      <div style={{ marginBottom: 20 }}>
        <Calendar
          value={selectedFecha}
          onChange={(e) => setSelectedFecha(e.value)}
          showIcon
          dateFormat="yy-mm-dd"
          placeholder="Seleccionar fecha"
          style={{ color: 'white' }}
        />
      </div>
      <Button
          type="primary"
          icon={<ClearOutlined />}
          onClick={handleClearDate}
          className="menu-icon"
        >
      </Button>
      <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownloadXLSX}
          className="menu-icon"
        >
      </Button>
    </div>

    <div class="parent">
    {loading ? (
        <Spin tip="Cargando datos..." />
      ) : (
        <>
          {filteredData.length === 0 ? (
            <p>No se encontraron datos para la fecha seleccionada.</p>
          ) : (
            <Table style={{ display: 'none'}}
              dataSource={filteredData.map((item, index) => ({ key: index, ...item }))}
              columns={columns}
              pagination={{ pageSize: 10 }}
            />
          )}
        </>
      )}
      
        <div class="div1">
        <div className='segmen-flex-cont'>
        <div className = 'segmen-cont'>
          <Segmented
            vertical
            options={programOptions}
            value={selectedProgram}
            onChange={value => setSelectedProgram(value)}
            style={{ marginBottom: 20 }}
          />
        </div>
        <div className = 'segmen-cont'>
          <Segmented
            vertical
            options={sedeOptions}
            value={selectedSede}
            onChange={value => setSelectedSede(value)}
            style={{ marginBottom: 20 }}
          />
        </div>
        <div className = 'segmen-cont'>
          <Segmented
            vertical
            options={asignaturaOptions}
            value={selectedAsignatura}
            onChange={value => setSelectedAsignatura(value)}
            style={{ marginBottom: 20 }}
          />
        </div>
        <div className = 'segmen-cont'>
          <Segmented
            vertical
            options={pruebaOptions}
            value={selectedPrueba}
            onChange={value => setSelectedPrueba(value)}
            style={{ marginBottom: 20 }}
          />
        </div>
      </div>
        </div>
        <div class="div2"><PieChartComponent data={filteredData} /></div>
        <div class="div3"><HorizontalBarChartComponent data={filteredData} /></div>
        <div class="div4"><LineChartWithTwoLines data={filteredData} /></div>
        <div class="div5"><HeatMapComponent data={filteredData} /></div>
        <div class="div6"><ScatterChartComponent data={filteredData} /></div> {/* filteredData o data */}
        
    </div>
    
    </div>
  );
}
