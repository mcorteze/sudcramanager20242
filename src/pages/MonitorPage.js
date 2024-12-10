import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Breadcrumb, Button, Collapse } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { MailOutlined, MailTwoTone } from '@ant-design/icons';
import { ImArrowRight } from "react-icons/im";

import './MonitorPage.css';

const { Panel } = Collapse;

export default function MonitorPage() {
  const [programas, setProgramas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const { programa, asignatura } = useParams();

  useEffect(() => {
    setLoading(true);

    async function fetchProgramas() {
      try {
        const response = await axios.get('http://localhost:3001/api/programas');
        setProgramas(response.data);
      } catch (error) {
        console.error('Error fetching programas:', error);
        setProgramas([]);
      }
    }

    async function fetchAsignaturas(programa) {
      try {
        const response = await axios.get(`http://localhost:3001/api/monitor/${programa}`);
        setAsignaturas(response.data);
      } catch (error) {
        console.error('Error fetching asignaturas:', error);
        setAsignaturas([]);
      }
    }

    async function fetchSecciones(programa, asignatura) {
      try {
        const response = await axios.get(`http://localhost:3001/api/monitor/${programa}/${asignatura}`);
        setSecciones(response.data);
      } catch (error) {
        console.error('Error fetching secciones:', error);
        setSecciones([]);
      }
    }

    fetchProgramas();
    if (programa) {
      fetchAsignaturas(programa);
    }
    if (programa && asignatura) {
      fetchSecciones(programa, asignatura);
    }

    setLoading(false);
  }, [programa, asignatura]);

  const columnsProgramas = [
    {
      title: 'Programa',
      dataIndex: 'programa',
      key: 'programa',
    },
    {
      title: 'Acceder',
      key: 'acceder',
      render: (text, record) => (
        <Button type="link">
          <Link to={`/monitor/${record.cod_programa}`} className="link-acceder">
            <ImArrowRight className="icono" />
            Acceder
          </Link>
        </Button>
      ),
    },
  ];

  const columnsAsignaturas = [
    {
      title: 'Código Asignatura',
      dataIndex: 'cod_asig',
      key: 'cod_asig',
    },
    {
      title: 'Asignatura',
      dataIndex: 'asig',
      key: 'asig',
    },
    {
      title: 'Acceder',
      key: 'acceder',
      render: (text, record) => (
        <Button type="link">
          <Link to={`/monitor/${programa}/${record.cod_asig}`} className="link-acceder">
            <ImArrowRight className="icono" />
            Acceder
          </Link>
        </Button>
      ),
    },
  ];

  const transformSeccionesData = (data) => {
    const seccionesMap = {};
    const evalsPresent = new Set();

    data.forEach((item) => {
      if (!seccionesMap[item.id_seccion]) {
        seccionesMap[item.id_seccion] = {
          nombre_sede: item.nombre_sede,
          seccion: item.seccion,
          ...Array.from({ length: 11 }, (_, i) => ({ [`E${i}`]: false })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        };
      }
      if (item.num_prueba >= 0 && item.num_prueba <= 10) {
        seccionesMap[item.id_seccion][`E${item.num_prueba}`] = true;
        evalsPresent.add(item.num_prueba);
      }
    });

    const seccionesArray = Object.values(seccionesMap);
    const dynamicColumns = Array.from(evalsPresent).sort().map((num) => ({
      title: `E${num}`,
      dataIndex: `E${num}`,
      key: `E${num}`,
      render: (text, record) => (
        record[`E${num}`] ? <MailOutlined style={{ fontSize: '15px', background: 'yellow', color: '#1890ff' }} /> : <MailTwoTone twoToneColor="#ccc" style={{ fontSize: '15px' }} />
      ),
    }));

    return { seccionesArray, dynamicColumns };
  };

  const { seccionesArray, dynamicColumns } = transformSeccionesData(secciones);

  const columnsSecciones = [
    {
      title: 'Sección',
      dataIndex: 'seccion',
      key: 'seccion',
    },
    ...dynamicColumns,
  ];

  const groupedSecciones = seccionesArray.reduce((acc, seccion) => {
    const sede = seccion.nombre_sede;
    if (!acc[sede]) {
      acc[sede] = [];
    }
    acc[sede].push(seccion);
    return acc;
  }, {});

  return (
    <div className='page-full'>
      <h1>Navegar por programa</h1>
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>
          <Link to="/monitor">Programa</Link>
        </Breadcrumb.Item>
        {programa && (
          <Breadcrumb.Item>
            <Link to={`/monitor/${programa}`}>Asignatura</Link>
          </Breadcrumb.Item>
        )}
        {asignatura && (
          <Breadcrumb.Item>
            <Link to={`/monitor/${programa}/${asignatura}`}>Secciones</Link>
          </Breadcrumb.Item>
        )}
      </Breadcrumb>

      {!programa && (
        <div>
          <div className='monitor-container'>
          <Table
            dataSource={programas}
            columns={columnsProgramas}
            rowKey="cod_programa"
            pagination={false}
          />
          </div>
        </div>
      )}
      {programa && !asignatura && (
        <div>
          <div className='monitor-container'>
          <Table
            dataSource={asignaturas}
            columns={columnsAsignaturas}
            rowKey="cod_asig"
            loading={loading}
            pagination={false}
          />
          </div>
        </div>
      )}
      {programa && asignatura && (
        <div>
          <div className='monitor-container'>
          <Collapse accordion>
            {Object.keys(groupedSecciones).map((sede) => (
              <Panel header={sede} key={sede}>
                <Table
                  dataSource={groupedSecciones[sede]}
                  columns={columnsSecciones}
                  rowKey="id_seccion"
                  loading={loading}
                  pagination={false}
                />
              </Panel>
            ))}
          </Collapse>
          </div>
        </div>
      )}
    </div>
  );
}
