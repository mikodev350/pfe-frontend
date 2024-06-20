import React, { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getResourceById, } from "../../api/apiResource";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResourceDetails from "../resourceDetail/resourceDetail";

const ResourcePreviewPage = () => {
  const { id } = useParams(); // Utilise l'ID de la ressource dans l'URL
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getResourceById(id); // Récupère la ressource par ID
        setResource(data);
      } catch (error) {
        toast.error("Erreur lors de la récupération de la ressource");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <Container>
      <ToastContainer />
      <h1 className="mt-5 mb-4">Aperçu de la Ressource</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Chargement...</p>
        </div>
      ) : (
        resource ? <ResourceDetails resource={resource} /> : <p>Ressource introuvable</p>
      )}
    </Container>
  );
};

export default ResourcePreviewPage;