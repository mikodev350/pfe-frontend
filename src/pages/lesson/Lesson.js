import React, { useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import SearchForm from "../../components/searchForm/SearchForm";
import LessonTable from "../../components/lessonTable/LessonTable";
import { useParams } from "react-router-dom";
import { getToken } from "../../util/authUtils";

const Lesson = () => {
  const [searchValue, setSearchValue] = useState("");
  const token = React.useMemo(() => getToken(), []);
  const { idModule } = useParams(); // Correctly use idModule from useParams

  const handleSearch = async (value) => {
    setSearchValue(value);
  };

  const handleShow = () => {
    // Define handleShow logic
    console.log("Show modal logic here");
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={12} lg={8}>
          <Button variant="primary" onClick={handleShow}>
            Ajouter une leçon
          </Button>
        </Col>
        <Col xs={12} md={12} lg={4}>
          <SearchForm searchValue={searchValue} onSearch={handleSearch} />
        </Col>
      </Row>
      <LessonTable
        searchValue={searchValue}
        token={token}
        idModule={idModule}
      />
    </Container>
  );
};

export default Lesson;
