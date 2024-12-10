import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import SapDocente from './SapDocente';
import SapIndice from './SapIndice';
import SapInscripcion from './SapInscripcion';
import SapSabana from './SapSabana';
import SapInstrucciones from './SapInstrucciones';

const SapMenu = ({ initialActiveIndex }) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  useEffect(() => {
    setActiveIndex(initialActiveIndex);
  }, [initialActiveIndex]);

  return (
    <div className="card">
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Instrucciones">
          {activeIndex === 0 && <SapInstrucciones />}
        </TabPanel>
        <TabPanel header="Docente">
          {activeIndex === 1 && <SapDocente />}
        </TabPanel>
        <TabPanel header="Indice">
          {activeIndex === 2 && <SapIndice />}
        </TabPanel>
        <TabPanel header="Inscripcion">
          {activeIndex === 3 && <SapInscripcion />}
        </TabPanel>
        <TabPanel header="Sabana">
          {activeIndex === 4 && <SapSabana />}
        </TabPanel>
      </TabView>
    </div>
  );
};

export default SapMenu;
