import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { deleteEducation, deleteExperience, getEducations, getExperiences } from '../../api/apiProfile';
import { getToken } from '../../util/authUtils';
import './DashboardProfile.css'; // Assurez-vous d'importer le fichier CSS

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
    <Container>
      <h1 className="mt-5 mb-4 text-center">Tableau de Bord</h1>
      <Row className="mb-4 justify-content-center">
        <Col className="text-center mb-2" xs={12} md={3}>
           
          <Link to="/student/add-experience">
            <Button variant="primary" className="custom-btn w-100">Ajouter Expérience</Button>
          </Link>
        </Col>
        <Col className="text-center mb-2" xs={12} md={3}>
          <Link to="/student/add-education">
            <Button variant="primary" className="custom-btn w-100">Ajouter Éducation</Button>
          </Link>
        </Col>
  <Col className="text-center mb-2" xs={12} md={3}>
           <Link to="/student/create-profile">
            <Button variant="primary" className="custom-btn w-100">gere profil </Button>
          </Link>
                  </Col>
      </Row>

         
      <Row>
        <Col md={12} className="mb-4">
          <h2 className="table-title">Expériences Professionnelles</h2>
          <Table striped bordered hover responsive>
            <thead className="table-header">
              <tr>
                <th>Entreprise</th>
                <th>Titre du Poste</th>
                <th>Années</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp, index) => (
                <tr key={index}>
                  <td>{exp.entreprise}</td>
                  <td>{exp.titrePoste}</td>
                  <td>{`${exp.dateDebut} - ${exp.dateFin || 'Présent'}`}</td>
                  <td>
                    <Link to={`/student/update-experience/${exp.id}`}>
                      <Button variant="warning" className="edit-btn mr-2">Modifier</Button>
                    </Link>
                    <Button variant="danger" className="delete-btn" onClick={() => handleDeleteExperience(exp.id)}>Supprimer</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col md={12} className="mb-4">
          <h2 className="table-title">Formations Académiques</h2>
          <Table striped bordered hover responsive>
            <thead className="table-header">
              <tr>
                <th>École</th>
                <th>Diplôme</th>
                <th>Années</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {educations.map((edu, index) => (
                <tr key={index}>
                  <td>{edu.ecole}</td>
                  <td>{edu.diplome}</td>
                  <td>{`${edu.dateDebut} - ${edu.dateFin || 'Présent'}`}</td>
                  <td>
                    <Link to={`/student/update-education/${edu.id}`}>
                      <Button variant="warning" className="edit-btn mr-2">Modifier</Button>
                    </Link>
                    <Button variant="danger" className="delete-btn" onClick={() => handleDeleteEducation(edu.id)}>Supprimer</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Button variant="danger" className="delete-account-btn mt-4">Supprimer Mon Compte</Button>
      </Row>
    </Container>
  );
};

export default DashboardProfile;
