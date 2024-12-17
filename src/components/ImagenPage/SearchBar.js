import React from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchBar = ({ searchTerm, setSearchTerm, onSearch }) => {
  return (
    <div>
      <Input
        placeholder="Ingrese el número de la imagen"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: 300, marginRight: 10 }}
      />
      <Button type="primary" onClick={onSearch} icon={<SearchOutlined />}>
        Buscar
      </Button>
    </div>
  );
};

export default SearchBar;