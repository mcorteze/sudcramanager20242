import React, { useState } from 'react';
import { FileExcelOutlined, SyncOutlined, AppstoreOutlined, DesktopOutlined, DownloadOutlined, ExclamationOutlined, FileImageOutlined, UserOutlined, FilterOutlined, DropboxOutlined, SlidersOutlined, DashboardOutlined, TableOutlined } from '@ant-design/icons';
import { SlNote } from "react-icons/sl";
import { Layout, Menu, theme } from 'antd';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CabezalSidebar from './components/CabezalSidebar.js';
import Home from './pages/Home.js';
import Informe from './pages/Informe';
import RutAlumno from './pages/RutAlumno';
import BuscarAlumno from './pages/BuscarAlumno';
import BuscarDocente from './pages/BuscarDocente';
import CargaDocente from './pages/CargaDocente';
import SeguimientoPlanilla from './pages/SeguimientoPlanilla';
import Apunte from './pages/Apunte';
import MonitorPage from './pages/MonitorPage';
import EnlacePage from './pages/EnlacePage';
import SapMenu from './components/megamenu/sap/SapMenu';
import SapDocente from './components/megamenu/sap/SapDocente';
import SapIndice from './components/megamenu/sap/SapInscripcion';
import SapInscripcion from './components/megamenu/sap/SapIndice';
import SapSabana from './components/megamenu/sap/SapSabana';
import ExtraerNotasPage from './pages/ExtraerNotasPage.js';
import Pruebas from './pages/Pruebas.js';
import SeccionesPendientesPage from './pages/SeccionesPendientesPage.js'
import ImagenPage from './pages/ImagenPage.js';
import BuscarSeccion from './pages/BuscarSeccion.js';
import BuscarEval from './pages/BuscarEval.js';
import EstadisticasPage from './pages/EstadisticasPage.js';
import TareasPage from './pages/TareasPage.js';
import DashboardPage from './pages/DashboardPage.js';
import AccesosPage from './pages/AccesosPage.js';
import ArchivoLeidoPage from './pages/ArchivoLeidoPage.js';
import SharepointPage from './pages/SharepointPage.js';
import PanelSeccionesPage from './pages/PanelSeccionesPage.js'

import './App.css';

import EnlacesFlotante from './components/EnlacesFlotante.js';

const { Sider, Content } = Layout;

const App = () => {
  const [collapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Router>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <CabezalSidebar />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<SyncOutlined />}>
              <Link to="/">Resumen</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<FilterOutlined />}>
              <Link to="/informe">Filtro Informe</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UserOutlined />}>
              <Link to="/buscar-alumno">Buscar Alumno</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
              <Link to="/buscar-docente">Buscar docente</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<DropboxOutlined />}>
              <Link to="/secciones">ID Sección</Link>
            </Menu.Item>
            <Menu.Item key="13" icon={<ExclamationOutlined />}>
              <Link to="/pendientes">Pendientes</Link>
            </Menu.Item>
            <Menu.Item key="16" icon={<SlNote />}>
              <Link to="/tareas">Tareas</Link>
            </Menu.Item>
            <Menu.Item key="17" icon={<DashboardOutlined />}>
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="18" icon={<TableOutlined />}>
              <Link to="/accesos">Recursos</Link>
            </Menu.Item>
            <Menu.Item key="19" icon={<TableOutlined />}>
              <Link to="/listasharepoint">SharePoint</Link>
            </Menu.Item>
            <Menu.Item key="20" icon={<TableOutlined />}>
              <Link to="/panelsecciones">Panel</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <EnlacesFlotante />
        <Layout>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/informe" element={<Informe />} />
              <Route path="/informe/:programa/:sede/:asignatura/:seccion" element={<Informe />} />
              <Route path="/rut" element={<RutAlumno />} />
              <Route path="/rut/:rut" element={<RutAlumno />} />
              <Route path="/buscar-docente" element={<BuscarDocente />} />
              <Route path="/buscar-docente/:keyword" element={<BuscarDocente />} />
              <Route path="/buscar-alumno" element={<BuscarAlumno />} />
              <Route path="/buscar-alumno/:keyword" element={<BuscarAlumno />} />
              <Route path="/carga-docente/:rut" element={<CargaDocente />} />
              <Route path="/seguimientoplanilla" element={<SeguimientoPlanilla />} />
              <Route path="/archivoleido" element={<ArchivoLeidoPage />} />
              <Route path="/archivoleido/:id_archivoleido" element={<ArchivoLeidoPage />} />
              <Route path="/apuntes" element={<Apunte />} />
              <Route path="/enlaces" element={<EnlacePage />} />
              <Route path="/apuntes/sap" element={<SapMenu />} />
              <Route path="/apuntes/sap/docente" element={<SapDocente />} />
              <Route path="/apuntes/sap/indice" element={<SapIndice />} />
              <Route path="/apuntes/sap/inscripcion" element={<SapInscripcion />} />
              <Route path="/apuntes/sap/sabana" element={<SapSabana />} />
              <Route path="/monitor" element={<MonitorPage />} />
              <Route path="/monitor/:programa" element={<MonitorPage />} />
              <Route path="/monitor/:programa/:asignatura" element={<MonitorPage />} />
              <Route path="/extraernotas" element={<ExtraerNotasPage />} />
              <Route path="/pendientes" element={<SeccionesPendientesPage />} />
              <Route path="/imagen" element={<ImagenPage />} />
              <Route path="/imagen/:id_lista" element={<ImagenPage />} />
              <Route path="/secciones" element={<BuscarSeccion />} />
              <Route path="/secciones/:id_seccion" element={<BuscarSeccion />} />
              <Route path="/pruebas" element={<Pruebas />} />
              <Route path="/buscareval" element={<BuscarEval />} />
              <Route path="/estadisticas" element={<EstadisticasPage />} />
              <Route path="/tareas" element={<TareasPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/accesos" element={<AccesosPage />} />
              <Route path="/listasharepoint" element={<SharepointPage />} />
              <Route path="/panelsecciones" element={<PanelSeccionesPage />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
