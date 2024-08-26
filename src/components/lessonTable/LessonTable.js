import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  fetchLessons,
  updateLesson,
  deleteLesson,
  syncOfflineChangesLesson,
} from "../../api/apiLesson";
import Loader from "../loader/Loader";
import { Card, Container, Row, Col } from "react-bootstrap";
import PaginationComponent from "../pagination/Pagination";
import { parseISO, format } from "date-fns";
import styled from "styled-components";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { BiEdit, BiTrash } from "react-icons/bi";

// Updated styled components for a modern look
const LessonCard = styled(Card)`
  border-radius: 15px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #e3f2fd,
    #bbdefb
  ); /* Soft blue gradient */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
  border: none; /* Remove border for a cleaner look */

  &:hover {
    transform: translateY(-5px); /* Lift effect on hover */
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2); /* Enhanced shadow on hover */
  }
`;

const LessonCardBody = styled(Card.Body)`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LessonDetails = styled.div`
  flex: 1;
`;

const LessonTitle = styled.h5`
  margin: 0;
  font-size: 1.3rem;
  font-weight: bold;
  color: #0d47a1; /* Deep blue for contrast */
`;

const LessonText = styled.p`
  margin: 5px 0;
  color: #424242; /* Dark grey for readability */
  font-size: 1rem;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 10px;
  font-size: 1.3rem;

  .icon {
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    background-color: #ffffff; /* White background for icons */
    color: #424242;
    transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease;

    &:hover {
      transform: scale(1.1);
      background-color: #0d47a1; /* Blue background on hover */
      color: #ffffff; /* White icon color on hover */
    }
  }
`;

const LessonTable = ({ searchValue, token, moduleId, onEditLesson }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);
  const queryClient = useQueryClient();

  const fetchLessonsMemoized = useCallback(
    async (page, search) => {
      const response = await fetchLessons(page, token, search, moduleId);
      console.log("Fetched Lessons: ", response.data);
      return response;
    },
    [token, moduleId]
  );

  const { data, isLoading, isError, error, refetch } = useQuery(
    ["lessons", { searchValue, moduleId, currentPage }],
    () => fetchLessonsMemoized(currentPage, searchValue),
    {
      keepPreviousData: true,
      onSuccess: (response) => {
        console.log("Query onSuccess: ", response);
        setTotalPages(response.totalPages);
      },
    }
  );

  useEffect(() => {
    console.log("Refetching query");
    refetch();
  }, [currentPage, searchValue, token, refetch]);

  const updateLessonMutation = useMutation(
    async (data) => {
      await updateLesson(data.id, { nom: data.name }, token);
      await queryClient.invalidateQueries([
        "lessons",
        { searchValue, moduleId, currentPage },
      ]);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "lessons",
          { searchValue, moduleId, currentPage },
        ]);
      },
      onError: (error) => {
        toast.error(
          `Erreur lors de la mise à jour de la leçon : ${error.message}`
        );
      },
    }
  );

  const deleteLessonMutation = useMutation(
    async (lessonId) => {
      await deleteLesson(lessonId, token);
      await queryClient.invalidateQueries([
        "lessons",
        { searchValue, moduleId, currentPage },
      ]);
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries([
          "lessons",
          { searchValue, moduleId, currentPage },
        ]);
        toast.success("Leçon supprimée avec succès !");
        if (navigator.onLine) {
          await syncOfflineChangesLesson(token, queryClient);
        }
      },
      onError: (error) => {
        toast.error(
          `Erreur lors de la suppression de la leçon : ${error.message}`
        );
      },
    }
  );

  const handleUpdateLesson = async (lessonId, newName) => {
    try {
      console.log("Updating lesson:", lessonId, newName);
      await updateLessonMutation.mutateAsync({ id: lessonId, name: newName });
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };

  const handleDelete = (lessonId) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas annuler cette action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimez-la!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLessonMutation.mutate(lessonId);
      }
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div>Erreur lors de la récupération des données : {error.message}</div>
    );
  }

  console.log("Data fetched: ", data?.data);

  return (
    <Container>
      <Row>
        {data?.data.map((item, index) => (
          <Col key={item.id} xs={12} md={6} lg={4} className="mb-4">
            <LessonCard>
              <LessonCardBody>
                <LessonDetails>
                  <LessonTitle>{item.nom}</LessonTitle>
                  <LessonText>
                    <strong>Date :</strong>{" "}
                    {item.createdAt
                      ? format(parseISO(item.createdAt), "dd-MM-yyyy")
                      : "N/A"}
                  </LessonText>
                </LessonDetails>
                <IconContainer>
                  <BiEdit className="icon" onClick={() => onEditLesson(item)} />
                  <BiTrash
                    className="icon"
                    onClick={() => handleDelete(item.id)}
                  />
                </IconContainer>
              </LessonCardBody>
            </LessonCard>
          </Col>
        ))}
      </Row>
      <PaginationComponent
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default LessonTable;
