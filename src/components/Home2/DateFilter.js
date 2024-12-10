import React from 'react';
import { DatePicker } from 'antd';

const DateFilter = ({ onChange }) => {
  const handleDateChange = (date, dateString) => {
    onChange(dateString);  // Pasar el valor seleccionado
  };

  return (
    <div>
      <DatePicker onChange={handleDateChange} style={{ width: '100%' }} />
    </div>
  );
};

export default DateFilter;
