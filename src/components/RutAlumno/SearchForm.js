import React from 'react';
import { Form, Input, Button } from 'antd';

const SearchForm = ({ onSearch }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSearch(values.rut);
    form.resetFields();
  };

  return (
    <Form form={form} layout="inline" onFinish={onFinish}>
      <Form.Item name="rut" rules={[{ required: true, message: 'Por favor ingresa el RUT' }]}>
        <Input placeholder="Ingrese RUT" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Buscar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SearchForm;
