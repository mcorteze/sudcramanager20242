import React, { useState, useEffect } from 'react';
import { Select, Button, message, Space, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { utils, write } from 'xlsx';

import './ExtraerNotasPage.css';

const { Option } = Select;

export default function ExtraerNotasPage() {
  const [programas, setProgramas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [selectedPrograma, setSelectedPrograma] = useState(null);
  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedAsignatura, setSelectedAsignatura] = useState(null);
  const [notas, setNotas] = useState([]);
  const [recordCount, setRecordCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProgramas();
    fetchSedes();
  }, []);

  const fetchProgramas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/programas');
      setProgramas(response.data);
    } catch (error) {
      console.error('Error fetching programas:', error);
    }
  };

  const fetchSedes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/sedes');
      setSedes([{ id_sede: 'all', nombre_sede: 'Todas las sedes' }, ...response.data]);
    } catch (error) {
      console.error('Error fetching sedes:', error);
    }
  };

  const fetchAsignaturas = async (cod_programa) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/asignaturas/${cod_programa}`);
      setAsignaturas(response.data);
    } catch (error) {
      console.error('Error fetching asignaturas:', error);
    }
  };

  const handleProgramaChange = (value) => {
    setSelectedPrograma(value);
    setSelectedAsignatura(null);
    fetchAsignaturas(value);
    resetNotas();
  };

  const handleSedeChange = (value) => {
    setSelectedSede(value);
    resetNotas();
  };

  const handleAsignaturaChange = (value) => {
    setSelectedAsignatura(value);
    resetNotas();
  };

  const resetNotas = () => {
    setNotas([]);
    setRecordCount(0);
  };

  const handleSearchClick = async () => {
    if (selectedPrograma && selectedSede && selectedAsignatura) {
      setLoading(true);
      try {
        const url = selectedSede === 'all' 
          ? `http://localhost:3001/api/notas/${selectedAsignatura}` 
          : `http://localhost:3001/api/notas/${selectedAsignatura}/${selectedSede}`;
        const response = await axios.get(url);
        setNotas(response.data);
        setRecordCount(response.data.length);
      } catch (error) {
        console.error('Error fetching notas:', error);
        message.error('Error al obtener las calificaciones');
      } finally {
        setLoading(false);
      }
    } else {
      message.warning('Por favor, complete todas las selecciones');
    }
  };

  const handleDownloadCSV = () => {
    const csv = Papa.unparse(notas);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const fileName = `notas_${selectedAsignatura}_${selectedSede}.csv`;
    saveAs(blob, fileName);
  };

  const handleDownloadXLSX = () => {
    const ws = utils.json_to_sheet(notas);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Notas');
    const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = `notas_${selectedAsignatura}_${selectedSede}.xlsx`;
    saveAs(blob, fileName);
  };

  return (
    <div className="extraer-notas-page page-full">
      <h1>Extraer Notas</h1>
      <Select
        placeholder="Seleccione un programa"
        onChange={handleProgramaChange}
        style={{ width: '200px', marginBottom: 16 }}
        value={selectedPrograma}
      >
        {programas.map(programa => (
          <Option key={programa.cod_programa} value={programa.cod_programa}>
            {programa.programa}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="Seleccione una sede"
        onChange={handleSedeChange}
        style={{ width: '200px', marginBottom: 16 }}
        value={selectedSede}
      >
        {sedes.map(sede => (
          <Option key={sede.id_sede} value={sede.id_sede}>
            {sede.nombre_sede}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="Seleccione una asignatura"
        onChange={handleAsignaturaChange}
        style={{ width: '200px', marginBottom: 16 }}
        value={selectedAsignatura}
      >
        {asignaturas.map(asignatura => (
          <Option key={asignatura.cod_asig} value={asignatura.cod_asig}>
            {asignatura.cod_asig}
          </Option>
        ))}
      </Select>
      <Space style={{ marginTop: 16 }}>
        <Button
          type="primary"
          onClick={handleSearchClick}
          disabled={!selectedPrograma || !selectedSede || !selectedAsignatura}
          style={{ background: 'red' }}
        >
          Buscar Registros
        </Button>
        <Button
          type="default"
          onClick={handleDownloadCSV}
          disabled={notas.length === 0}
          icon={<DownloadOutlined />}
          style={{ marginLeft: 8 }}
        >
          Descargar CSV
        </Button>
        <Button
          type="default"
          onClick={handleDownloadXLSX}
          disabled={notas.length === 0}
          icon={<DownloadOutlined />}
          style={{ marginLeft: 8 }}
        >
          Descargar XLSX
        </Button>
        <span style={{ marginLeft: 8 }}>
          {loading ? <Spin /> : recordCount > 0 ? `${recordCount} registro(s) encontrado(s)` : 'No hay registros encontrados'}
        </span>
      </Space>
    </div>
  );
}
