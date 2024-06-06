import React from 'react';
import { Container, Image, Button } from 'react-bootstrap';
import { MdPersonAddAlt } from "react-icons/md";

export const ProfileHeader = ({ profile,nomComplet }) => {
  return (
    <Container className="text-center my-3 container-profile Bagrond-Profils">
      <Image
        width="150px"
        height="150px"
        src={`http://localhost:1337${profile.photoProfil}`}
        roundedCircle
        className="mb-3"
      />
      <h1 className="text-light">{nomComplet} </h1>
      <p className="lead text-light">{profile.programmeEtudes}</p>
      <p className="text-light">{profile.niveauEtudes}</p>
      <div>
        <Button variant="outline-light" className="custom-light-button">
          <span><MdPersonAddAlt size={19} /> Ajouter</span>
        </Button>
      </div>
    </Container>
  );
};
