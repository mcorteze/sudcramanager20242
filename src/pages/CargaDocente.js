import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table } from 'antd';
import { Link } from 'react-router-dom';

export default function CargaDocente() {
  const { rut } = useParams();
  const [docenteInfo, setDocenteInfo] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/docente/${rut}`);
        const result = await response.json();
        if (result.length > 0) {
          setDocenteInfo(result[0]); // Tomamos la primera entrada como información del docente
          setData(result);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rut]);

  const columns = [
    {
      title: 'Nombre de la Sede',
      dataIndex: 'nombre_sede',
      key: 'nombre_sede',
    },
    {
      title: 'Código Asignatura',
      dataIndex: 'cod_asig',
      key: 'cod_asig',
    },
    {
      title: 'Nombre Asignatura',
      dataIndex: 'asig',
      key: 'asig',
    },
    {
      title: 'Sección',
      dataIndex: 'seccion',
      key: 'seccion',
    },
    {
      title: 'ID Sección',
      dataIndex: 'id_seccion',
      key: 'id_seccion',
      render: (id_seccion) => (
        <Link to={`/secciones/${id_seccion}`}>{id_seccion}</Link>
      ),
    },
  ];

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='page-full'>
      <h1>Información del Docente</h1>
      <div>
        <p><strong>RUT:</strong> {docenteInfo.rut_docente}</p>
        <p><strong>Nombre:</strong> {docenteInfo.nombre_doc}</p>
        <p><strong>Apellidos:</strong> {docenteInfo.apellidos_doc}</p>
        <p><strong>Username:</strong> {docenteInfo.username_doc}</p>
        <p><strong>Email:</strong> {docenteInfo.mail_doc}</p>
      </div>
      <Table dataSource={data} columns={columns} />
    </div>
  );
}
