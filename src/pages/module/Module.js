import React, { useState, useCallback } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import SearchForm from "../../components/searchForm/SearchForm";
import ModuleTable from "../../components/moduleTable/ModuleTable";
import ModelModule from "../../components/modelModule/ModelModule copy";
import { useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";
import { getToken } from "../../util/authUtils";
import {
  createModule,
  // syncOfflineChangesModule,
  updateModule,
} from "../../api/apiModule";
import { useQueryClient } from "react-query";
import styled from "styled-components";
import { BiArrowBack } from "react-icons/bi";

// Styled Button with Gradient Background
const GradientButton = styled(Button)`
  background: linear-gradient(135deg, #10266f, #3949ab);
  border: 2px solid #10266f; /* Border matching the input */
  color: #ffffff;
  font-weight: bold;
  border-radius: 8px; /* Rounded corners to mimic input field */
  height: 50px; /* Match the height of the input */
  width: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px; /* Add padding similar to the input */
  transition: border-color 0.3s ease-in-out, background 0.3s ease-in-out,
    transform 0.2s ease-in-out;

  &:hover {
    background: linear-gradient(
      135deg,
      #3949ab,
      #10266f
    ); /* Darken the gradient on hover */
    transform: translateY(-3px);
    border-color: #3949ab; /* Match border with background on hover */
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(16, 38, 111, 0.25); /* Focus outline */
    outline: none; /* Remove default focus outline */
  }

  @media (max-width: 576px) {
    height: 45px; /* Adjust height for mobile */
    font-size: 1rem; /* Adjust font size for mobile */
    padding: 8px 16px; /* Adjust padding for mobile */
    width: 250px;
  }
`;

// Styled Title
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

// Styled Back Button Container
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
const Module = () => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [initialData, setInitialData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const { idParcours } = useParams();
  const token = React.useMemo(() => getToken(), []);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  /*******************************************************************
   * ************/
  const handleSaveModule = async (moduleData) => {
    try {
      if (initialData) {
        await updateModule(initialData.id, moduleData, token);
      } else {
        await createModule(moduleData, token);
      }

      await queryClient.invalidateQueries(["modules", idParcours]);
      console.log(await queryClient.invalidateQueries(["modules"]));

      if (navigator.onLine && !isSyncing) {
        console.log("Online and not syncing. Starting synchronization.");
        setIsSyncing(true);
        // await syncOfflineChangesModule(token, queryClient);
        setIsSyncing(false);
        console.log("Synchronization completed.");
      } else {
        console.log("Either offline or currently syncing.");
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error saving module:", error);
    }
  };

  /***********************************************************************************/
  return (
    <Container>
      <StyledTitle>Modules</StyledTitle>
      <BackButtonContainer onClick={() => navigate(-1)}>
        <BiArrowBack />
        <span>Retour</span>
      </BackButtonContainer>
      <Row>
        <Col xs={12} md={6}>
          <GradientButton onClick={() => setShowModal(true)}>
            Ajouter un module
          </GradientButton>
        </Col>
        <Col xs={12} md={6}>
          <SearchForm searchValue={searchValue} onSearch={handleSearch} />
        </Col>
      </Row>
      <div style={{ marginTop: "15px" }}>
        <ModuleTable
          searchValue={searchValue}
          idParcours={idParcours}
          token={token}
        />
      </div>
      <ModelModule
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSaveModule={handleSaveModule}
        initialData={initialData}
        parcourId={idParcours}
      />
    </Container>
  );
};

export default Module;
