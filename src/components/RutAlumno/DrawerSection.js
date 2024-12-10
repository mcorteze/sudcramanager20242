import React from 'react';
import { Drawer, Form, Select, Button } from 'antd';

const DrawerSection = ({ visible, onClose, setSelectedSede, setSelectedAsignatura, idMatricula }) => {
  const handleOk = () => {
    // lógica para manejar el OK, por ejemplo, para obtener el valor de los select
    onClose();
  };

  return (
    <Drawer title="Seleccionar Sede y Asignatura" visible={visible} onClose={onClose}>
      <Form layout="vertical">
        <Form.Item label="Sede" name="sede">
          <Select onChange={setSelectedSede}>
            <Select.Option value="sede1">Sede 1</Select.Option>
            <Select.Option value="sede2">Sede 2</Select.Option>
            {/* Otras opciones */}
          </Select>
        </Form.Item>
        <Form.Item label="Asignatura" name="asignatura">
          <Select onChange={setSelectedAsignatura}>
            <Select.Option value="asignatura1">Asignatura 1</Select.Option>
            <Select.Option value="asignatura2">Asignatura 2</Select.Option>
            {/* Otras opciones */}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleOk}>
            Aceptar
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default DrawerSection;
