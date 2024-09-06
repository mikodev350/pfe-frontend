import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import styled from 'styled-components';
import { deleteEducation, deleteExperience, getEducations, getExperiences } from '../../api/apiProfile';
import { Link } from 'react-router-dom';
import { getToken } from '../../util/authUtils';

const DashboardProfile = () => {
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = React.useMemo(() => getToken(), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eduData, expData] = await Promise.all([getEducations(token), getExperiences(token)]);
        setEducations(eduData);
        setExperiences(expData);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleDeleteEducation = async (id) => {
    try {
      await deleteEducation(id, token);
      setEducations(educations.filter(edu => edu.id !== id));
    } catch (error) {
      console.error('Error deleting education', error);
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      await deleteExperience(id, token);
      setExperiences(experiences.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Error deleting experience', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="container-dashboard">
      <StyledCard>
        <h1 className="mb-4 text-center">Mon profil</h1>
        <Row className="mb-4 justify-content-center">
          <Col className="text-center mb-2" xs={12} md={3}>
            <StyledLink to="/dashboard/add-experience">
              Ajouter Expérience
            </StyledLink>
          </Col>
          <Col className="text-center mb-2" xs={12} md={3}>
            <StyledLink to="/dashboard/add-education">
              Ajouter Éducation
            </StyledLink>
          </Col>
          <Col className="text-center mb-2" xs={12} md={3}>
            <StyledLink to="/dashboard/custom-profile">
              Gérer Profil
            </StyledLink>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="mb-4">
            <h2 className="table-title">Expériences Professionnelles</h2>
            <StyledTable striped bordered hover responsive>
              <thead className="table-header">
                <tr>
                  <StyledTh>Entreprise</StyledTh>
                  <StyledTh>Titre du Poste</StyledTh>
                  <StyledTh>Années</StyledTh>
                  <StyledTh>Action</StyledTh>
                </tr>
              </thead>
              <tbody>
                {experiences.map((exp, index) => (
                  <tr key={index}>
                    <StyledTd>{exp.entreprise}</StyledTd>
                    <StyledTd>{exp.titrePoste}</StyledTd>
                    <StyledTd>{`${exp.dateDebut} - ${exp.dateFin || 'Présent'}`}</StyledTd>
                    <StyledTd>
                      <div className="d-flex justify-content-center">
                        <StyledLink to={`/dashboard/update-experience/${exp.id}`} variant="success">
                          <FaEdit size={14} />  Modifier
                        </StyledLink>
                        <CustomButton variant="danger" onClick={() => handleDeleteExperience(exp.id)}>
                          <FaTrashAlt size={14} />  Supprimer
                        </CustomButton>
                      </div>
                    </StyledTd>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </Col>
          <Col md={12} className="mb-4">
            <h2 className="table-title">Formations Académiques</h2>
            <StyledTable striped bordered hover responsive>
              <thead className="table-header">
                <tr>
                  <StyledTh>École</StyledTh>
                  <StyledTh>Diplôme</StyledTh>
                  <StyledTh>Années</StyledTh>
                  <StyledTh>Action</StyledTh>
                </tr>
              </thead>
              <tbody>
                {educations.map((edu, index) => (
                  <tr key={index}>
                    <StyledTd>{edu.ecole}</StyledTd>
                    <StyledTd>{edu.diplome}</StyledTd>
                    <StyledTd>{`${edu.dateDebut} - ${edu.dateFin || 'Présent'}`}</StyledTd>
                    <StyledTd>
                      <div className="d-flex justify-content-center">
                        <StyledLink to={`/dashboard/update-education/${edu.id}`} variant="success">
                          <FaEdit size={14} />  Modifier
                        </StyledLink>
                        <CustomButton variant="danger" onClick={() => handleDeleteEducation(edu.id)}>
                          <FaTrashAlt size={14} />  Supprimer
                        </CustomButton>
                      </div>
                    </StyledTd>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <CustomButton variant="danger" className="mt-4">Supprimer Mon Compte</CustomButton>
        </Row>
      </StyledCard>
    </Container>
  );
};

export default DashboardProfile;


const StyledCard = styled.div`
  background-color: #ffffff !important;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 5px 12px;
  margin: 0 5px;
  border-radius: 50px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: white;
  text-decoration: none;
  background-color: ${props => props.variant === 'danger' ? '#ff4d4d' : props.variant === 'success' ? '#FFB352' : '#10266f'};
  border: 2px solid ${props => props.variant === 'danger' ? '#ff4d4d' : props.variant === 'success' ? '#FFB352' : '#10266f'};
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${props => props.variant === 'danger' ? '#ff3333' : props.variant === 'success' ? '#FFB352' : '#0a1d4b'};
    color: white;
  }
`;

const CustomButton = styled.button`
  padding: 5px 12px;
  border-radius: 50px;
  border: 2px solid ${props => props.variant === 'danger' ? '#ff4d4d' : props.variant === 'success' ? '#FFB352' : '#10266f'};
  background-color: ${props => props.variant === 'danger' ? '#ff4d4d' : props.variant === 'success' ? '#FFB352' : '#10266f'};
  color: #ffffff;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin: 0 5px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${props => props.variant === 'danger' ? '#ff3333' : props.variant === 'success' ? '#FFB352' : '#0a1d4b'};
    color: white;
  }

  /* Media query pour les petits écrans */
  @media (max-width: 768px) {
    padding: 3px 8px; /* Réduire le padding */
    font-size: 12px;  /* Réduire la taille de la police */
    border-radius: 40px; /* Réduire la courbure */
    gap: 3px; /* Réduire l'espace entre l'icône et le texte */
  }
`;



const StyledTable = styled(Table)`
  th,
  td {
    color: #10266f;
    border-color: #2f2f2f;
  }
`;

const StyledTh = styled.th`
  background-color: #2f2f2f;
  color: #ffffff;
`;

const StyledTd = styled.td`
  color: #2f2f2f;
`;
