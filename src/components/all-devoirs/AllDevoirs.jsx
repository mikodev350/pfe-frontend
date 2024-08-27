import React, { useState } from 'react';
import styled from 'styled-components';
import { Accordion, Button, Card, Col, Row, Container } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FaEdit, FaTrash } from 'react-icons/fa';
import SearchForm from '../../components/searchForm/SearchForm';
import PaginationComponent from '../../components/pagination/Pagination';
import { fetchDevoirs, deleteDevoir } from '../../api/apiDevoir';
import { getToken } from '../../util/authUtils';
import { Link } from 'react-router-dom';

// Styled Button with Gradient Background
const GradientButton = styled(Button)`
  background: linear-gradient(135deg, #10266f, #3949ab);
  border: 2px solid #10266f;
  color: #ffffff;
  font-weight: bold;
  border-radius: 8px;
  height: 50px;
  width: 100%;
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
  }
`;

const StyledIconButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  background-color: #e0e0e0;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
  color: #424242;

  &:hover,
  &:focus {
    background-color: #007bff;
    color: #ffffff;
    transform: translateY(-3px);
  }
`;

const StyledCard = styled(Card)`
  border: none;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;

const StyledAccordionHeader = styled(Accordion.Header)`
  font-weight: bold;
  background-color: #f8f9fa;
  color: #343a40;
  padding: 15px 20px;
  border-bottom: 1px solid #ced4da;
  border-radius: 5px;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-size: 1rem;
`;

const StyledAccordionBody = styled(Accordion.Body)`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 0 0 5px 5px;
  border: 1px solid #ced4da;
  border-top: none;
  font-size: 0.9rem;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ActionIcons = styled.div`
  display: flex;
  margin-top: 10px;
  align-items: center;
  gap: 10px;
  margin-left: auto;
`;

const AllDevoirs = ({ onEdit, onAdd }) => {
  const token = getToken();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { data, isLoading, error } = useQuery(
    ["devoirs", currentPage, pageSize, searchValue],
    () => fetchDevoirs(currentPage, pageSize, searchValue, token),
    { keepPreviousData: true }
  );

  const deleteMutation = useMutation(
    (id) => deleteDevoir(id, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('devoirs'); // Recharger la liste des devoirs après suppression
      },
    }
  );

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleSearch = async (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  const devoirs = Array.isArray(data?.data) ? data.data : [];
  const totalPages = data?.totalPages || 1;

  return (
    <Container>
      <Row className="mb-4">
        <Col xs={12} md={6}>
                            <Link to={`/dashboard/devoirs/nouveau`}>

          <GradientButton >

            Ajouter

          </GradientButton>
                                </Link>


        </Col>
        <Col xs={12} md={6}>
          <SearchForm searchValue={searchValue} onSearch={handleSearch} />
        </Col>
      </Row>
      <Accordion defaultActiveKey="0">
        {devoirs.map((devoir, index) => (
          <StyledCard key={devoir.id}>
            <Accordion.Item eventKey={index.toString()}>
              <StyledAccordionHeader>
                <span>{devoir.titre}</span>
              </StyledAccordionHeader>
              <StyledAccordionBody>
                <ActionIcons>
                  <StyledIconButton onClick={() => onEdit(devoir)}>
                    <FaEdit />
                  </StyledIconButton>
                  <StyledIconButton delete onClick={() => handleDelete(devoir.id)}>
                    <FaTrash />
                  </StyledIconButton>
                </ActionIcons>
                <Card.Text>
                  <div dangerouslySetInnerHTML={{ __html: devoir.description }} />
                </Card.Text>
              </StyledAccordionBody>
            </Accordion.Item>
          </StyledCard>
        ))}
      </Accordion>
      <div className="d-flex justify-content-center">
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </Container>
  );
};

export default AllDevoirs;
