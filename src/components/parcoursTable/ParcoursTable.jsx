import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import PaginationComponent from "../pagination/Pagination";
import { useQuery, useQueryClient } from "react-query";
import { fetchParcours, deletePathway, updatePathway } from "../../api/ApiParcour";
import db from "../../database/database";
import { format, parseISO } from "date-fns";
import CardIconeParcours from "../table/CardIconeParcours";
import styled from "styled-components";

const GradientCard = styled(Card)`
  border-radius: 15px;
  overflow: hidden;
  background: linear-gradient(135deg, #e0e5ec, #f7f9fc); /* Dégradé clair */
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.05), -8px -8px 16px rgba(255, 255, 255, 0.7);
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.1), -10px -10px 20px rgba(255, 255, 255, 0.8);
  }
`;

const CardBodyStyled = styled(Card.Body)`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardDetails = styled.div`
  flex: 1;
  margin-right: 15px;
`;

const TitleStyled = styled.h5`
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: #333; /* Titre sombre */
`;

const TextStyled = styled.p`
  margin: 5px 0;
  color: #555; /* Texte en gris moyen pour un bon contraste */
  font-size: 0.95rem;
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
    <Container>
      <Row>
        {data.data.map((item) => (
          <Col key={item.id} xs={12} md={6} lg={4} className="mb-4">
            <GradientCard>
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
            </GradientCard>
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
