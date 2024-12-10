// EstadisticasPage.js
import React from 'react';
import EstadisticasAsignatura from '../components/Estadisticas/EstadisticasAsignatura';
import EstadisticasEvaluacion from '../components/Estadisticas/EstadisticasEvaluacion';

export default function EstadisticasPage() {
  return (
    <div>
      <h1>Estadísticas</h1>
      <EstadisticasAsignatura />
      <h1>Estadísticas por Evaluación</h1>
      <EstadisticasEvaluacion />
    </div>
  );
}
