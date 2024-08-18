import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AllDevoirs from '../../components/all-devoirs/AllDevoirs';

const Devoir = () => {
  const navigate = useNavigate();

  const handleEdit = (devoir) => {
    navigate(`/student/devoirs/modifier/${devoir.id}`);
  };

  return (
    <>
      <h1 className="my-4 text-center">Liste des Devoirs</h1>
      <AllDevoirs onEdit={handleEdit} />
    </>
  );
};

export default Devoir;
