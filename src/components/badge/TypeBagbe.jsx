import React from "react";

// TypeBagbe component accepts a prop 'item'
const TypeBagbe = ({ item }) => {
  return <span className={`box-status box-color-${item}`}>{item}</span>;
};

export default TypeBagbe;
