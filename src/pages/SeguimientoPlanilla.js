import React, { useState } from 'react';
import { Input, Button, Table, message } from 'antd';
import axios from 'axios';

const { Search } = Input;

const SeguimientoPlanilla = () => {
    const [string1, setString1] = useState('');
    const [string2, setString2] = useState('');
    const [string3, setString3] = useState('');
    const [string4, setString4] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Columnas de la tabla
    const columns = [
        {
            title: 'ID Archivo Leído',
            dataIndex: 'id_archivoleido',
            key: 'id_archivoleido',
        },
        {
            title: 'Año',
            dataIndex: 'anio',
            key: 'anio',
        },
        {
            title: 'Mes',
            dataIndex: 'mes',
            key: 'mes',
        },
        {
            title: 'Día',
            dataIndex: 'dia',
            key: 'dia',
        },
        {
            title: 'Hora',
            dataIndex: 'marcatemporal',
            key: 'marcatemporal',
            render: (text) => {
                const date = new Date(text);
                const pad = (n) => n.toString().padStart(2, '0');
                const formattedDate = `${date.getDate()}-${pad(date.getMonth() + 1)}-${pad(date.getFullYear())}`;
                const formattedTime = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
                return `${formattedTime}`;
              },
        },
        {
            title: 'ID Sección',
            dataIndex: 'id_seccion',
            key: 'id_seccion',
        },
        {
            title: 'Archivo Leído',
            dataIndex: 'archivoleido',
            key: 'archivoleido',
        },
        {
            title: 'Tiene Calificación',
            dataIndex: 'tiene_coincidencia',
            key: 'tiene_coincidencia',
        },
    ];

    // Función para manejar la búsqueda
    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3001/api/archivosleidosconcalificacion', {
                params: {
                    string1,
                    string2,
                    string3,
                    string4,
                },
            });
            setData(response.data);
        } catch (error) {
            console.error(error);
            message.error('Error al buscar los datos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Búsqueda de Archivos Leídos</h2>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Search
                    placeholder="Primer String"
                    value={string1}
                    onChange={(e) => setString1(e.target.value)}
                    enterButton={false}
                />
                <Search
                    placeholder="Segundo String"
                    value={string2}
                    onChange={(e) => setString2(e.target.value)}
                    enterButton={false}
                />
                <Search
                    placeholder="Tercer String"
                    value={string3}
                    onChange={(e) => setString3(e.target.value)}
                    enterButton={false}
                />
                <Search
                    placeholder="Cuarto String"
                    value={string4}
                    onChange={(e) => setString4(e.target.value)}
                    enterButton={false}
                />
                <Button type="primary" onClick={handleSearch} loading={loading}>
                    Buscar
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id_archivoleido"
                loading={loading}
                bordered
            />
        </div>
    );
};

export default SeguimientoPlanilla;
