import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const CustomYAxisTick = ({ x, y, payload }) => (
  <text
    x={x}
    y={y}
    dy={4} // Ajuste vertical
    fontSize={12} // Tamaño de fuente
    fill="#000" // Color de texto
    textAnchor="end" // Alineación del texto
  >
    {payload.value}
  </text>
);

const HorizontalBarChartComponent = ({ data }) => {
  const sedeCounts = data.reduce((acc, item) => {
    acc[item.nombre_sede] = (acc[item.nombre_sede] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(sedeCounts).map(sede => ({
    name: sede,
    value: sedeCounts[sede],
  }));

  return (
    <div style={{ width: '100%', height: '100%', padding: '10px' }}>
      <h3>Total de procesos por sede</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            tick={<CustomYAxisTick />} // Usando componente personalizado
            interval={0}
          />
          <Tooltip />
          
          <Bar dataKey="value" fill="#82ca9d" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HorizontalBarChartComponent;
