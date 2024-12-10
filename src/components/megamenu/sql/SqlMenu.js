import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import SqlExtraccion from './SqlExtraccion';

const SqlMenu = ({ initialActiveIndex }) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  useEffect(() => {
    setActiveIndex(initialActiveIndex);
  }, [initialActiveIndex]);

  return (
    <div className="card">
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Consultas extraccion">
          {activeIndex === 0 && <SqlExtraccion />}
        </TabPanel>        
      </TabView>
    </div>
  );
};

export default SqlMenu;
