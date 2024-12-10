import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import CargaTabla from './CargaTabla';
import PlanillaBase from './PlanillaBase';
import EmisionPlanilla from './EmisionPlanilla';

const TablaEmisionMenu = ({ initialActiveIndex }) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  useEffect(() => {
    setActiveIndex(initialActiveIndex);
  }, [initialActiveIndex]);

  return (
    <div className="card">
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Cargar tabla">
          {activeIndex === 0 && <CargaTabla />}
        </TabPanel>
        <TabPanel header="Crear planilla base">
          {activeIndex === 1 && <PlanillaBase />}
        </TabPanel>
        <TabPanel header="Emisión de planillas">
          {activeIndex === 2 && <EmisionPlanilla />}
        </TabPanel>
      </TabView>
    </div>
  );
};

export default TablaEmisionMenu;
