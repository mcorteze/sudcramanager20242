// SearchSection.js
import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

const SearchSection = ({ idSeccion, onSearch, onChange }) => (
  <Search
    placeholder="Ingrese ID de sección..."
    onSearch={onSearch}
    enterButton
    style={{ width: 300, marginBottom: 20 }}
    value={idSeccion}
    onChange={onChange}
  />
);

export default SearchSection;
