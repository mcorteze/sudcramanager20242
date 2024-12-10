import React, { useState, useEffect, useRef } from 'react'; 
import { Menu } from 'primereact/menu';
import VerDepositos from '../components/Tareas/VerDepositos';
import VerTareas from '../components/Tareas/VerTareas';
import AgregarTareaForm from '../components/Tareas/AgregarTareaForm';
import PanelDeTareas from '../components/Tareas/PanelDeTareas'; // Importa el nuevo componente
import { Toast } from 'primereact/toast';
import axios from 'axios';
import './TareasPage.css';

export default function TareasPage() {
  const [selectedComponent, setSelectedComponent] = useState('');
  const [depositos, setDepositos] = useState([]); 
  const [tareas, setTareas] = useState([]); 
  const toast = useRef(null);

  useEffect(() => {
    fetchDepositos();
    fetchTareas();
  }, []);

  const fetchDepositos = async () => {
    try {
      const response = await axios.get('http://localhost:3002/obtener_depositos');
      setDepositos(response.data);
    } catch (error) {
      console.error('Error al obtener los depósitos:', error);
    }
  };

  const fetchTareas = async () => {
    try {
      const response = await axios.get('http://localhost:3002/tareas_simple');
      setTareas(response.data);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    }
  };

  const menuItems = [
    { 
      label: 'Ver Deposito', 
      icon: 'pi pi-tags', 
      command: () => setSelectedComponent('verDepositos')
    },
    { 
      label: 'Agregar Tarea', 
      icon: 'pi pi-plus', 
      command: () => setSelectedComponent('agregarTarea') 
    },
    { 
      label: 'Configurar Tareas', 
      icon: 'pi pi-list', 
      command: () => setSelectedComponent('verTareas')
    },
    { 
      label: 'Panel de Tareas', // Nuevo item de menú
      icon: 'pi pi-th-large', 
      command: () => setSelectedComponent('panelDeTareas')
    },
  ];

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'verDepositos':
        return <VerDepositos />;
      case 'agregarTarea':
        return <AgregarTareaForm depositos={depositos} fetchTareas={fetchTareas} toast={toast} />;
      case 'verTareas':
        return <VerTareas depositos={depositos} tareas={tareas} fetchTareas={fetchTareas} />;
      case 'panelDeTareas': // Caso para el nuevo panel
        return <PanelDeTareas tareas={tareas} />;
      default:
        return <div>Selecciona una opción del menú.</div>;
    }
  };

  return (
    <div className='page-full'>
      <h1>Tareas</h1>
      <div className="tareas-container">
        <div className="menu-container">
          <Menu model={menuItems} />
        </div>
        <div className="content-container">
          {renderSelectedComponent()}
        </div>
      </div>
      <Toast ref={toast} />
    </div>
  );
}
