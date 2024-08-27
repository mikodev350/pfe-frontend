import React, { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import SearchForm from "../../components/searchForm/SearchForm";
import LessonTable from "../../components/lessonTable/LessonTable";
import ModelLesson from "../../components/modelLesson/ModelLesson";
import { useParams } from "react-router-dom";
import { getToken } from "../../util/authUtils";
import {
  createLesson,
  updateLesson,
  // syncOfflineChangesLesson,
} from "../../api/apiLesson";
import { useQueryClient } from "react-query";
import styled from "styled-components";

// Styled Button with Gradient Background
const GradientButton = styled(Button)`
  background: linear-gradient(135deg, #10266f, #3949ab);
  border: 2px solid #10266f;
  color: #ffffff;
  font-weight: bold;
  border-radius: 8px;
  height: 50px;
  width: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  transition: border-color 0.3s ease-in-out, background 0.3s ease-in-out,
    transform 0.2s ease-in-out;

  &:hover {
    background: linear-gradient(135deg, #3949ab, #10266f);
    transform: translateY(-3px);
    border-color: #3949ab;
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(16, 38, 111, 0.25);
    outline: none;
  }

  @media (max-width: 576px) {
    height: 45px;
    font-size: 1rem;
    padding: 8px 16px;
    width: 250px;
  }
`;

// Styled Title
const StyledTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #10266f;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-bottom: 2px solid #3949ab;
  padding-bottom: 0.5rem;
`;

const Lesson = () => {
  const [searchValue, setSearchValue] = useState("");
  const token = React.useMemo(() => getToken(), []);
  const { idModule } = useParams();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSearch = async (value) => {
    setSearchValue(value);
  };

  const handleShowAdd = () => {
    setInitialData(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSaveLesson = async (lessonData) => {
    try {
      if (initialData) {
        await updateLesson(initialData.id, lessonData, token);
      } else {
        await createLesson(lessonData, token);
      }
      queryClient.invalidateQueries([
        "lessons",
        { searchValue, moduleId: idModule, currentPage: 1 },
      ]);
      if (navigator.onLine && !isSyncing) {
        setIsSyncing(true);
        // await syncOfflineChangesLesson(token, queryClient);
        setIsSyncing(false);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving lesson:", error);
    }
  };

  useEffect(() => {
    const handleOnline = async () => {
      if (!isSyncing) {
        setIsSyncing(true);
        // await syncOfflineChangesLesson(token, queryClient);
        queryClient.invalidateQueries([
          "lessons",
          { searchValue, moduleId: idModule, currentPage: 1 },
        ]);
        setIsSyncing(false);
      }
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [token, queryClient, isSyncing]);

  const handleEdit = (lesson) => {
    setInitialData(lesson);
    setShowModal(true);
  };

  return (
    <Container>
      <StyledTitle>Leçons</StyledTitle>
      <Row>
        <Col xs={12} md={6}>
          <GradientButton onClick={handleShowAdd}>
            Ajouter une leçon
          </GradientButton>
        </Col>
        <Col xs={12} md={6}>
          <SearchForm searchValue={searchValue} onSearch={handleSearch} />
        </Col>
      </Row>
      <LessonTable
        searchValue={searchValue}
        token={token}
        moduleId={idModule}
        onEditLesson={handleEdit}
      />
      <ModelLesson
        show={showModal}
        handleClose={handleClose}
        onSaveLesson={handleSaveLesson}
        initialData={initialData}
        moduleId={idModule}
      />
    </Container>
  );
};

export default Lesson;
