// src/components/home/GraficoBarras.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { ResponsiveContainer } from 'recharts';

export default function GraficoBarras({ chartData, asignaturas, colors }) {
  return (
    <div>
      <h3>Resumen de Evaluaciones por Día (últimos 14 días)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
          <YAxis />
          <Tooltip />
          <Legend />
          {asignaturas.map(cod_asig => (
            <Bar key={cod_asig} dataKey={cod_asig} stackId="a" fill={colors[cod_asig]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
