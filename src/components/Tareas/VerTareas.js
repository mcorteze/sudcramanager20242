import React, { useState } from 'react';
import { Button, Table, Typography, Modal, notification } from 'antd';
import { EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import './VerTareas.css';

import EditarTareaModal from './EditarTareaModal';

const { Title } = Typography;

export default function VerTareas({ depositos, tareas, fetchTareas }) {
  const [editingTask, setEditingTask] = useState(null);
  const [displayEditDialog, setDisplayEditDialog] = useState(false);

  const fetchTaskDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3002/tarea/${id}`);
      setEditingTask(response.data);
      setDisplayEditDialog(true);
    } catch (error) {
      console.error('Error al obtener los detalles de la tarea:', error);
      notification.error({ message: 'Error', description: 'No se pudo obtener la tarea' });
    }
  };

  const closeEditDialog = () => {
    setDisplayEditDialog(false);
    setEditingTask(null);
  };

  const saveChanges = async (taskData) => {
    try {
      await axios.put(`http://localhost:3002/tarea/${taskData.id_tarea}`, taskData);
      fetchTareas();
      closeEditDialog();
      notification.success({ message: 'Éxito', description: 'Tarea actualizada correctamente' });
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      notification.error({ message: 'Error', description: 'No se pudo actualizar la tarea' });
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/eliminar_tarea/${id}`);
      notification.success({ message: 'Éxito', description: 'Tarea eliminada correctamente' });
      fetchTareas();
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      notification.error({ message: 'Error', description: 'No se pudo eliminar la tarea' });
    }
  };

  const columns = [
    { title: 'Depósito', dataIndex: 'deposito', key: 'deposito' },
    { title: 'Tipo', dataIndex: 'tipo_tarea', key: 'tipo_tarea' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },  
    {
      title: 'Prioridad',
      dataIndex: 'prioridad',
      key: 'prioridad',
      render: (prioridad) => (
        <span className={`priority-badge ${prioridad.toLowerCase()}`}>
          {prioridad}
        </span>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => fetchTaskDetails(record.id_tarea)}
            type="primary"
            style={{ marginRight: '8px' }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => deleteTask(record.id_tarea)}
            type="danger"
          />
        </>
      ),
    },
    {
      title: 'Conf Pendiente',
      key: 'pendiente',
      render: (_, record) => (
        !record.configurada ? <ClockCircleOutlined style={{ color: 'orange' }} title="Pendiente" /> : null
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ marginBottom: '20px' }}>Lista de Tareas</Title>
      <Table
        dataSource={tareas}
        columns={columns}
        rowKey="id_tarea"
        pagination={{ pageSize: 10 }}
        bordered
      />
      <EditarTareaModal
        displayEditDialog={displayEditDialog}
        closeEditDialog={closeEditDialog}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        depositos={depositos}
        saveChanges={saveChanges}
      />
    </div>
  );
}
