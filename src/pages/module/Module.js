import React, { useState, useCallback } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import SearchForm from "../../components/searchForm/SearchForm";
import ModuleTable from "../../components/moduleTable/ModuleTable";
import AddModuleModal from "../../components/modelModule/AddModuleModal";
import ModelModule from "../../components/modelModule/ModelModule copy";

import { useParams } from "react-router-dom";
import { getToken } from "../../util/authUtils";
import { createModule, updateModule } from "../../api/apiModule";
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

  /*******************************************************************************/
  const handleSaveModule = async (moduleData) => {
    try {
      console.log("Initial Data:", initialData);
      console.log("Module Data:", moduleData);

      if (initialData) {
        console.log("Updating module...");
        await updateModule(initialData.id, moduleData, token);
      } else {
        console.log("Creating new module...");
        await createModule(moduleData, token);
      }

      console.log("Invalidating queries...");
      await queryClient.invalidateQueries(["modules", idParcours]);
      console.log("Queries invalidated.");

      if (navigator.onLine && !isSyncing) {
        setIsSyncing(true);
        // await syncOfflineChangesLesson(token, queryClient);
        console.log("Syncing changes...");
        setIsSyncing(false);
      }

      setShowModal(false);
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
