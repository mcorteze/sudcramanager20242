import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import CambiarDocente from './CambiarDocente';
import InscribirAlumno from './InscribirAlumno';
import ReenviarMailAlumno from './ReenviarMailAlumno';

const RegistrosMenu = ({ initialActiveIndex }) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  useEffect(() => {
    setActiveIndex(initialActiveIndex);
  }, [initialActiveIndex]);

  return (
    <div className="card">
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Modificar docente titular">
          {activeIndex === 0 && <CambiarDocente />}
        </TabPanel>
        <TabPanel header="Inscribir alumno en sección">
          {activeIndex === 1 && <InscribirAlumno />}
        </TabPanel>
        <TabPanel header="Reenviar correo a alumno">
          {activeIndex === 2 && <ReenviarMailAlumno />}
        </TabPanel>          
      </TabView>
    </div>
  );
};

export default RegistrosMenu;
