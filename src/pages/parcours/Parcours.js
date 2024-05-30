import React, { useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import SearchForm from "../../components/searchForm/SearchForm";
import { ParcoursTable } from "../../components/parcoursTable/ParcoursTable";
import { Link } from "react-router-dom";
import { getToken } from "../../util/authUtils";

const Parcours = () => {
  const [searchValue, setSearchValue] = useState("");
  const token = React.useMemo(() => getToken(), []);

  const handleSearch = async (value) => {
    setSearchValue(value);
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={12} lg={8}>
          <Row style={{ marginTop: "10px" }}>
            <Link to={`/student/new-parcour`}>
              <Button variant="primary" className="button-dashboard btn-color">
                <span className="button-span-size btn-write-white">
                  Add resource
                </span>
              </Button>
            </Link>
          </Row>
        </Col>
        <Col xs={12} md={12} lg={4}>
          <SearchForm searchValue={searchValue} onSearch={handleSearch} />
        </Col>
      </Row>
      <ParcoursTable searchValue={searchValue} token={token} />
    </Container>
  );
};

export default Parcours;
