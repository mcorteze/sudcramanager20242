// SeccionesPendientesPage.js
import React from 'react';
import InformesPorDesbloquear from '../components/SeccionesPendientes/InformesPorDesbloquear';
import SeccionesMailPendientes from '../components/SeccionesPendientes/SeccionesMailPendientes';
import MailPendientesAlumnos from '../components/SeccionesPendientes/MailPendientesAlumnos ';

export default function SeccionesPendientesPage() {
  return (
    <div className='page-full'>
      <h1>Secciones pendientes de aprobación</h1>
      <h3>Requiere aprobación para ser enviados en la próxima campaña de mailing.</h3>
      { /* Registro de informes que requieren desbloqueo para efectuar campaña de mailing de secciones y alumnos */ }
      <InformesPorDesbloquear />
      {/* Registros de informes de seccion que fueron emitidos pero no fueron enviados por alguún motivo */ }
      <SeccionesMailPendientes />
      <MailPendientesAlumnos  />
    </div>
  );
}
