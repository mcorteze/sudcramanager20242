import React from 'react';
import { Select } from 'antd';

const SedeFilter = ({ options, onChange }) => {
  return (
    <div>
      <Select placeholder="Seleccionar Sede" onChange={onChange} style={{ width: '100%' }}>
        {options.map((option) => (
          <Select.Option key={option} value={option}>
            {option === 'todas' ? 'Todas las Sedes' : option}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default SedeFilter;
