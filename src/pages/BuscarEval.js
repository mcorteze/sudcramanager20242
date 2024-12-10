import React, { useState, useEffect } from 'react';
import { Select, Table, message, Spin, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';
import * as XLSX from 'xlsx'; // Importar la biblioteca xlsx

const { Option } = Select;

export default function EvaluacionesFiltradas() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrograma, setSelectedPrograma] = useState(null);
  const [selectedAsignatura, setSelectedAsignatura] = useState(null);

  useEffect(() => {
    // Cargar las evaluaciones al cargar el componente
    fetchEvaluaciones();
  }, []);

  const fetchEvaluaciones = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/evaluaciones');
      const data = response.data;

      setEvaluaciones(data);

      // Extraer programas y asignaturas únicos para los comboboxes
      const programasUnicos = [...new Set(data.map(e => e.programa))];
      setProgramas(programasUnicos);
      
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener evaluaciones:', err);
      message.error('Error al obtener evaluaciones del servidor');
      setLoading(false);
    }
  };

  const handleProgramaChange = (programa) => {
    setSelectedPrograma(programa);
    setSelectedAsignatura(null);

    // Filtrar asignaturas según el programa seleccionado
    const asignaturasFiltradas = evaluaciones
      .filter(e => e.programa === programa)
      .map(e => e.cod_asig);
      
    const asignaturasUnicas = [...new Set(asignaturasFiltradas)];
    setAsignaturas(asignaturasUnicas);
  };

  const handleAsignaturaChange = (asignatura) => {
    setSelectedAsignatura(asignatura);
  };

  // Filtrar las evaluaciones para la tabla
  const evaluacionesFiltradas = evaluaciones.filter(e => {
    return (
      (!selectedPrograma || e.programa === selectedPrograma) &&
      (!selectedAsignatura || e.cod_asig === selectedAsignatura)
    );
  });

  // Columnas para la tabla
  const columns = [
    { title: 'Programa', dataIndex: 'programa', key: 'programa' },
    { title: 'Código Asignatura', dataIndex: 'cod_asig', key: 'cod_asig' },
    { title: 'Número Prueba', dataIndex: 'num_prueba', key: 'num_prueba' },
    { title: 'Nombre Prueba', dataIndex: 'nombre_prueba', key: 'nombre_prueba' },
    { 
      title: 'Tiene Formas', 
      dataIndex: 'tiene_formas', 
      key: 'tiene_formas',
      render: (text, record) => (record.tiene_formas ? 'Sí' : 'No')
    },
    { 
      title: 'Tiene Grupo', 
      dataIndex: 'tiene_grupo', 
      key: 'tiene_grupo',
      render: (text, record) => (record.tiene_grupo ? 'Sí' : 'No')
    },
    { 
      title: 'Fecha Cargado', 
      dataIndex: 'cargado_fecha', 
      key: 'cargado_fecha',
      render: (text, record) => moment(record.cargado_fecha).format('HH:mm:ss - DD/MM/YYYY')
    },
  ];

  // Función para descargar el Excel
  const descargarExcel = () => {
    const dataParaExportar = evaluacionesFiltradas.map(e => ({
      Programa: e.programa,
      'Código Asignatura': e.cod_asig,
      'Número Prueba': e.num_prueba,
      'Nombre Prueba': e.nombre_prueba,
      'Tiene Formas': e.tiene_formas ? 'Sí' : 'No',
      'Tiene Grupo': e.tiene_grupo ? 'Sí' : 'No',
      'Fecha Cargado': moment(e.cargado_fecha).format('HH:mm:ss - DD/MM/YYYY'),
    }));

    const hoja = XLSX.utils.json_to_sheet(dataParaExportar);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Evaluaciones');

    // Generar y descargar el archivo
    XLSX.writeFile(libro, 'evaluaciones.xlsx');
  };

  return (
    <div className='page-full'>
      <h1>Tablas de especificaciones cargadas</h1>
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Seleccione un programa"
          style={{ width: 200, marginRight: 10 }}
          onChange={handleProgramaChange}
          value={selectedPrograma}
        >
          {programas.map(programa => (
            <Option key={programa} value={programa}>
              {programa}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Seleccione una asignatura"
          style={{ width: 200 }}
          onChange={handleAsignaturaChange}
          value={selectedAsignatura}
          disabled={!selectedPrograma}
        >
          {asignaturas.map(asignatura => (
            <Option key={asignatura} value={asignatura}>
              {asignatura}
            </Option>
          ))}
        </Select>
      </div>

      <Button type="primary" onClick={descargarExcel} style={{ marginBottom: 16 }}>
        Descargar Excel
      </Button>

      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={evaluacionesFiltradas}
          rowKey="id_eval"
          pagination={false} 
        />
      )}
    </div>
  );
}
