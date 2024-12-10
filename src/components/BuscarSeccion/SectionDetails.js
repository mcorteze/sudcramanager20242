// SectionDetails.js
import React from 'react';
import { Row, Col, message } from 'antd';
import { FolderOpenOutlined, CopyOutlined } from '@ant-design/icons';

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    message.success('Copiado al portapapeles');
  }).catch(() => {
    message.error('Error al copiar');
  });
};

const SectionDetails = ({ data }) => (
  <div className='marco-grid'>
    {data.map((item) => (
      <div key={item.id_seccion}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <p className="titulo">ID Sección:</p>
            <p>
              {item.id_seccion}
              <CopyOutlined
                style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
                onClick={() => copyToClipboard(item.id_seccion)}
              />
            </p>
          </Col>
          <Col span={8}>
            <p className="titulo">Sede:</p>
            <p>
              {item.nombre_sede}
              <CopyOutlined
                style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
                onClick={() => copyToClipboard(item.nombre_sede)}
              />
            </p>
          </Col>
          <Col span={8}>
            <p className="titulo">Código Asignatura:</p>
            <p>
              {item.cod_asig}
              <CopyOutlined
                style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
                onClick={() => copyToClipboard(item.cod_asig)}
              />
            </p>
          </Col>
          <Col span={8}>
            <p className="titulo">Sección:</p>
            <p>
              {item.seccion}
              <CopyOutlined
                style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
                onClick={() => copyToClipboard(item.seccion)}
              />
            </p>
          </Col>
          <Col span={8}>
            <p className="titulo">RUT Docente:</p>
            <p>
              {item.rut_docente}
              <CopyOutlined
                style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
                onClick={() => copyToClipboard(item.rut_docente)}
              />
            </p>
          </Col>
          <Col span={8}>
            <p className="titulo">Nombre Docente:</p>
            <p>
              {item.nombre_doc} {item.apellidos_doc}
              <FolderOpenOutlined
                style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
                onClick={() => window.open(`/carga-docente/${item.rut_docente}`, '_blank')}
              />
              <CopyOutlined
                style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
                onClick={() => copyToClipboard(`${item.nombre_doc} ${item.apellidos_doc}`)}
              />
            </p>
          </Col>
          <Col span={8}>
            <p className="titulo">Correo Docente:</p>
            <p>
              {item.mail_doc}
              <CopyOutlined
                style={{ cursor: 'pointer', marginLeft: 8, color: '#1890ff' }}
                onClick={() => copyToClipboard(item.mail_doc)}
              />
            </p>
          </Col>
        </Row>
      </div>
    ))}
  </div>
);

export default SectionDetails;
