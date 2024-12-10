import React from 'react';
import { Modal, Input, Select, Button, Form, Checkbox, message } from 'antd';
import { Calendar } from 'primereact/calendar';
import moment from 'moment';
import 'moment/locale/es';
import './EditarTareaModal.css';

const { Option } = Select;

const EditarTareaModal = ({ 
  displayEditDialog, 
  closeEditDialog, 
  editingTask, 
  setEditingTask, 
  depositos, 
  saveChanges 
}) => {
  moment.locale('es');

  const validateAndSave = () => {
    const { tipo_tarea, prioridad, id_deposito, fecha_inicio, fecha_vencimiento, lunes, martes, miercoles, jueves, viernes } = editingTask;
  
    // Validación para tareas de tipo Única
    if (tipo_tarea === 'Única') {
      if (!prioridad || !id_deposito || !fecha_inicio || !fecha_vencimiento) {
        message.error('Por favor, complete todos los campos requeridos para tareas de tipo Única.');
        return;
      }
    }
  
    // Validación para tareas de tipo Frecuente
    if (tipo_tarea === 'Frecuente') {
      if (!prioridad || !id_deposito || !fecha_inicio || !fecha_vencimiento) {
        message.error('Por favor, complete todos los campos requeridos para tareas de tipo Frecuente.');
        return;
      }
  
      // Validar que al menos un día de la semana esté seleccionado
      if (!(lunes || martes || miercoles || jueves || viernes)) {
        message.error('Por favor, seleccione al menos un día de la semana para tareas de tipo Frecuente.');
        return;
      }
    }
  
    // Si todas las validaciones pasan, se configura el parámetro "configurada" y se llama a la función para guardar cambios
    const configurada = true; // Aquí configuramos configurada como true
    saveChanges({ ...editingTask, configurada });
  };
  

  return (
    <Modal
      visible={displayEditDialog}
      onCancel={closeEditDialog}
      footer={null}
      destroyOnClose
      width={800}
      style={{ height: '600px' }}
    >
      {editingTask && (
        <Form layout="vertical">
          {/* Campo Nombre de la Tarea */}
          <Form.Item label="Nombre de la Tarea">
            <Input 
              className="task-name-input" 
              value={editingTask.nombre} 
              onChange={(e) => setEditingTask({ ...editingTask, nombre: e.target.value })} 
              placeholder="Nombre de la tarea"
            />
          </Form.Item>

          {/* Sección de tipo de tarea, prioridad, depósito y fechas en un grid de 3 columnas */}
          <div className="form-grid">
            <Form.Item label="Tipo de Tarea">
              <Select
                value={editingTask.tipo_tarea}
                onChange={(value) => setEditingTask({ ...editingTask, tipo_tarea: value })}
                placeholder="Seleccionar tipo"
              >
                <Option value="Única">Única</Option>
                <Option value="Frecuente">Frecuente</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Prioridad">
              <Select
                value={editingTask.prioridad}
                onChange={(value) => setEditingTask({ ...editingTask, prioridad: value })}
                placeholder="Seleccionar prioridad"
              >
                <Option value="Baja">Baja</Option>
                <Option value="Media">Media</Option>
                <Option value="Importante">Importante</Option>
                <Option value="Urgente">Urgente</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Depósito">
              <Select
                value={editingTask.id_deposito}
                onChange={(value) => setEditingTask({ ...editingTask, id_deposito: value })}
                placeholder="Seleccionar depósito"
              >
                {depositos.map((deposito) => (
                  <Option key={deposito.id_deposito} value={deposito.id_deposito}>
                    {deposito.deposito}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Fecha de Inicio">
              <Calendar 
                value={editingTask.fecha_inicio ? new Date(editingTask.fecha_inicio) : null}
                onChange={(e) => setEditingTask({ ...editingTask, fecha_inicio: e.value })}
                placeholder="Seleccionar fecha de inicio"
                dateFormat="dd/mm/yy"
                showIcon
                firstDayOfWeek={0}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item label="Fecha de Vencimiento">
              <Calendar 
                value={editingTask.fecha_vencimiento ? new Date(editingTask.fecha_vencimiento) : null}
                onChange={(e) => setEditingTask({ ...editingTask, fecha_vencimiento: e.value })}
                placeholder="Seleccionar fecha de vencimiento"
                dateFormat="dd/mm/yy"
                showIcon
                firstDayOfWeek={1}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>

          {/* Campo Descripción de la Tarea */}
          <Form.Item label="Descripción">
            <Input 
              value={editingTask.descripcion} 
              onChange={(e) => setEditingTask({ ...editingTask, descripcion: e.target.value })} 
              placeholder="Descripción de la tarea"
            />
          </Form.Item>

          {/* Casillas de verificación para días de la semana */}
          <Form.Item label="Días de la Semana">
            <Checkbox 
              checked={editingTask.lunes} 
              onChange={(e) => setEditingTask({ ...editingTask, lunes: e.target.checked })}
            >
              Lunes
            </Checkbox>
            <Checkbox 
              checked={editingTask.martes} 
              onChange={(e) => setEditingTask({ ...editingTask, martes: e.target.checked })}
            >
              Martes
            </Checkbox>
            <Checkbox 
              checked={editingTask.miercoles} 
              onChange={(e) => setEditingTask({ ...editingTask, miercoles: e.target.checked })}
            >
              Miércoles
            </Checkbox>
            <Checkbox 
              checked={editingTask.jueves} 
              onChange={(e) => setEditingTask({ ...editingTask, jueves: e.target.checked })}
            >
              Jueves
            </Checkbox>
            <Checkbox 
              checked={editingTask.viernes} 
              onChange={(e) => setEditingTask({ ...editingTask, viernes: e.target.checked })}
            >
              Viernes
            </Checkbox>
          </Form.Item>

          {/* Botones de Guardar y Cancelar */}
          <div style={{ textAlign: 'right' }}>
            <Button onClick={closeEditDialog} style={{ marginRight: 8 }}>
              Cancelar
            </Button>
            <Button type="primary" onClick={validateAndSave}>
              Guardar
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default EditarTareaModal;
