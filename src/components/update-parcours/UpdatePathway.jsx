import React from "react";
import AddPathwayForm from "../add-parcours/AddPathwayForm";

const UpdatePathway = ({ existingPathwayData, onSave }) => {
  return (
    <AddPathwayForm
      initialData={existingPathwayData}
      onSave={onSave}
    />
  );
};

export default UpdatePathway;
