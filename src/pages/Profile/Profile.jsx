import React, { useEffect, useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { Bio } from './Bio';
import Experience from './Experience';
import Education from './Education';
import { Container, Row, Col } from 'react-bootstrap';
import { fetchMyProfile, fetchUserProfile } from '../../api/apiProfile';
import { getToken } from '../../util/authUtils';
import { useParams } from 'react-router-dom';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const { id } = useParams();
  const token = React.useMemo(() => getToken(), []);

  useEffect(() => {
    const getMyUserProfile = async () => {
      const profileData = await fetchMyProfile(token);
      setProfile(profileData);
    };

    const getUserProfile = async () => {
      const profileData = await fetchUserProfile(id, token);
      setProfile(profileData);
    };

    if (id) {
      getUserProfile();
    } else {
      getMyUserProfile();
    }
  }, [id, token]);

  if (!profile) return <div>Loading...</div>;

  return (
    <>
      <ProfileHeader id={id} token={token} profile={profile.profil} nomComplet={profile.username} />
      <Bio bio={profile.profil.bio} nomComplet={profile.username} competences={profile.profil.competences} />
      <Container>
        <Row>
          <Col sm={6}>
            <Experience experiences={profile.experiences} />
          </Col>
          <Col sm={6}>
            <Education educations={profile.educations} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
