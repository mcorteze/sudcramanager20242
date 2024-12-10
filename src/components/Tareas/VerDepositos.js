import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Table, message, Popconfirm } from 'antd';
import axios from 'axios';

export default function VerDepositos() {
  const [depositos, setDepositos] = useState([]);
  const [newDeposito, setNewDeposito] = useState('');

  useEffect(() => {
    fetchDepositos();
  }, []);

  const fetchDepositos = async () => {
    try {
      const response = await axios.get('http://localhost:3002/obtener_depositos');
      setDepositos(response.data);
    } catch (error) {
      console.error('Error al obtener los depósitos:', error);
      message.error('Error al obtener los depósitos');
    }
  };

  const agregarDeposito = async () => {
    try {
      await axios.post('http://localhost:3002/crear_deposito', { deposito: newDeposito });
      setNewDeposito('');
      fetchDepositos();
      message.success('Depósito agregado');
    } catch (error) {
      console.error('Error al agregar el depósito:', error);
      message.error('No se pudo agregar el depósito');
    }
  };

  const eliminarDeposito = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/eliminar_deposito/${id}`);
      fetchDepositos();
      message.warn('Depósito eliminado');
    } catch (error) {
      console.error('Error al eliminar deposito:', error);
      message.error('No se pudo eliminar el depósito');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_deposito',
      key: 'id_deposito',
    },
    {
      title: 'Depósito',
      dataIndex: 'deposito',
      key: 'deposito',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Popconfirm
          title="¿Estás seguro de que deseas eliminar este depósito?"
          onConfirm={() => eliminarDeposito(record.id_deposito)}
          okText="Sí"
          cancelText="No"
        >
          <Button type="danger">Eliminar</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h2>Depósitos</h2>
      <div style={{ marginBottom: 16 }}>
        <Input
          value={newDeposito}
          onChange={(e) => setNewDeposito(e.target.value)}
          placeholder="Nombre del nuevo depósito"
          style={{ width: 300, marginRight: 8 }}
        />
        <Button type="primary" onClick={agregarDeposito}>
          Agregar
        </Button>
      </div>
      <Table dataSource={depositos} columns={columns} rowKey="id_deposito" />
    </div>
  );
}
