import React, { useState } from 'react';
import { MegaMenu } from 'primereact/megamenu';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { TbDatabaseEdit } from "react-icons/tb";
import { RiFileExcel2Line } from "react-icons/ri";
import { SiSap } from "react-icons/si";
import { MdFollowTheSigns } from "react-icons/md";
import { FaDatabase } from 'react-icons/fa'; // Importa el ícono de base de datos
import './Apunte.css';
import SapMenu from '../components/megamenu/sap/SapMenu';
import TablaAppMenu from '../components/megamenu/tablaapp/TablaAppMenu';
import TablaEmisionMenu from '../components/megamenu/tablaemision/TablaEmisionMenu';
import TablaAjustes from '../components/megamenu/tablaajustes/TablaAjustes';
import RegistrosMenu from '../components/megamenu/pgadmin/registros/RegistrosMenu';
import SeguimientoMenu from '../components/megamenu/seguimiento/SeguimientoMenu';
import SqlMenu from '../components/megamenu/sql/SqlMenu'; // Importa el nuevo componente

export default function Apunte() {
  const [renderSapMenu, setRenderSapMenu] = useState(false);
  const [sapMenuIndex, setSapMenuIndex] = useState(0);

  const [renderAppMenu, setRenderAppMenu] = useState(false);
  const [appMenuIndex, setAppMenuIndex] = useState(0);

  const [renderEmisionMenu, setRenderEmisionMenu] = useState(false);
  const [emisionMenuIndex, setEmisionMenuIndex] = useState(0);

  const [renderAjustesMenu, setRenderAjustesMenu] = useState(false);

  const [renderRegistrosMenu, setRenderRegistrosMenu] = useState(false);

  const [renderSeguimientoMenu, setRenderSeguimientoMenu] = useState(false); 
  const [seguimientoMenuIndex, setSeguimientoMenuIndex] = useState(0);

  const [renderSqlMenu, setRenderSqlMenu] = useState(false); // Nuevo estado

  const items = [
    {
      label: 'SAP',
      icon: <SiSap className='menu-iconstyle'/>,
      items: [
        [
          { label: 'Descargas', items: [
            { label: 'Instrucciones', command: () => { setRenderSapMenu(true); setSapMenuIndex(0); setRenderAppMenu(false); setRenderEmisionMenu(false); setRenderAjustesMenu(false); setRenderRegistrosMenu(false); setRenderSeguimientoMenu(false); setRenderSqlMenu(false); } },
            { label: 'Docentes', command: () => { setRenderSapMenu(true); setSapMenuIndex(1); setRenderAppMenu(false); setRenderEmisionMenu(false); setRenderAjustesMenu(false); setRenderRegistrosMenu(false); setRenderSeguimientoMenu(false); setRenderSqlMenu(false); } },
            { label: 'Indice', command: () => { setRenderSapMenu(true); setSapMenuIndex(2); setRenderAppMenu(false); setRenderEmisionMenu(false); setRenderAjustesMenu(false); setRenderRegistrosMenu(false); setRenderSeguimientoMenu(false); setRenderSqlMenu(false); } },
            { label: 'Inscripción', command: () => { setRenderSapMenu(true); setSapMenuIndex(3); setRenderAppMenu(false); setRenderEmisionMenu(false); setRenderAjustesMenu(false); setRenderRegistrosMenu(false); setRenderSeguimientoMenu(false); setRenderSqlMenu(false); } },
            { label: 'Sabana', command: () => { setRenderSapMenu(true); setSapMenuIndex(4); setRenderAppMenu(false); setRenderEmisionMenu(false); setRenderAjustesMenu(false); setRenderRegistrosMenu(false); setRenderSeguimientoMenu(false); setRenderSqlMenu(false); } }
          ] }
        ]
      ]
    },
    {
      label: 'Tabla de especificaciones',
      icon: <RiFileExcel2Line className='menu-iconstyle'/>,
      items: [
        [
          { label: 'Validación', items: [
            { label: 'App Validacion', command: () => { setRenderAppMenu(true); setAppMenuIndex(0); setRenderSapMenu(false); setRenderEmisionMenu(false); setRenderAjustesMenu(false); setRenderRegistrosMenu(false); setRenderSeguimientoMenu(false); setRenderSqlMenu(false); } }
          ]}
        ],
        [
          { label: 'Emisión de planillas', items: [
            { label: 'Carga de planillas', command: () => { setRenderEmisionMenu(true); setEmisionMenuIndex(0); setRenderSapMenu(false); setRenderAppMenu(false); setRenderAjustesMenu(false); setRenderRegistrosMenu(false); setRenderSeguimientoMenu(false); setRenderSqlMenu(false); } },
            { label: 'Planilla base', command: () => { setRenderEmisionMenu(true); setEmisionMenuIndex(1); setRenderSapMenu(false); setRenderAppMenu(false); setRenderAjustesMenu(false); setRenderRegistrosMenu(false); setRenderSeguimientoMenu(false); setRenderSqlMenu(false); } },
            { label: 'Emisión de planillas', command: () => { setRenderEmisionMenu(true); setEmisionMenuIndex(2); setRenderSapMenu(false); setRenderAppMenu(false); setRenderAjustesMenu(false); setRenderRegistrosMenu(false); setRenderSeguimientoMenu(false); setRenderSqlMenu(false); } }
          ]}
        ],
        [
          { label: 'Ajustes', items: [
            { label: 'Apuntes adicionales', command: () => { setRenderSapMenu(false); setRenderAppMenu(false); setRenderEmisionMenu(false); setRenderAjustesMenu(true); setRenderRegistrosMenu(false); setRenderSeguimientoMenu(false); setRenderSqlMenu(false); } }
          ]}
        ],
      ]
    },
    {
      label: 'Cambiar registros',
      icon: <TbDatabaseEdit className='menu-iconstyle'/>,
      items: [
        [
          { label: 'Modificar', items: [
            { label: 'Docente titular', command: () => { setRenderSapMenu(false); setRenderAppMenu(false); setRenderEmisionMenu(false); setRenderAjustesMenu(false); setRenderRegistrosMenu(true); setRenderSeguimientoMenu(false); setRenderSqlMenu(false); } },
            { label: 'Inscripción alumno', command: () => { setRenderSapMenu(false); setRenderAppMenu(false); setRenderEmisionMenu(false); setRenderAjustesMenu(false); setRenderRegistrosMenu(true); setRenderSeguimientoMenu(false); setRenderSqlMenu(false); } },
            { label: 'Reenviar correo a estudiante', command: () => { setRenderSapMenu(false); setRenderAppMenu(false); setRenderEmisionMenu(false); setRenderAjustesMenu(false); setRenderRegistrosMenu(true); setRenderSeguimientoMenu(false); setRenderSqlMenu(false); } }
          ]}
        ],
      ]
    },
    {
      label: 'Seguimiento',
      icon: <MdFollowTheSigns className='menu-iconstyle'/>,
      items: [
        [
          { label: 'Planillas', items: [
            { label: 'Seguimiento de planillas', 
              command: () => { setRenderSapMenu(false); setRenderAppMenu(false); setRenderEmisionMenu(false); setRenderAjustesMenu(false); setRenderRegistrosMenu(false); setRenderSeguimientoMenu(true); setSeguimientoMenuIndex(0); setRenderSqlMenu(false); } },
          ]},
          { label: 'Imagenes', items: [
            { label: 'Seguimiento de imagenes', command: () => { setRenderSapMenu(false); setRenderAppMenu(false); setRenderEmisionMenu(false); setRenderAjustesMenu(false); setRenderRegistrosMenu(false); setRenderSeguimientoMenu(true); setSeguimientoMenuIndex(1); setRenderSqlMenu(false); } }
          ]},
        ],
      ]
    },
    // Nuevo elemento del menú SQL
    {
      label: 'SQL',
      icon: <FaDatabase className='menu-iconstyle'/>,
      items: [
        [
          { label: 'Consulta extracción', items: [
            { label: 'Notas', command: () => { setRenderSapMenu(false); setRenderAppMenu(false); setRenderEmisionMenu(false); setRenderAjustesMenu(false); setRenderRegistrosMenu(false); setRenderSeguimientoMenu(false); setRenderSqlMenu(true); } }
          ]}
        ]
      ]
    }
  ];

  return (
    <div className='page-full' style={{ marginTop: '40px' }}>
      <div className="card">
        <MegaMenu model={items} breakpoint="960px" />
      </div>
      <div className='apunte-container'>
        <div className="apunte-content">
          {renderSapMenu && <SapMenu initialActiveIndex={sapMenuIndex} />} {/* Renderiza el componente */}
          {renderAppMenu && <TablaAppMenu initialActiveIndex={appMenuIndex} />}
          {renderEmisionMenu && <TablaEmisionMenu initialActiveIndex={emisionMenuIndex} />}
          {renderAjustesMenu && <TablaAjustes />}
          {renderRegistrosMenu && <RegistrosMenu />}
          {renderSeguimientoMenu && <SeguimientoMenu index={seguimientoMenuIndex} />} 
          {renderSqlMenu && <SqlMenu />} 
        </div>
      </div>
    </div>
  );
}
