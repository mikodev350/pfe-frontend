import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { Container, Col, Row } from "react-bootstrap";
import SearchForm from "../../components/searchForm/SearchForm";
import ModuleTable from "../../components/moduleTable/ModuleTable";
import { useParams } from "react-router-dom";
import { getToken } from "../../util/authUtils";

const Module = () => {
  const [searchValue, setSearchValue] = useState("");
  const queryClient = useQueryClient();
  const { idParcours } = useParams();

  const handleSearch = async (value) => {
    setSearchValue(value);
  };

  const token = React.useMemo(() => getToken(), []);

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
      <ModuleTable
        searchValue={searchValue}
        idParcours={idParcours}
        token={token}
      />
    </Container>
  );
};

export default Module;
