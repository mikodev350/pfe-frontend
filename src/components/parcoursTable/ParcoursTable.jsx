import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import PaginationComponent from "../pagination/Pagination";
import { useQuery, useQueryClient } from "react-query";
import { fetchParcours, deletePathway, updatePathway } from "../../api/ApiParcour";
import db from "../../database/database";
import { format, parseISO } from "date-fns";
import CardIconeParcours from "../table/CardIconeParcours";
import styled from "styled-components";

const StyledCard = styled(Card)`
  border-radius: 20px;
  background-color: #ffffff !important;
  border: 1px solid #10266F;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0px 15px 40px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    height: auto; /* Let the height adjust based on content */
  }

  @media (max-width: 576px) {
    border-radius: 15px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
    padding: 15px; /* Reduced padding for mobile */
    width: 100%; /* Take full width on mobile */
  }
`;

const CardBodyStyled = styled(Card.Body)`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 576px) {
    padding: 15px; /* Adjust padding on smaller screens */
    flex-direction: column; /* Stack items vertically on mobile */
    align-items: flex-start; /* Align items to the start */
  }
`;

const CardDetails = styled.div`
  flex: 1;
  margin-right: 15px;
`;

const TitleStyled = styled.h5`
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: #10266F !important;

  @media (max-width: 576px) {
    font-size: 1.1rem; /* Adjust font size on mobile */
  }
`;

const TextStyled = styled.p`
  margin: 5px 0;
  color: #555;
  font-size: 0.95rem;

  @media (max-width: 576px) {
    font-size: 0.9rem; /* Adjust font size on mobile */
  }
`;

export const ParcoursTable = ({ searchValue, token }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery(
    ["parcours", currentPage, searchValue],
    () => fetchParcours(currentPage, searchValue, token),
    {
      keepPreviousData: true,
      onSuccess: async (data) => {
        await db.parcours.bulkPut(data.data);
      },
      onError: async () => {
        const localData = await db.parcours
          .filter((parcour) => parcour.nom.includes(searchValue))
          .offset((currentPage - 1) * pageSize)
          .limit(pageSize)
          .toArray();
        return { data: localData, totalPages: Math.ceil(localData.length / pageSize) };
      }
    }
  );

  useEffect(() => {
    refetch();
  }, [currentPage, searchValue, token, refetch]);

  const handleDelete = async (id) => {
    try {
      const response = await deletePathway(id, token);
      if (response.status === "success" || response.status === "offline") {
        refetch();
      }
    } catch (error) {
      console.error("Error deleting pathway:", error);
    }
  };

  const handleUpdate = async (id, updatedPathway) => {
    try {
      const response = await updatePathway(id, updatedPathway, token);
      if (response.status === "success" || response.status === "offline") {
        queryClient.setQueryData(["parcours", currentPage, searchValue], (oldData) => {
          const newData = oldData.data.map((item) => (item.id === id ? response.data : item));
          return { ...oldData, data: newData };
        });
      }
    } catch (error) {
      console.error("Error updating pathway:", error);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isError) {
    return <div>Erreur lors de la récupération des données : {error.message}</div>;
  }


 return (
    <Container style={{ marginTop: "15px" }}>
      <Row>
        {data.data.map((item) => (
          <Col key={item.id} xs={12} md={6} lg={4} className="mb-4">
            <StyledCard>
              <CardBodyStyled>
                <CardDetails>
                  <TitleStyled>{item.nom}</TitleStyled>
                  <TextStyled>
                    <strong>Type :</strong> {item.type}
                    <br />
                    <strong>Date :</strong> {item.createdAt ? format(parseISO(item.createdAt), "dd-MM-yyyy") : "N/A"}
                  </TextStyled>
                </CardDetails>
                <CardIconeParcours parcoursId={item.id} parcoursName={item.nom} />
              </CardBodyStyled>
            </StyledCard>
          </Col>
        ))}
      </Row>
      <PaginationComponent
        currentPage={currentPage}
        totalPages={data.totalPages}
        onPageChange={setCurrentPage}
      />
    </Container>
  );
};
