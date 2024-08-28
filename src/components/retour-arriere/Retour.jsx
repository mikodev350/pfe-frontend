import React from 'react'
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from 'react-icons/bi';

export default function Retour() {
      const navigate = useNavigate();

    const BackButtonContainer = styled.div`
  width: 120px !important;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 15px;
  border-radius: 20px !important; /* Rounded corners */
  cursor: pointer;
  background-color: #10266f !important; /* Blue background */
  color: white !important; /* White text color */
  border: 2px solid #10266f !important; /* Border matching the background */
  transition: background-color 0.3s ease, border-color 0.3s ease;

  svg {
    font-size: 24px !important;
    color: white !important; /* White icon color */
  }

  span {
    margin-left: 8px;
    font-weight: 500 !important;
    font-size: 18px !important;
    color: white !important; /* White text color */
  }

  &:hover {
    background-color: #0056b3 !important; /* Darker blue on hover */
    border-color: #0056b3 !important;
  }

  &:active {
    background-color: #003d80 !important; /* Even darker blue on click */
    border-color: #003d80 !important;
  }
`;
  return (
    <BackButtonContainer onClick={() => navigate(-1)}>
        <BiArrowBack />
        <span>Retour</span>
      </BackButtonContainer>
  )
}
