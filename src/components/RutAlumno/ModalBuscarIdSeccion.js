import React, { useState, useEffect } from 'react';
import { Drawer, Select, notification, Typography, Button } from 'antd';
import axios from 'axios';

const { Option } = Select;

const ModalBuscarIdSeccion = ({ visible, onClose, onSeccionSelect, idMatricula }) => {
  const [programas, setProgramas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [secciones, setSecciones] = useState([]);

  const [selectedPrograma, setSelectedPrograma] = useState(null);
  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedAsignatura, setSelectedAsignatura] = useState(null);
  const [selectedSeccion, setSelectedSeccion] = useState(null);  // Almacena el objeto completo de la sección seleccionada

  useEffect(() => {
    // Cargar los programas desde la API al iniciar
    const fetchProgramas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/programas');
        setProgramas(response.data);
      } catch (error) {
        console.error("Error al cargar programas:", error);
        notification.error({ message: 'Error al cargar programas' });
      }
    };
    fetchProgramas();
  }, []);

  const handleProgramaChange = async (value) => {
    setSelectedPrograma(value);
    try {
      const response = await axios.get('http://localhost:3001/api/sedes');
      setSedes(response.data);
    } catch (error) {
      notification.error({ message: 'Error al cargar sedes' });
    }
  };

  const handleSedeChange = async (value) => {
    setSelectedSede(value);
    try {
      const response = await axios.get(`http://localhost:3001/api/asignaturas/${selectedPrograma}`);
      setAsignaturas(response.data);
    } catch (error) {
      notification.error({ message: 'Error al cargar asignaturas' });
    }
  };

  const handleAsignaturaChange = async (value) => {
    setSelectedAsignatura(value);
    try {
      const response = await axios.get(`http://localhost:3001/api/secciones/${value}/${selectedSede}`);
      setSecciones(response.data);
    } catch (error) {
      notification.error({ message: 'Error al cargar secciones' });
    }
  };

  const handleSeccionSelect = (value) => {
    const seccionData = secciones.find(sec => sec.seccion === value);  // Busca el objeto de la sección seleccionada
    setSelectedSeccion(seccionData);  // Almacena el objeto completo en lugar de solo el valor de la sección
    onSeccionSelect(seccionData);  // Enviar la sección seleccionada al componente padre (si es necesario)
  };

  const handleInscripcion = async () => {
    if (!idMatricula || !selectedSeccion) {
      notification.error({ message: 'Por favor, seleccione todos los campos necesarios.' });
      return;
    }

    const idInscripcion = `${idMatricula}-${selectedSeccion.id_seccion}`;

    try {
      const response = await axios.post('http://localhost:3001/api/agregarinscripcion', {
        id_inscripcion: idInscripcion,
        id_matricula: idMatricula,
        id_seccion: selectedSeccion.id_seccion,
      });

      notification.success({ message: response.data.message });
    } catch (error) {
      console.error('Error al realizar la inscripción:', error);
      notification.error({ message: 'Error al realizar la inscripción. Intente nuevamente.' });
    }
  };

  return (
    <Drawer
      title="Buscar Sección"
      placement="right"
      visible={visible}
      onClose={onClose}
      width={400}
    >
      <Select
        placeholder="Seleccione un programa"
        style={{ width: '100%', marginBottom: '10px' }}
        onChange={handleProgramaChange}
      >
        {programas
          .filter(programa => programa.programa && programa.cod_programa) // Filtrar valores vacíos
          .map((programa) => (
            <Option key={programa.cod_programa} value={programa.cod_programa}>
              {programa.programa}
            </Option>
          ))
        }
      </Select>

      <Select
        placeholder="Seleccione una sede"
        style={{ width: '100%', marginBottom: '10px' }}
        onChange={handleSedeChange}
        disabled={!selectedPrograma}
      >
        {sedes.map((sede) => (
          <Option key={sede.id_sede} value={sede.id_sede}>
            {sede.nombre_sede}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Seleccione una asignatura"
        style={{ width: '100%', marginBottom: '10px' }}
        onChange={handleAsignaturaChange}
        disabled={!selectedSede}
      >
        {asignaturas.map((asignatura) => (
          <Option key={asignatura.cod_asig} value={asignatura.cod_asig}>
            {asignatura.cod_asig}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Seleccione una sección"
        style={{ width: '100%', marginBottom: '10px' }}
        onChange={handleSeccionSelect}
        disabled={!selectedAsignatura}
      >
        {secciones.map((seccion) => (
          <Option key={seccion.seccion} value={seccion.seccion}>
            {seccion.seccion}
          </Option>
        ))}
      </Select>

      {/* Mostrar ID Matrícula aquí */}
      {idMatricula && (
        <Typography.Text style={{ display: 'block', marginTop: '10px' }}>
          <strong>ID Matrícula:</strong> {idMatricula}
        </Typography.Text>
      )}

      {/* Mostrar ID Sección aquí si se selecciona una sección */}
      {selectedSeccion && (
        <Typography.Text style={{ display: 'block', marginTop: '10px' }}>
          <strong>ID Sección:</strong> {selectedSeccion.id_seccion}
        </Typography.Text>
      )}

      {/* Mostrar ID Inscripción aquí como concatenación de ID Matrícula y ID Sección */}
      {idMatricula && selectedSeccion && (
        <Typography.Text style={{ display: 'block', marginTop: '10px' }}>
          <strong>ID Inscripción:</strong> {`${idMatricula}-${selectedSeccion.id_seccion}`}
        </Typography.Text>
      )}

      {/* Botón para realizar la inscripción */}
      <Button type="primary" onClick={handleInscripcion} style={{ marginTop: '20px' }}>
        Realizar Inscripción
      </Button>
    </Drawer>
  );
};

export default ModalBuscarIdSeccion;
