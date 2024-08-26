import React, { useState, useCallback } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import SearchForm from "../../components/searchForm/SearchForm";
import ModuleTable from "../../components/moduleTable/ModuleTable";
import AddModuleModal from "../../components/modelModule/AddModuleModal";
import ModelModule from "../../components/modelModule/ModelModule copy";

import { useParams } from "react-router-dom";
import { getToken } from "../../util/authUtils";
import {
  createModule,
  // syncOfflineChangesModule,
  updateModule,
} from "../../api/apiModule";
import { useQueryClient } from "react-query";
import styled from "styled-components";

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

const Module = () => {
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

  // const handleSaveModule = async (moduleData) => {
  //   try {
  //     if (initialData) {
  //       await updateModule(initialData.id, moduleData, token);
  //     } else {
  //       await createModule(moduleData, token);
  //     }

  //     queryClient.invalidateQueries(["modules", idParcours]);
  //     if (navigator.onLine && !isSyncing) {
  //       setIsSyncing(true);
  //       // await syncOfflineChangesLesson(token, queryClient);
  //       setIsSyncing(false);
  //     }
  //     setShowModal(false);
  //   } catch (error) {
  //     console.error("Error saving lesson:", error);
  //   }
  // };

  /*******************************************************************
   * ************/
  const handleSaveModule = async (moduleData) => {
    try {
      console.log("Starting handleSaveModule");
      console.log("Module Data:", moduleData);
      console.log("Initial Data:", initialData);
      console.log("Token:", token);

      if (initialData) {
        console.log("Updating existing module with ID:", initialData.id);
        await updateModule(initialData.id, moduleData, token);
        console.log("Module updated successfully.");
      } else {
        console.log("Creating new module.");
        await createModule(moduleData, token);
        console.log("Module created successfully.");
      }

      console.log("Invalidating queries for modules.");
      await queryClient.invalidateQueries(["modules", idParcours]);
      console.log(
        "----------------------------------------------------------------------"
      );

      console.log(await queryClient.invalidateQueries(["modules"]));
      console.log("Queries invalidated successfully.");
      console.log(
        "----------------------------------------------------------------------"
      );

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
      console.log("Modal closed.");
    } catch (error) {
      console.error("Error saving module:", error);
    }
  };

  /***********************************************************************************/
  return (
    <Container>
      <StyledTitle>Modules</StyledTitle>
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
      <ModuleTable
        searchValue={searchValue}
        idParcours={idParcours}
        token={token}
      />
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
