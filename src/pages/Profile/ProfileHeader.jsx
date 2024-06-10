import React from 'react';
import { Container, Image, Button, Badge } from 'react-bootstrap';
import { MdPersonAddAlt } from "react-icons/md";

export const ProfileHeader = ({ profile, nomComplet }) => {
  return (
    <Container className="text-center my-3 container-profile Bagrond-Profils">
      <Image
        width="150px"
        height="150px"
        src={profile.photoProfil ? `http://localhost:1337${profile.photoProfil}` : 'https://via.placeholder.com/150'}
        roundedCircle
        className="mb-3"
      />
      <h1 className="text-light">{nomComplet}</h1>
      <p className="lead text-light">{profile.programmeEtudes}</p>
      <p className="text-light">{profile.niveauEtudes === "rien" ? profile.nomFormation : profile.niveauEtudes}</p>
      {profile.specialite && <p className="text-light">Spécialité: {profile.specialite}</p>}
            {profile.institution && <p className="text-light"> Institution: {profile.institution}</p>}

      {profile.niveauSpecifique && <p className="text-light"> Niveaux : {profile.niveauSpecifique}</p>}
      <div>
        <p className="text-light">  les matiers : </p>
            {profile.matieresEnseignees.map((matiere, index) => (
              <Badge  key={index} pill bg="light" text="dark" className="mx-1">
                {matiere}
              </Badge>
            ))}

          </div>
      {/* {profile.bio && <p className="text-light">Bio: {profile.bio}</p>} */}
      <div>
                            <br />

        <Button variant="outline-light" className="custom-light-button">
          <span><MdPersonAddAlt size={19} /> Ajouter</span>
        </Button>
      </div>
    </Container>
  );
};
