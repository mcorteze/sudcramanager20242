import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message, Typography } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import SearchForm from './SearchForm';
import AlumnoInfo from './AlumnoInfo';
import InscripcionesTable from './InscripcionesTable';
import EvaluacionesTable from './EvaluacionesTable';
import DrawerSection from './DrawerSection';
import InformesTable from './InformesTable';
import './RutAlumno.css';

export default function RutAlumno() {
  const [rut, setRut] = useState('');
  const [alumnoInfo, setAlumnoInfo] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState(null);
  const [inscripciones, setInscripciones] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedAsignatura, setSelectedAsignatura] = useState(null); 
  const [idMatricula, setIdMatricula] = useState(null);
  const { rut: rutParam } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (rutParam) {
      setRut(rutParam);
      fetchData(rutParam);
    }
  }, [rutParam]);

  const fetchData = async (rut) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/alumnos/${rut}`);
      const data = response.data;

      if (data.length > 0) {
        setAlumnoInfo(data[0]);
        setAlumnos(data);
        fetchInscripciones(data[0].id_matricula);
        setIdMatricula(data[0].id_matricula);
      } else {
        setAlumnoInfo(null);
        setAlumnos([]);
        setInscripciones([]);
      }

      setError(null);
    } catch (err) {
      console.error('Error al obtener datos:', err);
      setError('Error al obtener datos del servidor');
    }
  };

  const fetchInscripciones = async (id_matricula) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/inscripciones/${id_matricula}`);
      setInscripciones(response.data);
    } catch (err) {
      console.error('Error al obtener inscripciones:', err);
      setError('Error al obtener inscripciones del servidor');
    }
  };

  const handleSearch = (value) => {
    setRut(value);
    navigate(`/rut/${value}`);
  };

  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      <h1>ESTE TITULO DEBERIA VERSE</h1>
      {error && <Typography.Text type="danger">{error}</Typography.Text>}
      <AlumnoInfo alumnoInfo={alumnoInfo} />
      <InscripcionesTable inscripciones={inscripciones} />
      <EvaluacionesTable alumnos={alumnos} />
      <InformesTable idMatricula={idMatricula} /> {/* Nuevo componente para mostrar los informes */}
      <DrawerSection 
        visible={drawerVisible} 
        onClose={() => setDrawerVisible(false)} 
        setSelectedSede={setSelectedSede} 
        setSelectedAsignatura={setSelectedAsignatura} 
        idMatricula={idMatricula}
      />
    </div>
  );
}
