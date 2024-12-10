import React from 'react';
import { Select } from 'antd';

const ProgramFilter = ({ options, onChange }) => {
  return (
    <div>
      <Select placeholder="Seleccionar Programa" onChange={onChange} style={{ width: '100%' }}>
        {options.map((option) => (
          <Select.Option key={option} value={option}>
            {option === 'todos' ? 'Todos los Programas' : option}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default ProgramFilter;
