import React, { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getResourceById } from "../../api/apiResource";
import { getToken } from "../../util/authUtils";
import ResourceDetails from "../resourceDetail/resourceDetail";

const ResourcePreviewPage = () => {
  const { id } = useParams();
  const token = React.useMemo(() => getToken(), []);
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getResourceById(id, token);
        setResource(data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la ressource :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  return (
    <Container>
      <h1 className="mt-5 mb-4">Aperçu de la ressource</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Chargement...</p>
        </div>
      ) : (
        resource && <ResourceDetails resource={resource} />
      )}
    </Container>
  );
};

export default ResourcePreviewPage;