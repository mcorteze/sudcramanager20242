import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaLink } from 'react-icons/fa'; // Importar ícono de link (puedes usar otro ícono si prefieres)
import SearchBar from '../components/ImagenPage/SearchBar';
import ImagenesTable from '../components/ImagenPage/ImagenesTable';
import ErroresTable from '../components/ImagenPage/ErroresTable';
import LecturaTable from '../components/ImagenPage/LecturaTable';
import LecturaTempTable from '../components/ImagenPage/LecturaTempTable';
import './ImagenPage.css';

export default function ImagenPage() {
  const { id_lista } = useParams();
  const [searchTerm, setSearchTerm] = useState(id_lista || '');
  const [erroresData, setErroresData] = useState([]);
  const [imagenesData, setImagenesData] = useState([]);
  const [lecturaData, setLecturaData] = useState([]);
  const [lecturaTempData, setLecturaTempData] = useState([]);
  const [idEval, setIdEval] = useState(null); // Estado para almacenar el id_eval
  const [loadingErrores, setLoadingErrores] = useState(false);
  const [loadingImagenes, setLoadingImagenes] = useState(false);
  const [loadingLectura, setLoadingLectura] = useState(false);
  const [loadingLecturaTemp, setLoadingLecturaTemp] = useState(false);

  useEffect(() => {
    if (id_lista) {
      handleSearch();
    }
  }, [id_lista]);

  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoadingErrores(true);
    setLoadingImagenes(true);
    setLoadingLectura(true);
    setLoadingLecturaTemp(true);

    try {
      const erroresResponse = await axios.get(`http://localhost:3001/api/errores/${searchTerm}`);
      setErroresData(erroresResponse.data);

      const imagenesResponse = await axios.get(`http://localhost:3001/api/imagenes/${searchTerm}`);
      setImagenesData(imagenesResponse.data);

      const lecturaResponse = await axios.get(`http://localhost:3001/api/lectura/${searchTerm}`);
      setLecturaData(lecturaResponse.data);

      const lecturaTempResponse = await axios.get(`http://localhost:3001/api/lectura_temp/${searchTerm}`);
      setLecturaTempData(lecturaTempResponse.data);

      // Llamada a la nueva API para obtener id_eval
      const idEvalResponse = await axios.get(`http://localhost:3001/api/seguimientoimageneval/${searchTerm}`);
      if (idEvalResponse.data && idEvalResponse.data.id_eval) {
        setIdEval(idEvalResponse.data.id_eval); // Almacenar el id_eval
      } else {
        setIdEval(null); // Si no se encuentra id_eval, establecerlo como null
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingErrores(false);
      setLoadingImagenes(false);
      setLoadingLectura(false);
      setLoadingLecturaTemp(false);
    }
  };

  // Función para obtener los valores únicos de id_seccion
  const getIdSeccionTitle = (data) => {
    const uniqueSecciones = [...new Set(data.map(item => item.id_seccion))];
    if (uniqueSecciones.length > 0) {
      return (
        <>
          {/* Mostrar la información en una sola línea */}
          <div className='search-info'>
            <p style={{ marginRight: '10px' }}>Busqueda para: <strong>{searchTerm}</strong></p>
            <p style={{ marginRight: '10px' }}>ID Sección: 
              {uniqueSecciones.map((idSeccion) => (
                <Link
                  key={idSeccion}
                  to={`/secciones/${idSeccion}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: '5px', fontSize: '14px', textDecoration: 'none' }}
                >
                  {idSeccion}
                </Link>
              ))}
            </p>
            {idEval && (
              <p style={{ marginRight: '10px' }}>
                ID Eval: {idEval}
              </p>
            )}
            {idEval && uniqueSecciones.length > 0 && (
              <a
                href={`https://duoccl0-my.sharepoint.com/personal/lgutierrez_duoc_cl/Documents/SUDCRA/informes/2024002/secciones/${idEval}_${uniqueSecciones[0]}.html`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', fontSize: '14px', textDecoration: 'none' }}
              >
                <FaLink style={{ marginRight: '5px' }} />
                Ver Informe
              </a>
            )}
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="page-full">
      <h1>Seguimiento de imágenes</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />

      {/* Mostrar la ID de Sección si hay datos de imágenes */}
      {imagenesData.length > 0 && getIdSeccionTitle(imagenesData)}

      <ImagenesTable imagenesData={imagenesData} loading={loadingImagenes} />
      <LecturaTable lecturaData={lecturaData} loading={loadingLectura} />
      <ErroresTable erroresData={erroresData} loading={loadingErrores} />
      <LecturaTempTable lecturaTempData={lecturaTempData} loading={loadingLecturaTemp} />
    </div>
  );
}
