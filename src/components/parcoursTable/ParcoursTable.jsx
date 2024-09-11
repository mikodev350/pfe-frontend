import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
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
    height: auto;
  }

  @media (max-width: 576px) {
    border-radius: 15px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
    padding: 15px;
    width: 100%;
  }
`;

const CardBodyStyled = styled(Card.Body)`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 576px) {
    padding: 15px;
    flex-direction: column;
    align-items: flex-start;
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
    font-size: 1.1rem;
  }
`;

const TextStyled = styled.p`
  margin: 5px 0;
  color: #555;
  font-size: 0.95rem;

  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
`;

export const ParcoursTable = ({ searchValue, token }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const queryClient = useQueryClient();
   
  // Gestion de la connexion avec useQuery
  const { data, isLoading, isError, error, refetch } = useQuery(
    ["parcours", currentPage, searchValue],
    () => fetchParcours(currentPage, searchValue, token),
    {
      keepPreviousData: true,
       refetchOnWindowFocus: true, // Rafraîchit les données quand la fenêtre est refocalisée
    refetchOnReconnect: true, // Rafraîchit les données quand la connexion est rétablie
        refetchInterval: 500, // Rafraîchit toutes les 5 secondes (optionnel)

      onSuccess: async (data) => {
        // Stocker les parcours dans IndexedDB
        await db.parcours.bulkPut(data.data);
      },
      onError: async () => {
        // Récupérer les parcours hors ligne depuis IndexedDB
        const localData = await db.parcours
          .filter((parcour) => parcour.nom.includes(searchValue))
          .offset((currentPage - 1) * pageSize)
          .limit(pageSize)
          .toArray();
        return { data: localData, totalPages: Math.ceil(localData.length / pageSize) };
      }
    }
  );

  // Gestion de la reconnexion
  useEffect(() => {
    const handleOnline = async () => {
      // Lorsque la connexion est rétablie, on rafraîchit les données
      await refetch();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [refetch]);

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
    return <div><Spinner /></div>;
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
