import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Input, Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons'; // Importamos el ícono de copiar
import axios from 'axios';
import './AlumnoInfo.css'; // Importa la hoja de estilos

// Función para copiar al portapapeles
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    message.success('Copiado al portapapeles');
  }).catch(() => {
    message.error('Error al copiar');
  });
};

const AlumnoInfo = ({ alumnoInfo }) => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [sexo, setSexo] = useState('');
  const [userAlum, setUserAlum] = useState(''); // Estado para user_alum

  useEffect(() => {
    if (alumnoInfo) {
      setNombres(alumnoInfo.nombres);
      setApellidos(alumnoInfo.apellidos);
      setSexo(alumnoInfo.sexo);
      setUserAlum(alumnoInfo.user_alum); // Establecer user_alum cuando alumnoInfo cambie
    }
  }, [alumnoInfo]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put('http://localhost:3001/api/actualizar-alumno', {
        rut: alumnoInfo.rut,
        nombres: nombres || null,
        apellidos: apellidos || null,
        sexo: sexo || null,
        user_alum: userAlum || null, // Pasar user_alum en la solicitud
      });

      // Notificación de éxito
      message.success('Alumno actualizado exitosamente.');

    } catch (error) {
      console.error('Error al actualizar el alumno:', error);

      // Notificación de error
      if (error.response && error.response.status === 404) {
        message.error('No se encontró ningún alumno con el RUT especificado.');
      } else {
        message.error('Error al actualizar el alumno. Intenta nuevamente.');
      }
    }
  };

  if (!alumnoInfo) return null; // Retorna null si no hay información del alumno

  return (
    <div className="alumno-info-container">
      <Typography.Title level={4}>Información del Alumno</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <div className="row">
            <span className="label">RUT:</span>
            <span>{alumnoInfo.rut}</span>
            <CopyOutlined
              style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
              onClick={() => copyToClipboard(alumnoInfo.rut)}
            />
          </div>
          <div className="row">
            <span className="label">Apellidos:</span>
            <Input value={apellidos} onChange={(e) => setApellidos(e.target.value)} className="input" />
            <CopyOutlined
              style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
              onClick={() => copyToClipboard(apellidos)}
            />
          </div>
          <div className="row">
            <span className="label">Nombres:</span>
            <Input value={nombres} onChange={(e) => setNombres(e.target.value)} className="input" />
            <CopyOutlined
              style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
              onClick={() => copyToClipboard(nombres)}
            />
          </div>
          <div className="row">
            <span className="label">Sexo:</span>
            <Input value={sexo} onChange={(e) => setSexo(e.target.value)} className="input" />
            <CopyOutlined
              style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
              onClick={() => copyToClipboard(sexo)}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className="row">
            <span className="label">ID Matrícula:</span>
            <span>{alumnoInfo.id_matricula}</span>
            <CopyOutlined
              style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
              onClick={() => copyToClipboard(alumnoInfo.id_matricula)}
            />
          </div>
          <div className="row">
            <span className="label">Nombre Sede:</span>
            <span>{alumnoInfo.nombre_sede}</span>
            <CopyOutlined
              style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
              onClick={() => copyToClipboard(alumnoInfo.nombre_sede)}
            />
          </div>
          <div className="row">
            <span className="label">User Alum:</span>
            <Input value={userAlum} onChange={(e) => setUserAlum(e.target.value)} className="input" />
            <CopyOutlined
              style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
              onClick={() => copyToClipboard(userAlum)}
            />
          </div>
        </Col>
      </Row>
      <Button type="primary" onClick={handleUpdate}>Actualizar Alumno</Button>
    </div>
  );
};

export default AlumnoInfo;
