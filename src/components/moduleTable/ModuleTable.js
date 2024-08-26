import React, { useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { fetchModules, updateModule } from "../../api/apiModule";
import Loader from "../loader/Loader";
import { Card, Container, Row, Col } from "react-bootstrap";
import CardIconeModule from "../table/CardIconeModule";
import PaginationComponent from "../pagination/Pagination";
import { parseISO, format } from "date-fns";
import styled from "styled-components";

const CustomCard = styled(Card)`
  border-radius: 15px;
  overflow: hidden;
  background-color: white !important;
  height: 100%; /* Make the card take full height of the container */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: #ffffff;
  position: relative;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 60%;
    height: 100%;
    background: linear-gradient(135deg, #10266f 0%, #3454d1 100%);
    clip-path: polygon(100% 0, 0% 100%, 100% 100%);
    z-index: 0;
    transition: all 0.3s ease;
  }

  &:hover:before {
    clip-path: polygon(100% 0, 20% 100%, 100% 100%);
  }

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 576px) {
    padding: 10px;
    border-radius: 10px;
  }
`;

const CustomCardBody = styled(Card.Body)`
  padding: 25px;
  position: relative;
  z-index: 1;
  color: #333;

  @media (max-width: 576px) {
    padding: 15px;
  }
`;

const ModuleTitle = styled(Card.Title)`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: inherit;

  @media (max-width: 576px) {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
  }
`;

const ModuleText = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
  color: #555;

  @media (max-width: 576px) {
    font-size: 0.9rem;
    margin-bottom: 15px;
  }
`;

const ModuleTable = ({ searchValue, idParcours, token }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);
  const queryClient = useQueryClient();

  const fetchModulesMemoized = useCallback(
    async (page, search) => {
      const response = await fetchModules(page, token, search, idParcours);
      return response;
    },
    [token, idParcours]
  );

  const { data, isLoading, isError, error, refetch } = useQuery(
    ["modules", searchValue, idParcours, currentPage],
    () => fetchModulesMemoized(currentPage, searchValue),
    {
      keepPreviousData: true,
      onSuccess: (response) => {
        setTotalPages(response.totalPages);
      },
    }
  );

  useEffect(() => {
    refetch(); // Recharger les données après changement de page ou de filtre
  }, [currentPage, searchValue, refetch, token]);

  useEffect(() => {
    const handleOnline = async () => {
      try {
        // await syncOfflineChangesModule(token, queryClient);
        await queryClient.invalidateQueries([
          "modules",
          searchValue,
          idParcours,
        ]);
        refetch(); // Recharger les données après synchronisation
      } catch (error) {
        console.error("Error syncing offline changes:", error);
      }
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [token, queryClient, searchValue, idParcours, refetch]);

  const updateModuleMutation = useMutation(
    (data) => updateModule(data.id, { nom: data.name }, token),
    {
      onError: (error) => {
        console.error("Error updating module:", error);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["modules", searchValue, idParcours]);
      },
    }
  );

  const handleUpdateModule = async (moduleId, newName) => {
    try {
      await updateModuleMutation.mutateAsync({ id: moduleId, name: newName });
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <Container>
      <Row>
        {data?.data.map((item) => (
          <Col key={item.id} xs={12} md={6} lg={4} className="mb-4">
            <CustomCard>
              <CustomCardBody>
                <ModuleTitle>{item.nom}</ModuleTitle>
                <ModuleText>
                  <strong>Total de ressources :</strong>{" "}
                  {item.totalResource ?? 0}
                  <br />
                  <strong>Date :</strong>{" "}
                  {item.createdAt
                    ? format(parseISO(item.createdAt), "dd-MM-yyyy")
                    : "N/A"}
                </ModuleText>
                <CardIconeModule
                  moduleId={item.id || ""}
                  moduleName={item.nom || ""}
                  handleUpdateModule={handleUpdateModule}
                />
              </CustomCardBody>
            </CustomCard>
          </Col>
        ))}
      </Row>
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default ModuleTable;
