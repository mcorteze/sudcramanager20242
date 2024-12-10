import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChartComponent = ({ data }) => {
  // Contar ocurrencias por programa
  const programCounts = data.reduce((acc, item) => {
    acc[item.programa] = (acc[item.programa] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(programCounts).map(program => ({
    name: program,
    value: programCounts[program],
  }));

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={chartData}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, value }) => `${name}: ${value}`}
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PieChartComponent;
