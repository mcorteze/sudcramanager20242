import React, { useState } from 'react';
import { Input, Select, Button, Table, message } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for routing

const { Option } = Select;

const SeguimientoPlanilla = () => {
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState('archivos-leidos');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchText) {
      message.error('Por favor ingresa un texto para buscar.');
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      switch (searchType) {
        case 'archivos-leidos':
          endpoint = `http://localhost:3001/api/archivos-leidos/${encodeURIComponent(searchText)}`;
          break;
        case 'lectura-temp':
          endpoint = `http://localhost:3001/api/archivos-leidos-temp/${encodeURIComponent(searchText)}`;
          break;
        case 'lectura':
          endpoint = `http://localhost:3001/api/archivos-leidos-lectura/${encodeURIComponent(searchText)}`;
          break;
        default:
          endpoint = '';
      }

      console.log('Endpoint:', endpoint);

      const response = await axios.get(endpoint);
      console.log('Response data:', response.data);

      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Error al buscar los datos.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID Archivo Leido',
      dataIndex: 'id_archivoleido',
      key: 'id_archivoleido',
      render: (text, record) => (
        <Link to={`/archivoleido/${record.id_archivoleido}`}>{text}</Link> // Create a link
      ),
    },
    {
      title: 'ID Lectura',
      dataIndex: 'id_lectura',
      key: 'id_lectura',
    },
    {
      title: 'Archivo Leído',
      dataIndex: 'archivoleido',
      key: 'archivoleido',
    },
    {
      title: 'Marca Temporal',
      dataIndex: 'marcatemporal',
      key: 'marcatemporal',
      render: (text) => {
        const date = new Date(text);
        const pad = (n) => n.toString().padStart(2, '0');
        const formattedDate = `${date.getDate()}-${pad(date.getMonth() + 1)}-${pad(date.getFullYear())}`;
        const formattedTime = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        return `${formattedDate}, ${formattedTime}`;
      },
    },
  ];

  return (
    <div className='page-full'>
      <h1>Seguimiento de planilla</h1>
      <Input
        placeholder="Texto de búsqueda"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        style={{ width: 200, marginRight: 10 }}
      />
      <Select
        value={searchType}
        onChange={value => setSearchType(value)}
        style={{ width: 200, marginRight: 10 }}
      >
        <Option value="archivos-leidos">Archivos Leídos</Option>
        <Option value="lectura-temp">Lectura Temp</Option>
        <Option value="lectura">Lectura</Option>
      </Select>
      <Button type="primary" onClick={handleSearch} loading={loading}>
        Buscar
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id_archivoleido"
        style={{ marginTop: 20 }}
        loading={loading}
      />
    </div>
  );
};

export default SeguimientoPlanilla;
