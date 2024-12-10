import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Drawer, Select, Modal, message, Tooltip } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FolderOpenOutlined, UserSwitchOutlined, TeamOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const BuscarDocente = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const [docentes, setDocentes] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [addDrawerVisible, setAddDrawerVisible] = useState(false); // Nuevo estado para el segundo Drawer
  const [programas, setProgramas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [secciones, setSecciones] = useState([]);
  
  // Estados para el primer Drawer
  const [selectedDocenteRutAdd, setSelectedDocenteRutAdd] = useState(null);
  const [selectedPrograma, setSelectedPrograma] = useState(null);
  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedAsignatura, setSelectedAsignatura] = useState(null);
  const [selectedSeccion, setSelectedSeccion] = useState(null);
  const [selectedSeccionValue, setSelectedSeccionValue] = useState(null);
  
  // Estados para el segundo Drawer (independientes)
  const [selectedProgramaAdd, setSelectedProgramaAdd] = useState(null);
  const [selectedSedeAdd, setSelectedSedeAdd] = useState(null);
  const [selectedAsignaturaAdd, setSelectedAsignaturaAdd] = useState(null);
  const [selectedSeccionAdd, setSelectedSeccionAdd] = useState(null);
  const [selectedSeccionDataAdd, setSelectedSeccionDataAdd] = useState(null); // Estado que extiende la informacion de la seccion seleccionada
  const [selectedSeccionValueAdd, setSelectedSeccionValueAdd] = useState(null);
  
  const [docentesSeccionData, setDocentesSeccionData] = useState(null);  // Para almacenar los datos de idsecciondocentes

  const [currentDocente, setCurrentDocente] = useState(null);
  const [selectedRutDocente, setSelectedRutDocente] = useState(null);
  const [selectedDocenteRut, setSelectedDocenteRut] = useState(null);
  const [selectedDocenteNombre, setSelectedDocenteNombre] = useState(null);

  useEffect(() => {
    if (keyword) {
      fetchDocentes(keyword);
    }
    fetchProgramas();
    fetchSedes();
  }, [keyword]);

  const fetchDocentes = async (searchKeyword) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/buscar-docente/${searchKeyword}`);
      setDocentes(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setDocentes([]);
    }
  };

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
      setSedes(response.data);
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

  const fetchSecciones = async (cod_asig, id_sede) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/secciones/${cod_asig}/${id_sede}`);
      setSecciones(response.data);
    } catch (error) {
      console.error('Error fetching secciones:', error);
    }
  };

  const fetchDocenteInfo = async (rut_docente) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/buscar-docente/${rut_docente}`);
      if (response.data.length > 0) {
        setCurrentDocente(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching docente info:', error);
    }
  };

  const fetchDocentesSeccionData = async (idSeccion) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/docentes_secciones/${idSeccion}`);
      if (response.data) {
        setDocentesSeccionData(response.data);  // Guardamos los datos de los docentes en el estado
      }
    } catch (error) {
      console.error('Error al obtener los docentes de la sección:', error);
    }
  };
  
  useEffect(() => {
    if (selectedSeccionDataAdd?.id_seccion) {  // Verificamos que el id_seccion esté disponible
      fetchDocentesSeccionData(selectedSeccionDataAdd.id_seccion);  // Llamamos a la función para obtener los docentes
    }
  }, [selectedSeccionDataAdd?.id_seccion]);  // Se ejecuta cuando cambia el id_seccion
  
  {/* --------------------- */}
  {/* Manejos primer dawner */}
  {/* --------------------- */}

  const handleProgramaChange = (value) => {
    setSelectedPrograma(value);
    fetchAsignaturas(value);
  };

  const handleSedeChange = (value) => {
    setSelectedSede(value);
    if (selectedAsignatura) {
      fetchSecciones(selectedAsignatura, value);
    }
  };

  const handleAsignaturaChange = (value) => {
    setSelectedAsignatura(value);
    if (selectedSede) {
      fetchSecciones(value, selectedSede);
    }
  };

  const handleSeccionChange = (value, option) => {
    setSelectedSeccion(value);
    setSelectedSeccionValue(option.children);
    const seccion = secciones.find(sec => sec.id_seccion === value);
    if (seccion) {
      setSelectedRutDocente(seccion.rut_docente);
      fetchDocenteInfo(seccion.rut_docente);
    }
  };

  {/* ---------------------- */}
  {/* Manejos segundo dawner */}
  {/* ---------------------- */}

  const handleProgramaChangeAdd = (value) => {
    setSelectedProgramaAdd(value);
    fetchAsignaturas(value);
  };

  const handleSedeChangeAdd = (value) => {
    setSelectedSedeAdd(value);
    if (selectedAsignaturaAdd) {
      fetchSecciones(selectedAsignaturaAdd, value);
    }
  };

  const handleAsignaturaChangeAdd = (value) => {
    setSelectedAsignaturaAdd(value);
    if (selectedSedeAdd) {
      fetchSecciones(value, selectedSedeAdd);
    }
  };

  const handleSeccionChangeAdd = (value, option) => {
    setSelectedSeccionAdd(value);
    setSelectedSeccionValueAdd(option.children);
    
    // Buscar la sección completa
    const seccion = secciones.find(sec => sec.id_seccion === value);
    if (seccion) {
        setSelectedSeccionDataAdd(seccion);
    }
    console.log('ID de la sección seleccionada (Añadir Docente):', value);
};


  {/* ---------------------- */}

  const onSearch = (value) => {
    navigate(`/buscar-docente/${value}`);
  };

  const showDrawer = (rut_docente, nombre_docente) => {
    setSelectedDocenteRut(rut_docente);
    setSelectedDocenteNombre(nombre_docente);
    setDrawerVisible(true);
  };

  const showAddDrawer = (rut_docente) => {
    setSelectedDocenteRutAdd(rut_docente); // Correcto RUT seleccionado
    setAddDrawerVisible(true);
  };
  

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const closeAddDrawer = () => { // Función para cerrar el segundo Drawer
    setAddDrawerVisible(false);
  };

  const handleCargaAcademica = (record) => {
    window.open(`/carga-docente/${record.rut_docente}`, '_blank');
  };

  // Función para reemplazar al docente
  const handleReemplazarDocente = async () => {
    try {
      const response = await axios.put('http://localhost:3001/api/reemplazar-docente', {
        rutNuevoDocente: selectedDocenteRut,
        idSede: selectedSede,
        seccion: selectedSeccionValue
      });

      console.log(response.data.message);
      message.success('Docente reemplazado con éxito');
      closeDrawer();
    } catch (error) {
      console.error('Error al reemplazar docente:', error);
      message.error('Error al reemplazar docente');
    }
  };

  const confirmReemplazo = () => {
    Modal.confirm({
      title: 'Confirmar Reemplazo',
      content: `¿Está seguro de que desea reemplazar al docente con RUT ${currentDocente.rut_docente} por el docente con RUT ${selectedDocenteRut}?`,
      onOk: handleReemplazarDocente
    });
  };

  // Función para agregar el docente a la sección
  const handleAgregarDocenteSeccion = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/agregar-docente-seccion', {
        idSeccion: selectedSeccionAdd,
        rutDocente: selectedDocenteRutAdd,
      });

      // Muestra un mensaje de éxito
      message.success(response.data.message);
    } catch (error) {
      console.error('Error al agregar el docente a la sección:', error);
      message.error('Error al agregar el docente a la sección');
    }
  };

  // Confirmación antes de llamar la API
  const confirmAgregarDocente = () => {
    if (!selectedDocenteRutAdd || !selectedSeccionAdd) {
      message.warning('Por favor, seleccione un docente y una sección.');
      return;
    }
  
    Modal.confirm({
      title: 'Confirmar Adición de Docente',
      content: `¿Está seguro de que desea agregar al docente con RUT ${selectedDocenteRutAdd} a la sección ${selectedSeccionValueAdd}?`,
      onOk: handleAgregarDocenteSeccion,
    });
  };
  

  const columns = [
    {
      title: 'Sede',
      dataIndex: 'nombre_sede',
      key: 'nombre_sede',
    },
    {
      title: 'RUT',
      dataIndex: 'rut_docente',
      key: 'rut_docente',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre_doc',
      key: 'nombre_doc',
    },
    {
      title: 'Apellidos',
      dataIndex: 'apellidos_doc',
      key: 'apellidos_doc',
    },
    {
      title: 'Username',
      dataIndex: 'username_doc',
      key: 'username_doc',
    },
    {
      title: 'Correo',
      dataIndex: 'mail_doc',
      key: 'mail_doc',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <>
          <Tooltip title="Carga Académica"> 
            <Button
              icon={<FolderOpenOutlined className="icon-tamano1" />}
              onClick={() => handleCargaAcademica(record)}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          <Tooltip title="Cambiar Titular"> 
            <Button
              icon={<UserSwitchOutlined className="icon-tamano1" />}
              onClick={() => showDrawer(record.rut_docente, `${record.nombre_doc} ${record.apellidos_doc}`)}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          <Tooltip title="Añadir Docente"> 
            <Button
              icon={<TeamOutlined className="icon-tamano1" />}
              onClick={() => showAddDrawer(record.rut_docente)} // Cambia esto para abrir el segundo drawer
              style={{ marginRight: 8 }}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div className='page-full'>
      <h1>Buscar docente</h1>
      <Search
        placeholder="Ingrese una palabra clave"
        allowClear
        enterButton="Buscar"
        size="large"
        onSearch={onSearch}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Table
        dataSource={docentes}
        columns={columns}
        rowKey={(record) => record.rut_docente}
        pagination={{ pageSize: 10 }}
      />

      {/* ------------------------------------- */}
      {/* Primer Drawer para añadir un docente */}
      {/* ------------------------------------- */}
      <Drawer
        title="Asignar Sección"
        placement="right"
        onClose={closeDrawer}
        visible={drawerVisible}
      >
        <Select
          placeholder="Seleccione un programa"
          onChange={handleProgramaChange}
          style={{ width: '100%', marginBottom: 16 }}
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
          style={{ width: '100%', marginBottom: 16 }}
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
          style={{ width: '100%', marginBottom: 16 }}
        >
          {asignaturas.map(asignatura => (
            <Option key={asignatura.cod_asig} value={asignatura.cod_asig}>
              {asignatura.cod_asig}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Seleccione una sección"
          onChange={handleSeccionChange}
          style={{ width: '100%', marginBottom: 16 }}
        >
          {secciones.map(seccion => (
            <Option key={seccion.id_seccion} value={seccion.id_seccion}>
              {seccion.seccion}
            </Option>
          ))}
        </Select>
        {currentDocente && (
          <div>
            <hr />
            <b>TITULAR</b>
            <p>Nombre: {currentDocente.nombre_doc} {currentDocente.apellidos_doc}</p>
            <p>RUT: {currentDocente.rut_docente}</p>
          </div>
        )}
        {selectedDocenteRut && (
          <div>
            <hr />
            <b>REEMPLAZAR POR</b>
            <p>{selectedDocenteNombre}</p>
            <p>RUT: {selectedDocenteRut}</p>
            <hr />
            <Button
              type="primary"
              onClick={confirmReemplazo}
              disabled={!currentDocente}
              style={{ marginTop: 16, background: 'red' }}
            >
              Reemplazar Docente
            </Button>
          </div>
        )}
      </Drawer>

      {/* ------------------------------------- */}
      {/* Segundo Drawer para añadir un docente */}
      {/* ------------------------------------- */}
      <Drawer
        title="Añadir Docente"
        placement="right"
        onClose={closeAddDrawer}
        visible={addDrawerVisible} // Usar el nuevo estado para la visibilidad
      >
        <Select
          placeholder="Seleccione un programa"
          onChange={handleProgramaChangeAdd}
          style={{ width: '100%', marginBottom: 16 }}
        >
          {programas.map(programa => (
            <Option key={programa.cod_programa} value={programa.cod_programa}>
              {programa.programa}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Seleccione una sede"
          onChange={handleSedeChangeAdd}
          style={{ width: '100%', marginBottom: 16 }}
        >
          {sedes.map(sede => (
            <Option key={sede.id_sede} value={sede.id_sede}>
              {sede.nombre_sede}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Seleccione una asignatura"
          onChange={handleAsignaturaChangeAdd}
          style={{ width: '100%', marginBottom: 16 }}
        >
          {asignaturas.map(asignatura => (
            <Option key={asignatura.cod_asig} value={asignatura.cod_asig}>
              {asignatura.cod_asig}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Seleccione una sección"
          onChange={handleSeccionChangeAdd}
          style={{ width: '100%', marginBottom: 16 }}
        >
          {secciones.map(seccion => (
            <Option key={seccion.id_seccion} value={seccion.id_seccion}>
              {seccion.seccion}
            </Option>
          ))}
        </Select>
        {selectedSeccionDataAdd && (
        <div>
          <hr />
          <p><b>Id sección:</b> {selectedSeccionDataAdd.id_seccion}</p>
          <p><b>Sección:</b> {selectedSeccionDataAdd.seccion}</p>
          <p><b>RUT docente titular:</b> {selectedSeccionDataAdd.rut_docente || 'No asignado'}</p>
          <p><b>Nombre docente titular:</b> {selectedSeccionDataAdd.nombre_doc} {selectedSeccionDataAdd.apellidos_doc || ''}</p>
          <hr />
          {/* Aquí mostramos los datos de los docentes asociados a la sección */}
          {docentesSeccionData && (
            <div>
              <p><b>Lista de docentes asociados a la sección:</b></p>
              {docentesSeccionData.map((docente, index) => (
                <div key={index}>
                  <p>{docente.nombre_doc} {docente.apellidos_doc}</p>
                </div>
              ))}
            </div>
          )}
          <hr />
          <p><b>Agregando docente con RUT:</b> {selectedDocenteRutAdd || 'Seleccione un docente'}</p>
          
          <Button
            type="primary"
            onClick={confirmAgregarDocente}
            style={{ marginTop: 16 }}
          >
            Agregar Docente
          </Button>
        </div>
      )}
      </Drawer>
    </div>
  );
};

export default BuscarDocente;
