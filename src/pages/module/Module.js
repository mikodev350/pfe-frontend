import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { Container, Col, Row, Button } from "react-bootstrap";
import SearchForm from "../../components/searchForm/SearchForm";
import ModuleTable from "../../components/moduleTable/ModuleTable";
// import AddModuleModal from "../../components/addModuleModal/AddModuleModal";
import { useParams } from "react-router-dom";
import { getToken } from "../../util/authUtils";
import { createModule } from "../../api/apiModule";
import AddModuleModal from "../../components/modelModule/AddModuleModal";

const Module = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const queryClient = useQueryClient();
  const { idParcours } = useParams();

  const handleSearch = async (value) => {
    setSearchValue(value);
  };

  const handleAddModule = async (moduleName) => {
    const token = getToken();
    try {
      await createModule({ nom: moduleName, parcour: idParcours }, token);
      queryClient.invalidateQueries(["modules", idParcours]);
      queryClient.invalidateQueries(["modules", searchValue, idParcours]);
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={8}>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
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
        token={getToken()}
      />
      <AddModuleModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleAddModule={handleAddModule}
      />
    </Container>
  );
};

export default Module;
