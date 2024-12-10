import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Input, Button, Typography, Form, Row, Col, Drawer, Select, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import './RutAlumno.css';

const { Option } = Select;

export default function RutAlumno() {
  const [rut, setRut] = useState('');
  const [alumnoInfo, setAlumnoInfo] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState(null);
  const [inscripciones, setInscripciones] = useState([]);
  const [form] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [inscripcionDetails, setInscripcionDetails] = useState(null);
  const [calificaciones, setCalificaciones] = useState([]);
  const [calificacionesDrawerVisible, setCalificacionesDrawerVisible] = useState(false);
  const [calificacionesData, setCalificacionesData] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Estados para los comboboxes
  const [programas, setProgramas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [selectedPrograma, setSelectedPrograma] = useState(null);
  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedAsignatura, setSelectedAsignatura] = useState(null); 
  const [selectedSeccionId, setSelectedSeccionId] = useState(null); 
  const [idMatricula, setIdMatricula] = useState(null);
  const [idInscripcion, setIdInscripcion] = useState(null); 

  const [nuevoIdMatricula, setNuevoIdMatricula] = useState(null);
  const [nuevoIdSeccion, setNuevoIdSeccion] = useState(null);


  const { rut: rutParam } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (rutParam) {
      setRut(rutParam);
      fetchData(rutParam);
    }

    // Cargar programas y sedes al montar el componente
    fetchProgramas();
    fetchSedes();
  }, [rutParam]);

  const fetchProgramas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/programas');
      setProgramas(response.data);
    } catch (err) {
      console.error('Error al obtener programas:', err);
      setError('Error al obtener programas del servidor');
    }
  };

  const fetchSedes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/sedes');
      setSedes(response.data);
    } catch (err) {
      console.error('Error al obtener sedes:', err);
      setError('Error al obtener sedes del servidor');
    }
  };

  const fetchAsignaturas = async (cod_programa) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/asignaturas/${cod_programa}`);
      setAsignaturas(response.data);
    } catch (err) {
      console.error('Error al obtener asignaturas:', err);
      setError('Error al obtener asignaturas del servidor');
    }
  };

  const fetchSecciones = async (cod_asig, id_sede) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/secciones/${cod_asig}/${id_sede}`);
      setSecciones(response.data);
    } catch (err) {
      console.error('Error al obtener secciones:', err);
      setError('Error al obtener secciones del servidor');
    }
  };

  const handleInputChange = (event) => {
    setRut(event.target.value);
  };

  const handleFinish = () => {
    if (rut) {
      navigate(`/rut/${rut}`);
    }
  };

  const fetchData = async (rut) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/alumnos/${rut}`);
      const data = response.data;

      if (data.length > 0) {
        setAlumnoInfo({
          id_matricula: data[0].id_matricula,
          nombre_sede: data[0].nombre_sede,
          rut: data[0].rut,
          nombres: data[0].nombres,
          apellidos: data[0].apellidos,
          user_alum: data[0].user_alum,
          sexo: data[0].sexo
        });
        setAlumnos(data);
        fetchInscripciones(data[0].id_matricula);
        setIdMatricula(data[0].id_matricula); // Almacena el ID de matrícula
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

  const columnsInscripciones = [
    { title: 'ID Inscripción', dataIndex: 'id_inscripcion', key: 'id_inscripcion' },
    { title: 'ID Matricula', dataIndex: 'id_matricula', key: 'id_matricula' },
    { title: 'ID Sección', dataIndex: 'id_seccion', key: 'id_seccion' },
    { title: 'Sede', dataIndex: 'nombre_sede', key: 'nombre_sede' },
    { title: 'Código Asignatura', dataIndex: 'cod_asig', key: 'cod_asig' },
    { title: 'Sección', dataIndex: 'seccion', key: 'seccion' },
  ];

  const handleInscripcionClick = (record) => {
    setInscripcionDetails(record);
    setIdInscripcion(record.id_inscripcion); // Almacena el ID de inscripción
    setSelectedSede(record.id_sede); // Establece el ID de sede
    setSelectedAsignatura(record.cod_asig); // Establece el código de asignatura
    setDrawerVisible(true);
    fetchSecciones(record.cod_asig, record.id_sede); // Obtiene las secciones relacionadas
  };

  const formatDate = (date) => moment(date).format('HH:mm:ss - DD/MM/YYYY');

  const columns = [
    { title: 'ID Sección', dataIndex: 'id_seccion', key: 'id_seccion' },
    { title: 'Sección', dataIndex: 'seccion', key: 'seccion' },
    { title: 'Asignatura', dataIndex: 'asig', key: 'asig' },
    { title: 'RUT Docente', dataIndex: 'rut_docente', key: 'rut_docente' },
    { title: 'Nombre Docente', dataIndex: 'nombre_doc', key: 'nombre_doc' },
    { title: 'Apellidos Docente', dataIndex: 'apellidos_doc', key: 'apellidos_doc' },
    {
      title: 'Lectura Fecha',
      dataIndex: 'lectura_fecha',
      key: 'lectura_fecha',
      render: (text) => formatDate(text),
    },
    { title: 'Número de Prueba', dataIndex: 'num_prueba', key: 'num_prueba' },
    {
      title: 'Informe Listo',
      dataIndex: 'informe_listo',
      key: 'informe_listo',
      render: (informe_listo) => (
        <span style={{ color: informe_listo ? 'rgb(99, 173, 247)' : 'grey' }}>
          {informe_listo ? 'Listo' : 'No listo'}
        </span>
      ),
    },
  ];

  const calificacionesColumns = [
    { title: 'ID MEI', dataIndex: 'id_mei', key: 'id_mei' },
    { title: 'ID Matrícula Eval', dataIndex: 'id_matricula_eval', key: 'id_matricula_eval' },
    { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
    { title: 'Nombre Asignatura', dataIndex: 'nombre_asignatura', key: 'nombre_asignatura' },
    { title: 'Nota', dataIndex: 'nota', key: 'nota' },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Comentario', dataIndex: 'comentario', key: 'comentario' },
  ];

  const handleCalificacionesClick = (record) => {
    setCalificacionesData(record);
    setCalificacionesDrawerVisible(true);
  };

  // Función para manejar el cambio de sección {selectedSeccionId} {idMatricula} {idInscripcion}
  const handleChangeSection = async () => {
    if (!idMatricula || !selectedSeccionId || !idInscripcion) {
        message.error('Por favor, completa todos los campos necesarios.');
        return;
    }

    alert('Nuevo ID de Matrícula:', idMatricula);
    alert('Nuevo ID de Sección:', selectedSeccionId);
    alert('ID de Inscripción:', idInscripcion);
  
    // Generar el nuevo id_inscripcion como la concatenación de nuevoIdMatricula y nuevoIdSeccion
    const nuevoIdInscripcion = `${nuevoIdMatricula}-${nuevoIdSeccion}`;
  
    try {
        const response = await axios.put('http://localhost:3001/api/agregarinscripcion', {
            id_inscripcion: idInscripcion,          // Enviar el id de la inscripción actual
            nuevo_id_inscripcion: nuevoIdInscripcion, // El nuevo id_inscripcion generado
            id_matricula: nuevoIdMatricula,          // Nuevo id_matricula
            nuevo_id_seccion: nuevoIdSeccion         // Nuevo id_seccion
        });
  
        message.success(response.data.message);
        fetchInscripciones(nuevoIdMatricula); // Recarga las inscripciones para ver los cambios
    } catch (error) {
        message.error('Error al cambiar de sección: ' + (error.response?.data?.error || error.message));
    }
  };
  

  return (
    <div>
      <Form form={form} layout="inline" onFinish={handleFinish}>
        <Form.Item>
          <Input
            placeholder="RUT"
            value={rut}
            onChange={handleInputChange}
            style={{ width: '200px' }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Buscar
          </Button>
        </Form.Item>
      </Form>

      {error && <Typography.Text type="danger">{error}</Typography.Text>}

      {alumnoInfo && (
        <div>
          <Typography.Title level={4}>Información del Alumno</Typography.Title>
          <Row>
            <Col span={12}>
              <p><strong>RUT:</strong> {alumnoInfo.rut}</p>
              <p><strong>Apellidos:</strong> {alumnoInfo.apellidos}</p>
              <p><strong>Nombres:</strong> {alumnoInfo.nombres}</p>
              <p><strong>Sexo:</strong> {alumnoInfo.sexo}</p>
            </Col>
            <Col span={12}>
              <p><strong>ID Matrícula:</strong> {alumnoInfo.id_matricula}</p>
              <p><strong>Nombre Sede:</strong> {alumnoInfo.nombre_sede}</p>
              <p><strong>User Alum:</strong> {alumnoInfo.user_alum}</p>
            </Col>
          </Row>
        </div>
      )}

      {inscripciones.length > 0 && (
        <div style={{ margin: '20px 0px' }}>
          <Typography.Title level={4}>Inscripciones</Typography.Title>
          <Table
            columns={columnsInscripciones}
            dataSource={inscripciones}
            rowKey="id_inscripcion"
            pagination={false}
          />
        </div>
      )}

      {alumnos.length > 0 && (
        <div style={{ margin: '20px 0px' }}>
          <Typography.Title level={4}>Evaluaciones procesadas</Typography.Title>
          <Table
            columns={columns}
            dataSource={alumnos}
            className="custom-table"
            rowKey="id_calificacion"
            pagination={false}
          />
        </div>
      )}

      <Drawer
        title="Buscar id sección"
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={640}
      >
        <Form layout="vertical">
          <Form.Item label="Seleccionar Programa">
            <Select
              onChange={(value) => {
                setSelectedPrograma(value);
                fetchAsignaturas(value); // Llama a la función de asignaturas
              }}
              value={selectedPrograma} // Asegúrate de que el valor se mantenga
            >
              {programas.map(programa => (
                <Option key={programa.cod_programa} value={programa.cod_programa}>
                  {programa.programa}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Seleccionar Sede">
            <Select
              onChange={(value) => {
                setSelectedSede(value);
                fetchSecciones(selectedAsignatura, value); // Llama a la función de secciones
              }}
              value={selectedSede} // Asegúrate de que el valor se mantenga
            >
              {sedes.map(sede => (
                <Option key={sede.id_sede} value={sede.id_sede}>
                  {sede.nombre_sede}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Seleccionar Asignatura">
            <Select
              onChange={(value) => {
                setSelectedAsignatura(value); // Agrega este estado
                fetchSecciones(value, selectedSede); // Asegúrate de pasar el valor de la sede
              }}
              value={selectedAsignatura} // Asegúrate de que el valor se mantenga
            >
              {asignaturas.map(asignatura => (
                <Option key={asignatura.cod_asig} value={asignatura.cod_asig}>
                  {asignatura.cod_asig}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Seleccionar Sección">
            <Select
              onChange={(value) => {
                setSelectedSeccionId(value); // Establece el ID de la sección seleccionada
              }}
            >
              {secciones.map(seccion => (
                <Option key={seccion.id_seccion} value={seccion.id_seccion}>
                  {seccion.seccion}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        {selectedSeccionId && idMatricula && idInscripcion && ( // Muestra el ID de la sección, matrícula e inscripción seleccionada 
          <div>
            <Typography.Text>
              ID de la sección seleccionada: {selectedSeccionId}
            </Typography.Text>
            <br />
            <Typography.Text>
              ID de matrícula: {idMatricula}
            </Typography.Text>
            <br />
            <Typography.Text>
              ID de inscripción: {idInscripcion}
            </Typography.Text>
          </div>
        )}
          <Button type='primary' onClick={handleChangeSection}>
            Cambiar de sección
          </Button>
      </Drawer>
    </div>
  );
}
