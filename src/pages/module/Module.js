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
      <Row>
        <Col xs={12} md={8}>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Ajouter un module
          </Button>
        </Col>
        <Col xs={12} md={4}>
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
