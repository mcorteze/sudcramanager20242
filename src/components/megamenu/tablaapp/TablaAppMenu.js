import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import TablaApp from './TablaApp';

const TablaAppMenu = ({ initialActiveIndex }) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  useEffect(() => {
    setActiveIndex(initialActiveIndex);
  }, [initialActiveIndex]);

  return (
    <div className="card">
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="App de validación">
          {activeIndex === 0 && <TablaApp />}
        </TabPanel>
      </TabView>
    </div>
  );
};

export default TablaAppMenu;
