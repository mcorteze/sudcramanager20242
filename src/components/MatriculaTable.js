import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Input, Space, Tooltip } from 'antd';
import { FileTextOutlined, SearchOutlined } from '@ant-design/icons';
import { LuUser2, LuMailCheck, LuMailX } from 'react-icons/lu';
import { IoExpand } from 'react-icons/io5';
import axios from 'axios';
import './MatriculaTable.css';
import ModalMailsSeccion from './ModalMailsSeccion';
import ModalMailsAlumno from './ModalMailsAlumno';
import ModalImagenesErrores from './ModalImagenesErrores'; // Importa el nuevo modal

const { Search } = Input;

const MatriculaTable = ({ matriculas, pruebas, asignatura, idSeccion, sedeId, nombreSede, numSeccion, jornada }) => {
  const [filterText, setFilterText] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [mailsEnviados, setMailsEnviados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [alumnoMails, setAlumnoMails] = useState([]);
  const [alumnoModalVisible, setAlumnoModalVisible] = useState(false);
  const [imagenesErrores, setImagenesErrores] = useState([]); // Estado para las imágenes con errores
  const [imagenesModalVisible, setImagenesModalVisible] = useState(false); // Estado para el modal de imágenes con errores
  const [seccionInfo, setSeccionInfo] = useState(null); // Estado para almacenar la información de la sección

  // Contar enlaces activos para cada prueba
  const countActiveLinks = (data, pruebaNum) => {
    return data.filter(entry => entry[`enlace_eval_${pruebaNum}`]).length;
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: 'RUT',
      dataIndex: 'rut',
      key: 'rut',
    },
    {
      title: 'Apellidos',
      dataIndex: 'apellidos',
      key: 'apellidos',
    },
    {
      title: 'Nombres',
      dataIndex: 'nombres',
      key: 'nombres',
    },
    {
      title: 'Usuario Alumno',
      dataIndex: 'user_alum',
      key: 'user_alum',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      align: 'center',
      render: (text, record) => (
        <Space size="middle">
          <LuUser2
            style={{ cursor: 'pointer', color: 'rgb(15, 123, 231)', fontSize: '15px' }}
            onClick={() => window.open(`/rut/${record.rut}`, '_blank')}
          />
          <LuMailCheck
            style={{ cursor: 'pointer', color: 'rgb(77, 194, 116)', fontSize: '16px' }}
            onClick={() => handleMailCheckClick(record.rut)}
          />
        </Space>
      ),
    },
    ...(pruebas || []).map(prueba => {
      const activeLinksCount = countActiveLinks(matriculas, prueba.num_prueba);
      return {
        title: (
          <Tooltip title={prueba.nombre_prueba}>
          <a
            href={`https://duoccl0-my.sharepoint.com/personal/lgutierrez_duoc_cl/Documents/SUDCRA/informes/2024002/secciones/${asignatura}-2024002-${prueba.num_prueba}_${idSeccion}.html`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`E${prueba.num_prueba} (${activeLinksCount})`}
          </a>
        </Tooltip>
        ),
        dataIndex: `enlace_eval_${prueba.num_prueba}`,
        key: `enlace_eval_${prueba.num_prueba}`,
        render: (enlace, record) => (
          <FileTextOutlined
            className={enlace ? 'icon-active' : 'icon-default'}
            onClick={() => {
              if (enlace) {
                const path = `${enlace}`;
                window.open(path, '_blank');
              }
            }}
          />
        ),
      };
    }),
  ];

  const handleMailCheckClick = async (rut) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/mails_alumno/${rut}`);
      setAlumnoMails(response.data || []);
      setAlumnoModalVisible(true);
    } catch (error) {
      console.error('Error al obtener los correos del alumno:', error);
    }
  };

  const handleImagenesErroresClick = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/imagenes-errores/${sedeId}/${asignatura}/${numSeccion}/${jornada}`);
      setImagenesErrores(response.data || []);
      setImagenesModalVisible(true);
    } catch (error) {
      console.error('Error al obtener imágenes con errores:', error);
    }
  };

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/mails_seccion/${idSeccion}`);
        setMailsEnviados(response.data || []);
        setModalVisible(true);
      } catch (error) {
        console.error('Error al obtener los correos:', error);
      }
    };

    if (idSeccion && modalVisible) {
      fetchEmails();
    }
  }, [idSeccion, modalVisible]);

  // Fetch seccion info
  useEffect(() => {
    const fetchSeccionInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/seccion/${idSeccion}`);
        setSeccionInfo(response.data[0] || null); // Asume que la respuesta es un array con al menos un objeto
      } catch (error) {
        console.error('Error al obtener la información de la sección:', error);
      }
    };

    if (idSeccion) {
      fetchSeccionInfo();
    }
  }, [idSeccion]);

  const handleSearch = value => {
    setFilterText(value.toLowerCase());
    const filteredData = matriculas.filter(entry =>
      Object.values(entry).some(val =>
        typeof val === 'string' ? val.toLowerCase().includes(value.toLowerCase()) : false
      )
    );
    setFilteredDataSource(filteredData);
    setShowAll(false);
  };

  const dataSource = showAll ? matriculas : filterText ? filteredDataSource : matriculas;

  const showModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeAlumnoModal = () => {
    setAlumnoModalVisible(false);
  };

  const closeImagenesModal = () => {
    setImagenesModalVisible(false);
  };

  return (
    <div className='matricula-table-container'>
      <Search
        placeholder="Buscar..."
        allowClear
        enterButton={<SearchOutlined />}
        value={filterText}
        onChange={e => handleSearch(e.target.value)}
        onSearch={value => handleSearch(value)}
        style={{ marginBottom: 10, width: 200 }}
      />
      <Button type="primary" onClick={() => setShowAll(true)} style={{ marginBottom: 10, marginLeft: 10 }}>
        <IoExpand />
        Expandir tabla
      </Button>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 10, marginLeft: 10 }}>
        <LuMailCheck />
        Mails sección (success)
      </Button>
      <Button type="primary" onClick={handleImagenesErroresClick} style={{ marginBottom: 10, marginLeft: 10 }}>
        <LuMailX />
        Mails sección (error hojas de lectura)
      </Button>
      <p>
          ID sección: 
          <a 
            href={`/secciones/${idSeccion}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ textDecoration: 'none', color: 'blue' }}
          >
            {idSeccion}
          </a> 
          | Asignatura: {asignatura} | Docente : 
          {seccionInfo ? 
            `${seccionInfo.nombre_doc} ${seccionInfo.apellidos_doc} | RUT: ${seccionInfo.rut_docente} | mail: ${seccionInfo.mail_doc}` 
            : 'Cargando...'}
      </p>
      <Table dataSource={dataSource} columns={columns} rowKey="id_matricula" pagination={showAll ? false : {}} />
      <ModalMailsSeccion 
        visible={modalVisible}
        mailsEnviados={mailsEnviados}
        closeModal={closeModal}
      />
      <ModalMailsAlumno 
        visible={alumnoModalVisible}
        mailsEnviados={alumnoMails}
        closeModal={closeAlumnoModal}
      />
      <ModalImagenesErrores 
        visible={imagenesModalVisible}
        data={imagenesErrores}
        closeModal={closeImagenesModal}
      />
    </div>
  );
};

export default MatriculaTable;
