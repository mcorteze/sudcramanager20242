import React, { useState } from 'react';
import { Input, Select, Button, Form, notification } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AgregarTareaForm = ({ depositos, fetchTareas }) => {
  const [newTareaNombre, setNewTareaNombre] = useState('');
  const [newTareaTipo, setNewTareaTipo] = useState('Única');
  const [newTareaPrioridad, setNewTareaPrioridad] = useState('Media');
  const [selectedDeposito, setSelectedDeposito] = useState(null);

  // Define resetForm antes de usarla en handleAgregarTarea
  const resetForm = () => {
    setNewTareaNombre('');
    setNewTareaTipo('Única');
    setNewTareaPrioridad('Media');
    setSelectedDeposito(null);
  };

  const handleAgregarTarea = async () => {
    const nuevaTarea = {
      nombre: newTareaNombre,
      tipo_tarea: newTareaTipo,
      prioridad: newTareaPrioridad,
      id_deposito: selectedDeposito ? selectedDeposito.id_deposito : null,
      id_estado: 1,
    };

    console.log('Agregando tarea:', nuevaTarea);

    try {
      await axios.post('http://localhost:3002/agregar_tarea', nuevaTarea);
      fetchTareas(); // Actualiza la lista de tareas
      notification.success({
        message: 'Éxito',
        description: 'Tarea agregada correctamente',
      });
      resetForm(); // Llama a resetForm aquí
    } catch (error) {
      console.error('Error al agregar tarea:', error);
      notification.error({
        message: 'Error',
        description: 'Error al agregar la tarea',
      });
    }
  };

  return (
    <Form layout="vertical" className="form-container">
      <Form.Item label="Nombre de la nueva tarea">
        <Input
          value={newTareaNombre}
          onChange={(e) => setNewTareaNombre(e.target.value)}
          placeholder="Nombre de la nueva tarea"
        />
      </Form.Item>
      <Form.Item label="Tipo de tarea">
        <Select
          value={newTareaTipo}
          onChange={(value) => setNewTareaTipo(value)}
          placeholder="Seleccionar tipo"
        >
          <Option value="Única">Única</Option>
          <Option value="Frecuente">Frecuente</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Depósito">
        <Select
          value={selectedDeposito ? selectedDeposito.id_deposito : null}
          onChange={(value) => {
            const deposito = depositos.find(dep => dep.id_deposito === value);
            setSelectedDeposito(deposito);
          }}
          placeholder="Seleccionar depósito"
        >
          {depositos.map(deposito => (
            <Option key={deposito.id_deposito} value={deposito.id_deposito}>
              {deposito.deposito}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Prioridad">
        <Select
          value={newTareaPrioridad}
          onChange={(value) => setNewTareaPrioridad(value)}
          placeholder="Seleccionar prioridad"
        >
          <Option value="Baja">Baja</Option>
          <Option value="Media">Media</Option>
          <Option value="Importante">Importante</Option>
          <Option value="Urgente">Urgente</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={handleAgregarTarea}>
          Agregar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AgregarTareaForm;
