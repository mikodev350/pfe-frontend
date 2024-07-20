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
  syncOfflineChangesLesson,
} from "../../api/apiLesson";
import { useQueryClient } from "react-query";

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
        await syncOfflineChangesLesson(token, queryClient);
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
        await syncOfflineChangesLesson(token, queryClient);
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
      <Row>
        <Col xs={12} md={12} lg={8}>
          <Button variant="primary" onClick={handleShowAdd}>
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
