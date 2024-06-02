import React, { useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import SearchForm from "../../components/searchForm/SearchForm";
import LessonTable from "../../components/lessonTable/LessonTable";
import ModelLesson from "../../components/modelLesson/ModelLesson";
import { useParams } from "react-router-dom";
import { getToken } from "../../util/authUtils";
import { createLesson } from "../../api/apiLesson";
import { useQueryClient } from "react-query";

const Lesson = () => {
  const [searchValue, setSearchValue] = useState("");
  const token = React.useMemo(() => getToken(), []);
  const { idModule } = useParams(); // Correctly use idModule from useParams
  const queryClient = useQueryClient();

  const [showAddModal, setShowAddModal] = useState(false);
  const [initialData, setInitialData] = useState(null); // Store initial data for editing

  const handleSearch = async (value) => {
    setSearchValue(value);
  };

  const handleShow = () => {
    setInitialData(null); // Clear initial data for adding new lesson
    setShowAddModal(true);
  };

  const handleClose = () => {
    setShowAddModal(false);
  };

  const handleSaveLesson = async (lessonData) => {
    try {
      await createLesson(lessonData, idModule, token); // Pass moduleId and token
      queryClient.invalidateQueries("lessons");
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
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
        moduleId={idModule}
      />
      <ModelLesson
        show={showAddModal}
        handleClose={handleClose}
        onSaveLesson={handleSaveLesson}
        initialData={initialData}
        moduleId={idModule} // Pass moduleId to the modal
      />
    </Container>
  );
};

export default Lesson;
