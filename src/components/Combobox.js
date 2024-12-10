import React from 'react';
import './Combobox.css'

const Combobox = ({ label, id, value, onChange, options }) => {
  return (
    <div className='combobox-container'>
      <label htmlFor={id} className='label-combobox'>{label}</label>
      <select id={id} onChange={onChange} value={value}>
        <option value="">Seleccione una opción</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Combobox;
