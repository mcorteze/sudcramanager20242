import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import './ImagenPage.css';

export default function ImagenPage() {
  const { id_lista } = useParams(); // Obtiene id_lista desde la URL
  const [searchTerm, setSearchTerm] = useState(id_lista || ''); // Usa id_lista como valor inicial de búsqueda
  const [erroresData, setErroresData] = useState([]);
  const [imagenesData, setImagenesData] = useState([]);
  const [lecturaData, setLecturaData] = useState([]);
  const [lecturaTempData, setLecturaTempData] = useState([]); // Nuevo estado para lectura_temp
  const [loadingErrores, setLoadingErrores] = useState(false);
  const [loadingImagenes, setLoadingImagenes] = useState(false);
  const [loadingLectura, setLoadingLectura] = useState(false);
  const [loadingLecturaTemp, setLoadingLecturaTemp] = useState(false); // Nuevo loading para lectura_temp

  useEffect(() => {
    if (id_lista) {
      handleSearch(); // Llama a la búsqueda automáticamente si id_lista está disponible
    }
  }, [id_lista]);

  // Función para manejar la búsqueda
  const handleSearch = async () => {
    if (!searchTerm) {
      return;
    }

    setLoadingErrores(true);
    setLoadingImagenes(true);
    setLoadingLectura(true);
    setLoadingLecturaTemp(true); // Inicia el loading para lectura_temp

    try {
      // Consulta para obtener errores
      const erroresResponse = await axios.get(`http://localhost:3001/api/errores/${searchTerm}`);
      setErroresData(erroresResponse.data);

      // Consulta para obtener imágenes
      const imagenesResponse = await axios.get(`http://localhost:3001/api/imagenes/${searchTerm}`);
      setImagenesData(imagenesResponse.data);

      // Consulta para obtener lecturas
      const lecturaResponse = await axios.get(`http://localhost:3001/api/lectura/${searchTerm}`);
      setLecturaData(lecturaResponse.data);

      // Nueva consulta para obtener lectura_temp
      const lecturaTempResponse = await axios.get(`http://localhost:3001/api/lectura_temp/${searchTerm}`);
      setLecturaTempData(lecturaTempResponse.data); // Almacena los datos en el estado
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingErrores(false);
      setLoadingImagenes(false);
      setLoadingLectura(false);
      setLoadingLecturaTemp(false); // Finaliza el loading para lectura_temp
    }
  };

  // Función para contar los valores únicos en un array para una columna específica
  const countUnique = (data, key) => {
    return [...new Set(data.map(item => item[key]))].length;
  };

    // Definir las columnas para la tabla de imágenes
    const imagenesColumns = [
      { title: 'ID Sección', dataIndex: 'id_seccion', key: 'id_seccion' },
      { title: 'ID Lista', dataIndex: 'id_lista', key: 'id_lista' },
      { title: 'ID Imagen', dataIndex: 'id_imagen', key: 'id_imagen' },
      { title: 'Imagen', dataIndex: 'imagen', key: 'imagen' },
      { 
        title: 'URL Imagen', 
        dataIndex: 'url_imagen', 
        key: 'url_imagen',
        render: (text) => (
          <a 
            href={text} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            {text}
          </a>
        ),
      },
    ];
    
  // Definir las columnas para la tabla de lecturas
  const lecturaColumns = [
    { title: 'ID Lectura', dataIndex: 'id_lectura', key: 'id_lectura' },
    { title: 'Imagen', dataIndex: 'imagen', key: 'imagen' },
    { title: 'Instante Forms', dataIndex: 'instante_forms', key: 'instante_forms' },
    { title: 'RUT', dataIndex: 'rut', key: 'rut' },
    { title: 'ID_MATRICULA_EVAL', dataIndex: 'id_matricula_eval', key: 'id_matricula_eval' },
    { title: 'LOGRO OBTENIDO', dataIndex: 'logro_obtenido', key: 'logro_obtenido' },
    { title: 'Num Prueba', dataIndex: 'num_prueba', key: 'num_prueba' },
    { title: 'Reproceso', dataIndex: 'reproceso', key: 'reproceso', render: (text) => text ? 'Sí' : 'No'  },
  ];

  // Definir las columnas para la tabla de errores
  const erroresColumns = [
    { title: 'ID Error', dataIndex: 'id_error', key: 'id_error' },
    { title: 'RUT', dataIndex: 'rut', key: 'rut' },
    { title: 'Num Prueba', dataIndex: 'num_prueba', key: 'num_prueba' },
    { title: 'Cod Interno', dataIndex: 'cod_interno', key: 'cod_interno' },
    { title: 'ID Archivo Leído', dataIndex: 'id_archivoleido', key: 'id_archivoleido' },
    { title: 'Imagen', dataIndex: 'imagen', key: 'imagen' },
    { title: 'Instante Forms', dataIndex: 'instante_forms', key: 'instante_forms' },
    { title: 'Valida RUT', dataIndex: 'valida_rut', key: 'valida_rut', render: (text) => text ? 'Sí' : 'No'  },
    { title: 'Valida Matricula', dataIndex: 'valida_matricula', key: 'valida_matricula', render: (text) => text ? 'Sí' : 'No'  },
    { title: 'Valida Inscripcion', dataIndex: 'valida_inscripcion', key: 'valida_inscripcion', render: (text) => text ? 'Sí' : 'No'  },
    { title: 'Valida Eval', dataIndex: 'valida_eval', key: 'valida_eval', render: (text) => text ? 'Sí' : 'No'  },
    { title: 'Valida Forma', dataIndex: 'valida_forma', key: 'valida_forma', render: (text) => text ? 'Sí' : 'No'  },
    { title: 'Mail Enviado', dataIndex: 'mail_enviado', key: 'mail_enviado', render: (text) => text ? 'Sí' : 'No'  },
    { 
      title: 'Marca temporal mail', 
      dataIndex: 'marca_temp_mail', 
      key: 'marca_temp_mail',
      render: (marca_temp_mail) => moment(marca_temp_mail).format('HH:mm:ss - YYYY-MM-DD'),
    },
  ];

  // Definir las columnas para la tabla de lectura_temp
  const lecturaTempColumns = [
    { title: 'ID Lectura', dataIndex: 'id_lectura', key: 'id_lectura' },
    { title: 'RUT', dataIndex: 'rut', key: 'rut' },
    { title: 'ID Archivo Leído', dataIndex: 'id_archivoleido', key: 'id_archivoleido' },
    { title: 'Imagen', dataIndex: 'imagen', key: 'imagen' },
    { title: 'Instante Forms', dataIndex: 'instante_forms', key: 'instante_forms' },
  ];

  // Función para obtener los valores únicos de id_seccion
  const getIdSeccionTitle = (data) => {
    const uniqueSecciones = [...new Set(data.map(item => item.id_seccion))];
    if (uniqueSecciones.length > 0) {
      return (
        <>
          Registros en tabla Imágenes - ID Sección:{' '}
          {uniqueSecciones.map((id) => (
            <Link
              key={id}
              to={`/secciones/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginRight: '8px', fontSize: '14px', textDecoration: 'none' }}
            >
              {id}
            </Link>
          ))}
        </>
      );
    }
    return 'Registros en tabla Imágenes';
  };
  
  


  return (
    <div className="page-full">
      <h1>Seguimiento de imágenes</h1>

      {/* Campo de búsqueda */}
      <Input
        placeholder="Ingrese el número de la imagen"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: 300, marginRight: 10 }}
      />
      <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
        Buscar
      </Button>

      
      {/* Mostrar recuento de ID Imagen para la tabla de imágenes */}
      <h2>{getIdSeccionTitle(imagenesData)}</h2>
      <p style={{ color: 'red' }}><strong>ID Imagen presentes: {countUnique(imagenesData, 'id_imagen')}</strong></p>
      <Table
        columns={imagenesColumns}
        dataSource={imagenesData}
        loading={loadingImagenes}
        rowKey="id_imagen"
        pagination={{ pageSize: 10 }}
      />

      {/* Mostrar recuento de RUT para la tabla de lecturas */}
      <h2>Imágenes con calificación</h2>
      <p style={{ color: 'red' }}><strong>RUT presentes: {countUnique(lecturaData, 'rut')}</strong></p>
      <Table
        columns={lecturaColumns}
        dataSource={lecturaData}
        loading={loadingLectura}
        rowKey="id_lectura"
        pagination={{ pageSize: 10 }}
      />

      {/* Mostrar recuento de RUT para la tabla de errores */}
      <h2>Registros en tabla Errores</h2>
      <p style={{ color: 'red' }}><strong>RUT presentes: {countUnique(erroresData, 'rut')}</strong></p>
      <Table
        columns={erroresColumns}
        dataSource={erroresData}
        loading={loadingErrores}
        rowKey="id_error"
        pagination={{ pageSize: 10 }}
      />

      {/* Mostrar recuento de RUT para la tabla de lectura_temp */}
      <h2>Registros en tabla Lectura Temporal</h2>
      <p style={{ color: 'red' }}><strong>RUT presentes: {countUnique(lecturaTempData, 'rut')}</strong></p>
      <Table
        columns={lecturaTempColumns}
        dataSource={lecturaTempData}
        loading={loadingLecturaTemp}
        rowKey="id_lectura"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
