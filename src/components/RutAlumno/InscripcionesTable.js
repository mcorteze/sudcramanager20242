import React from 'react';
import { Table, Typography, Button, notification, Modal } from 'antd';
import { CopyOutlined } from '@ant-design/icons'; // Importamos el ícono de copiar
import axios from 'axios';

const { confirm } = Modal;

// Función para copiar al portapapeles
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    notification.success({
      message: 'Copiado al portapapeles',
      description: 'El texto se copió exitosamente.',
    });
  }).catch(() => {
    notification.error({
      message: 'Error al copiar',
      description: 'No se pudo copiar el texto.',
    });
  });
};

const columnsInscripciones = (showDeleteConfirm) => [
  {
    title: 'ID Inscripción',
    dataIndex: 'id_inscripcion',
    key: 'id_inscripcion',
    render: (id_inscripcion) => (
      <span>
        {id_inscripcion}
        <CopyOutlined
          style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
          onClick={() => copyToClipboard(id_inscripcion)}
        />
      </span>
    ),
  },
  {
    title: 'ID Sección',
    dataIndex: 'id_seccion',
    key: 'id_seccion',
    render: (id_seccion) => (
      <span>
        <a href={`/secciones/${id_seccion}`} target="_blank" rel="noopener noreferrer">
          {id_seccion}
        </a>
        <CopyOutlined
          style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
          onClick={() => copyToClipboard(id_seccion)}
        />
      </span>
    ),
  },
  {
    title: 'Sede',
    dataIndex: 'nombre_sede',
    key: 'nombre_sede',
    render: (nombre_sede) => (
      <span>
        {nombre_sede}
        <CopyOutlined
          style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
          onClick={() => copyToClipboard(nombre_sede)}
        />
      </span>
    ),
  },
  {
    title: 'Código Asignatura',
    dataIndex: 'cod_asig',
    key: 'cod_asig',
    render: (cod_asig) => (
      <span>
        {cod_asig}
        <CopyOutlined
          style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
          onClick={() => copyToClipboard(cod_asig)}
        />
      </span>
    ),
  },
  {
    title: 'Sección',
    dataIndex: 'seccion',
    key: 'seccion',
    render: (seccion) => (
      <span>
        {seccion}
        <CopyOutlined
          style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
          onClick={() => copyToClipboard(seccion)}
        />
      </span>
    ),
  },
  {
    title: 'RUT Docente',
    dataIndex: 'rut_docente',
    key: 'rut_docente',
    render: (rut_docente) => (
      <span>
        <a href={`/buscar-docente/${rut_docente}`} target="_blank" rel="noopener noreferrer">
          {rut_docente}
        </a>
        <CopyOutlined
          style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
          onClick={() => copyToClipboard(rut_docente)}
        />
      </span>
    ),
  },
  {
    title: 'Nombre Docente',
    dataIndex: 'nombre_docente',
    key: 'nombre_docente',
    render: (nombre_docente) => (
      <span>
        {nombre_docente}
        <CopyOutlined
          style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
          onClick={() => copyToClipboard(nombre_docente)}
        />
      </span>
    ),
  },
  {
    title: 'Acciones',
    key: 'acciones',
    render: (text, record) => (
      <Button danger onClick={() => showDeleteConfirm(record.id_inscripcion)}>
        Eliminar
      </Button>
    ),
  },
];

const InscripcionesTable = ({ inscripciones, setInscripciones }) => {
  const handleDelete = async (idInscripcion) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/eliminar_inscripcion/${idInscripcion}`);

      if (response.status === 200) {
        notification.success({
          message: 'Eliminación Exitosa',
          description: 'La inscripción fue eliminada correctamente.',
        });

        // Actualizar la tabla eliminando la inscripción
        const nuevasInscripciones = inscripciones.filter(
          (inscripcion) => inscripcion.id_inscripcion !== idInscripcion
        );
        setInscripciones(nuevasInscripciones);
      } else {
        notification.error({
          message: 'Error',
          description: 'No se pudo eliminar la inscripción.',
        });
      }
    } catch (error) {
      console.error('Error al eliminar la inscripción:', error);
      notification.error({
        message: 'Error',
        description: 'Ocurrió un error al intentar eliminar la inscripción.',
      });
    }
  };

  const showDeleteConfirm = (idInscripcion) => {
    confirm({
      title: '¿Estás seguro de que deseas eliminar esta inscripción?',
      content: 'Una vez eliminada, no podrás recuperar esta inscripción.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        handleDelete(idInscripcion);
      },
      onCancel() {
        console.log('Cancelado');
      },
    });
  };

  if (inscripciones.length === 0) return null;

  return (
    <div style={{ margin: '20px 0px' }}>
      <Typography.Title level={4}>Inscripciones</Typography.Title>
      <Table
        className="formato-table1"
        columns={columnsInscripciones(showDeleteConfirm)}
        dataSource={inscripciones}
        rowKey="id_inscripcion"
        pagination={false}
      />
    </div>
  );
};

export default InscripcionesTable;
