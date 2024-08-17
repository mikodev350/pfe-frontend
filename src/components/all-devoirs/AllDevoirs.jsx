import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchDevoirs, deleteDevoir } from '../../api/apiDevoir';
import { getToken } from '../../util/authUtils';
import { accordionStyles } from './devoirCss';
import SearchForm from '../../components/searchForm/SearchForm';
import PaginationComponent from '../../components/pagination/Pagination';
import { Link } from 'react-router-dom';

const AllDevoirs = ({ onEdit, onAdd }) => {  // Ajoutez la prop onAdd pour gérer l'ajout de devoirs
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
    setCurrentPage(1); // Réinitialiser à la première page lors de la recherche
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;

  const devoirs = Array.isArray(data?.data) ? data.data : [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="success" onClick={onAdd}>
            <Link to="/student/devoirs/nouveau" >
          Ajouter un Devoir
          </Link>
        </Button>
        <SearchForm searchValue={searchValue} onSearch={handleSearch} />
      </div>
      <Accordion defaultActiveKey="0">
        {devoirs.map((devoir, index) => (
          <Card key={devoir.id} style={accordionStyles.card}>
            <Accordion.Item eventKey={index.toString()}>
              <Accordion.Header style={accordionStyles.header}>
                <span>{devoir.titre}</span>
              </Accordion.Header>
              <Accordion.Body style={accordionStyles.body}>
               <Card.Text>
  <div dangerouslySetInnerHTML={{ __html: devoir.description }} />
</Card.Text>

                <Button
                  variant="primary"
                  style={accordionStyles.updateButton}
                  size="sm"
                  onClick={() => onEdit(devoir)} // Ouvrir le formulaire de mise à jour
                >
                  Mettre à Jour
                </Button>
                <Button
                  variant="danger"
                  style={accordionStyles.deleteButton}
                  size="sm"
                  onClick={() => handleDelete(devoir.id)} // Supprimer le devoir
                >
                  Supprimer
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          </Card>
        ))}
      </Accordion>
      <div className="d-flex justify-content-center">
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AllDevoirs;
