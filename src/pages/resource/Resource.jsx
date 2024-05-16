import React, { useState } from "react";
import { Row, Container, Col, Button } from "react-bootstrap";

// import "./Exam.css";
import { Link, useParams } from "react-router-dom";
import SearchForm from "../../components/searchForm/SearchForm";
import ResourceTable from "../../components/resourceTable/ResourceTable";


const Resource = () => {
  const [searchValue, setSearchValue] = useState("");
  const handleSearch = async (value) => {
    setSearchValue(value);
  };
  const { section } = useParams();

  return (
    <Container>
      <Row>
        <Row style={{ marginTop: "10px" }}>
          <Col xs={12} md={12} lg={8}>
            <Link to={`/student/new-resource?sectionId=${section}`}>
              <Button variant="primary" className="button-dashboard btn-color">
                <span className="button-span-size btn-write-white">Add resource </span>
              </Button>
            </Link>
            
          </Col>
          <Col xs={12} md={12} lg={4}>
            <SearchForm searchValue={searchValue} onSearch={handleSearch} />
          </Col>
        </Row>
      </Row>
      <ResourceTable searchValue={searchValue} />
    </Container>
  );
};

export default Resource;
