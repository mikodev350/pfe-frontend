import React from 'react';
import { Container, Image, Button, Badge } from 'react-bootstrap';
import { MdPersonAddAlt } from "react-icons/md";
import { sendFriendRequest } from '../../api/apiFriendRequest';

export const ProfileHeader = ({ id, token, profile, nomComplet }) => {
  const [message, setMessage] = React.useState('');

  const handleSendRequest = async () => {
    try {
      await sendFriendRequest(id, token);
      setMessage('Invitation sent!');
    } catch (error) {
      setMessage('Error sending invitation: ' + error.message);
    }
  };

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
      {profile.institution && <p className="text-light">Institution: {profile.institution}</p>}
      {profile.niveauSpecifique && <p className="text-light">Niveaux: {profile.niveauSpecifique}</p>}
      <div>
        <p className="text-light">Les matières:</p>
        {profile.matieresEnseignees.map((matiere, index) => (
          <Badge key={index} pill bg="light" text="dark" className="mx-1">
            {matiere}
          </Badge>
        ))}
      </div>
      <div>
        <br />
        {id && (
          <>
            {message && <p className="text-light">{message}</p>}
            <Button variant="outline-light" onClick={handleSendRequest} className="custom-light-button">
              <MdPersonAddAlt size={19} /> Ajouter
            </Button>
          </>
        )}
      </div>
    </Container>
  );
};
