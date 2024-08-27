import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AllDevoirs from '../../components/all-devoirs/AllDevoirs';
import styled from 'styled-components';

const Devoir = () => {
  const navigate = useNavigate();

  const handleEdit = (devoir) => {
    navigate(`/dashboard/devoirs/modifier/${devoir.id}`);
  };
const StyledTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #10266f;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-bottom: 2px solid #3949ab;
  padding-bottom: 0.5rem;
`;
  return (
    <>
                    <StyledTitle>Liste des Devoirs</StyledTitle>

      <AllDevoirs onEdit={handleEdit} />
    </>
  );
};

export default Devoir;
