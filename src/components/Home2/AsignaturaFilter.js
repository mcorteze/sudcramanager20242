import React from 'react';
import { Select } from 'antd';

const AsignaturaFilter = ({ options, onChange }) => {
  return (
    <div>
      <Select placeholder="Seleccionar Asignatura" onChange={onChange} style={{ width: '100%' }}>
        {options.map((option) => (
          <Select.Option key={option} value={option}>
            {option === 'todas' ? 'Todas las Asignaturas' : option}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default AsignaturaFilter;
