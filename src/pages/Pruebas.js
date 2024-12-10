import React from 'react';
import { FaCheck } from 'react-icons/fa';

import './Pruebas.css';

export default function Pruebas() {
  return (
    <div>
      <h1>Zona de pruebas</h1>
      <h3>Ejemplo de tablero y tarjetas</h3>

      <div className="tablero-container">
        <div className="tablero-base">
          <div className="tablero-titulo">
            <h2>Titulo</h2>
          </div>
          <div className="tablero-titulo-espacioinferior"></div>
          <ol className="tablero-organizador">
            <li className="tarjeta-container">
              <div className="tarjeta-txt">
                Seleccionar un indicador de logro
              </div>
            </li>
          </ol>
        </div>
      </div>

      {/* Ejemplo de botón */}
      <h3>Ejemplo de boton</h3>
      
      <button className="boton-container">
        <div className="boton-icono">
          <FaCheck />
        </div>
        <div className="boton-texto">
          <h3 className="boton-titulo">Título del botón</h3>
          <p className="boton-descripcion">Descripción del botón</p>
        </div>
      </button>

      { /* Ejemplo de flex de cards */ }
      <h3>Flex de cards</h3>
      <div className="fbcards-container">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="fbcards-card">
            <div className="fbcards-card-header">
              <span className="fbcards-card-subtitle">Subtítulo {index + 1}</span>
              <FaCheck className="fbcards-card-icon" />
            </div>
            <h3 className="fbcards-card-title">Título {index + 1}</h3>
            <p className="fbcards-card-description">Descripción breve del contenido {index + 1}.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
