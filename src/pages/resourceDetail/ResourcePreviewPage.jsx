import React, { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getResourceById } from "../../api/apiResource";
import { getToken } from "../../util/authUtils";
import ResourceDetails from "../ResourceDetails";

const ResourcePreviewPage = () => {
  const { token } = useParams();
  const authToken = React.useMemo(() => getToken(), []);
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getResourceById(token, authToken);
        setResource(data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la ressource :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, authToken]);

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
