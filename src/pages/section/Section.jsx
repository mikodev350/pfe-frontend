import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { addSection } from "../../api/apiSection";
import { Container, Col, Row } from "react-bootstrap";
import ModelSection from "../../components/modelSection/ModelSection";

import SearchForm from "../../components/searchForm/SearchForm";
import { SectionTable } from "../../components/sectionTable/SectionTable";

const Resource = () => {

  const [searchValue, setSearchValue] = useState("");
  const queryClient = useQueryClient();

  const addSectionMutation = useMutation(name => addSection(name), {
    onSuccess: () => {
      queryClient.invalidateQueries("sections");
    },
    onError: (error) => {
      console.error("Error adding section:", error);
    },
  });

  const handleAddSection = (name) => {

    addSectionMutation.mutate(name);
  };

  const handleSearch = async (value) => {
    setSearchValue(value);
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={12} lg={8}>
          <ModelSection onAddSection={handleAddSection} />
        </Col>
        <Col xs={12} md={12} lg={4}>
          <SearchForm searchValue={searchValue} onSearch={handleSearch} />
        </Col>
      </Row>
      <SectionTable searchValue={searchValue} isArchive={false} />
    </Container>
  );
};

export default Resource;
