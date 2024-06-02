import React, { useState } from 'react';

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  
  return (
    <div className="tabs">
      <div className="tab-list">
        {tabs.map((tab, index) => (
          <div 
            key={index}
            className={`tab ${activeTab === index ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div className={`tab-content ${activeTab === 0 ? 'slide-in-left' : 'slide-in-right'}`}>
        {tabs[activeTab].content}
      </div>
    </div>
  );
}

export default Tabs;
