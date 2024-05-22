import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Container, Col, Row } from "react-bootstrap";
import ModelModule from "../../components/modelModule/ModelModule"; // Remplacez ModelSection par ModelModule
import SearchForm from "../../components/searchForm/SearchForm";
import ModuleTable from "../../components/moduleTable/ModuleTable"; // Remplacez SectionTable par ModuleTable
import { useParams } from "react-router-dom";

const Module = () => {
  const [searchValue, setSearchValue] = useState("");
  const queryClient = useQueryClient();
  const { idParcours } = useParams();

  // const addModuleMutation = useMutation((name) => addModule(name), {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries("modules");
  //   },
  //   onError: (error) => {
  //     console.error("Error adding module:", error);
  //   },
  // });

  // const handleAddModule = (name) => {
  //   addModuleMutation.mutate(name);
  // };

  const handleSearch = async (value) => {
    setSearchValue(value);
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={12} lg={8}>
          {/* <ModelModule onAddModule={handleAddModule} /> */}
        </Col>
        <Col xs={12} md={12} lg={4}>
          <SearchForm searchValue={searchValue} onSearch={handleSearch} />
        </Col>
      </Row>
      <ModuleTable searchValue={searchValue} idParcours={idParcours} />
    </Container>
  );
};

export default Module;
