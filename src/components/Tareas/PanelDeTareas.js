import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import axios from 'axios';
import { Table, Select } from 'antd';

const { Option } = Select;

const PanelDeTareas = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredTasks, setFilteredTasks] = useState([]);

  const onDateChange = (e) => {
    setSelectedDate(e.value);
    fetchTareasPorFecha(e.value);
  };

  const formatDateToWords = (date) => {
    if (!date) return '';
    return format(date, 'EEEE, d \'de\' MMMM \'de\' yyyy', { locale: es });
  };

  const removeAccents = (string) => {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const fetchTareasPorFecha = async (fechaSeleccionada) => {
    try {
      const diaSeleccionado = removeAccents(format(fechaSeleccionada, 'EEEE', { locale: es })).toLowerCase();
      const fechaString = fechaSeleccionada.toISOString().split('T')[0];
  
      const response = await axios.get(`http://localhost:3002/tareas_completo/${fechaString}/${diaSeleccionado}`);
  
      // Filtra los registros que tienen 'configurada' en true
      const tareasConfiguradas = response.data.filter(tarea => tarea.configurada === true);
  
      setFilteredTasks(tareasConfiguradas);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      setFilteredTasks([]);
    }
  };
  

  useEffect(() => {
    fetchTareasPorFecha(selectedDate);
  }, []);

  const columns = [
    {
      title: 'ID Tarea',
      dataIndex: 'id_tarea',
      key: 'id_tarea',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      render: (text) => text || 'Sin descripción',
    },
    {
      title: 'Tipo Tarea',
      dataIndex: 'tipo_tarea',
      key: 'tipo_tarea',
    },
    {
      title: 'ID Deposito',
      dataIndex: 'id_deposito',
      key: 'id_deposito',
    },
    {
      title: 'Deposito',
      dataIndex: 'deposito',
      key: 'deposito',
    },
    {
      title: 'Estado Tarea',
      dataIndex: 'id_estado',
      key: 'id_estado',
      render: (text, record) => (
        <Select
          defaultValue={text}
          onChange={(value) => handleStatusChange(value, record.id_tarea)}
          style={{ width: '120px' }}
        >
          <Option value={1}>Sin iniciar</Option>
          <Option value={2}>En curso</Option>
          <Option value={3}>Completada</Option>
        </Select>
      ),
    },
    {
      title: 'Prioridad',
      dataIndex: 'prioridad',
      key: 'prioridad',
    },
    {
      title: 'Fecha Actualización',
      dataIndex: 'fecha_actualizacion',
      key: 'fecha_actualizacion',
      render: (text) => 
        new Date(text).toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }),
    },    
    {
      title: 'Fecha Inicio',
      dataIndex: 'fecha_inicio',
      key: 'fecha_inicio',
      render: (text) => new Date(text).toLocaleDateString('es-ES'),
    },
    {
      title: 'Fecha Vencimiento',
      dataIndex: 'fecha_vencimiento',
      key: 'fecha_vencimiento',
      render: (text) => new Date(text).toLocaleDateString('es-ES'),
    },
  ];

  const handleStatusChange = async (newStatus, idTarea) => {
    try {
      const fechaActual = new Date();
      const fechaHora = format(fechaActual, 'yyyy-MM-dd HH:mm:ss'); // Formato sin milisegundos ni zona horaria

      const estadoTarea = {
        id_estado_tarea: null,
        id_tarea: idTarea,
        id_estado: newStatus,
        id_fecha: fechaHora, // Enviar fecha y hora en el formato deseado
      };

      await axios.post('http://localhost:3002/agregar_estado_tarea', estadoTarea);
      setFilteredTasks((prevTasks) =>
        prevTasks.map((tarea) => (tarea.id_tarea === idTarea ? { ...tarea, id_estado: newStatus } : tarea))
      );
    } catch (error) {
      console.error('Error al agregar estado de tarea:', error);
    }
  };

  return (
    <div>
      <h2>Panel de Tareas</h2>

      <div className="date-picker">
        <Calendar 
          value={selectedDate} 
          onChange={onDateChange} 
          dateFormat="mm/dd/yy"
          showIcon 
        />
      </div>

      <div className="selected-date">
        <h3>Fecha seleccionada: {formatDateToWords(selectedDate)}</h3>
      </div>

      {filteredTasks.length > 0 ? (
        <Table 
          dataSource={filteredTasks} 
          columns={columns} 
          rowKey="id_tarea" 
          pagination={false} 
        />
      ) : (
        <p>No hay tareas disponibles para esta fecha.</p>
      )}
    </div>
  );
};

export default PanelDeTareas;
