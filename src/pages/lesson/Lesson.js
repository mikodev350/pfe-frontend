import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { addLesson, updateLesson } from "../../api/apiLesson";
import { Container, Col, Row, Button } from "react-bootstrap";
import ModelLesson from "../../components/modelLesson/ModelLesson";
import SearchForm from "../../components/searchForm/SearchForm";
import LessonTable from "../../components/lessonTable/LessonTable";

const Lesson = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const queryClient = useQueryClient();

  const addLessonMutation = useMutation((lesson) => addLesson(lesson), {
    onSuccess: () => {
      queryClient.invalidateQueries("lessons");
    },
    onError: (error) => {
      console.error("Error adding lesson:", error);
    },
  });

  const updateLessonMutation = useMutation((lesson) => updateLesson(lesson), {
    onSuccess: () => {
      queryClient.invalidateQueries("lessons");
    },
    onError: (error) => {
      console.error("Error updating lesson:", error);
    },
  });

  const handleAddLesson = (lesson) => {
    addLessonMutation.mutate(lesson);
  };

  const handleUpdateLesson = (lesson) => {
    updateLessonMutation.mutate(lesson);
  };

  const handleSaveLesson = (lesson) => {
    if (currentLesson) {
      handleUpdateLesson({ ...currentLesson, ...lesson });
    } else {
      handleAddLesson(lesson);
    }
  };

  const handleSearch = async (value) => {
    setSearchValue(value);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentLesson(null);
  };

  const handleShow = (lesson = null) => {
    setCurrentLesson(lesson);
    setShowModal(true);
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={12} lg={8}>
          <Button variant="primary" onClick={() => handleShow()}>
            Ajouter une leçon
          </Button>
          <ModelLesson
            show={showModal}
            handleClose={handleClose}
            onSaveLesson={handleSaveLesson}
            initialData={currentLesson}
          />
        </Col>
        <Col xs={12} md={12} lg={4}>
          <SearchForm searchValue={searchValue} onSearch={handleSearch} />
        </Col>
      </Row>
      <LessonTable searchValue={searchValue} onEditLesson={handleShow} />
    </Container>
  );
};

export default Lesson;
