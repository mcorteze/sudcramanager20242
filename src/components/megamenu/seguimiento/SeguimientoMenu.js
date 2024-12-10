import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import SeguimientoPlanilla from './SeguimientoPlanilla';
import SeguimientoHoja from './SeguimientoHoja';

const SeguimientoMenu = ({ initialActiveIndex }) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  useEffect(() => {
    setActiveIndex(initialActiveIndex);
  }, [initialActiveIndex]);

  return (
    <div className="card">
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Seguimiento de planilla">
          {activeIndex === 0 && <SeguimientoPlanilla />}
        </TabPanel>
        <TabPanel header="Seguimiento de hoja de respuesta">
          {activeIndex === 1 && <SeguimientoHoja />}
        </TabPanel>       
      </TabView>
    </div>
  );
};

export default SeguimientoMenu;
