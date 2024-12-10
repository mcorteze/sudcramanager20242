import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Combobox from './Combobox';
import MatriculaTable from './MatriculaTable';
import { Button } from 'antd'; // Importa el botón de Ant Design
import { InfoOutlined, ClearOutlined } from '@ant-design/icons'; // Importa los íconos necesarios
import './Formulario.css';

export default function Formulario() {
  const navigate = useNavigate();
  const [programas, setProgramas] = useState([]);
  const [programaSeleccionada, setProgramaSeleccionada] = useState('');
  const [sedes, setSedes] = useState([]);
  const [idSedeSeleccionada, setIdSedeSeleccionada] = useState('');
  const [nombreSedeSeleccionada, setNombreSedeSeleccionada] = useState('');
  const [asignaturas, setAsignaturas] = useState([]);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState('');
  const [secciones, setSecciones] = useState([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('');
  const [matriculas, setMatriculas] = useState([]);
  const [pruebas, setPruebas] = useState([]);
  const [idSeccion, setIdSeccion] = useState('');
  const [numeroSeccion, setNumeroSeccion] = useState('');
  const [jornada, setJornada] = useState('');

  useEffect(() => {
    const fetchProgramas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/programas');
        setProgramas(response.data);
      } catch (error) {
        console.error('Error al obtener los programas:', error);
      }
    };

    const fetchSedes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/sedes');
        setSedes(response.data);
      } catch (error) {
        console.error('Error al obtener las sedes:', error);
      }
    };

    fetchProgramas();
    fetchSedes();
  }, []);

  const handleProgramaChange = async (event) => {
    const codPrograma = event.target.value;
    setProgramaSeleccionada(codPrograma);

    if (codPrograma) {
      try {
        const response = await axios.get(`http://localhost:3001/api/asignaturas/${codPrograma}`);
        setAsignaturas(response.data);
      } catch (error) {
        console.error('Error al obtener las asignaturas:', error);
      }
    } else {
      setAsignaturas([]);
    }

    setAsignaturaSeleccionada('');
  };

  const handleSedeChange = async (event) => {
    const sedeId = event.target.value;
    const nombreSede = sedes.find((sede) => sede.id_sede === sedeId)?.nombre_sede || '';
    setIdSedeSeleccionada(sedeId);
    setNombreSedeSeleccionada(nombreSede);
  };

  const handleAsignaturaChange = async (event) => {
    const asignatura = event.target.value;
    setAsignaturaSeleccionada(asignatura);

    setSeccionSeleccionada('');
    setPruebas([]);
    setMatriculas([]);

    if (asignatura && idSedeSeleccionada) {
      try {
        const responseSecciones = await axios.get(`http://localhost:3001/api/secciones/${asignatura}/${idSedeSeleccionada}`);
        setSecciones(responseSecciones.data);

        const responsePruebas = await axios.get(`http://localhost:3001/api/eval/${asignatura}`);
        setPruebas(responsePruebas.data);
      } catch (error) {
        console.error('Error al obtener las secciones o pruebas:', error);
      }
    } else {
      setSecciones([]);
      setPruebas([]);
    }
  };

  const handleSeccionChange = async (event) => {
    const idSeccion = event.target.value;
    const seccionSeleccionada = event.target.options[event.target.selectedIndex].text;
    setSeccionSeleccionada(idSeccion);
    setIdSeccion(idSeccion);

    if (idSeccion && asignaturaSeleccionada) {
      try {
        const response = await axios.get(`http://localhost:3001/api/matriculas/${idSeccion}/${asignaturaSeleccionada}`);
        setMatriculas(response.data);

        const numeroSeccion = seccionSeleccionada.slice(-4, -1);
        const jornada = seccionSeleccionada.slice(-1);

        setNumeroSeccion(numeroSeccion);
        setJornada(jornada);
      } catch (error) {
        console.error('Error al obtener las matrículas:', error);
      }
    } else {
      setMatriculas([]);
    }
  };

  const handleInfoClick = () => {
    if (idSeccion) {
      window.open(`/secciones/${idSeccion}`, '_blank');
    } else {
      alert('Por favor, seleccione una sección primero.');
    }
  };

  // Nueva función para limpiar los combobox
  const handleClearComboboxes = () => {
    setProgramaSeleccionada('');
    setSeccionSeleccionada('');
    setAsignaturaSeleccionada('');
    setIdSedeSeleccionada('');
    setMatriculas([]);
    setPruebas([]);
    setSecciones([]);
    setAsignaturas([]);
  };

  return (
    <div>
      <div className="formulario-container">
        <Combobox
          label="Programa:"
          id="programas"
          value={programaSeleccionada}
          onChange={handleProgramaChange}
          options={programas.map((programa) => ({ value: programa.cod_programa, label: programa.programa }))}
        />
        <Combobox
          label="Sede:"
          id="sedes"
          value={idSedeSeleccionada}
          onChange={handleSedeChange}
          options={sedes.map((sede) => ({ value: sede.id_sede, label: sede.nombre_sede }))}
        />
        <Combobox
          label="Asignatura:"
          id="asignaturas"
          value={asignaturaSeleccionada}
          onChange={handleAsignaturaChange}
          options={asignaturas.map((asignatura) => ({ value: asignatura.cod_asig, label: asignatura.cod_asig }))}
        />
        <Combobox
          label="Sección:"
          id="secciones"
          value={seccionSeleccionada}
          onChange={handleSeccionChange}
          options={secciones.map((seccion) => ({ value: seccion.id_seccion, label: seccion.seccion }))}
        />
        <Button
          type="primary"
          icon={<InfoOutlined />}
          onClick={handleInfoClick}
          disabled={!idSeccion}
          className="info-button"
        >
        </Button>
        {/* Botón para limpiar */}
        <Button
          type="primary"
          icon={<ClearOutlined />}
          onClick={handleClearComboboxes}
          className="info-button"
        >
        </Button>
      </div>
      <div className="table-container">
        <MatriculaTable
          matriculas={matriculas}
          pruebas={pruebas}
          asignatura={asignaturaSeleccionada}
          idSeccion={idSeccion}
          sedeId={idSedeSeleccionada}
          nombreSede={nombreSedeSeleccionada}
          numSeccion={numeroSeccion}
          jornada={jornada}
        />
      </div>
    </div>
  );
}
