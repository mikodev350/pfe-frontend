import React, { useEffect, useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { Experience, Education } from './Experience';
import { Bio } from './Bio';
import { Container, Row, Col } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import { fetchUserProfile } from '../../api/apiProfile';
import { getToken } from '../../util/authUtils';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  const token = React.useMemo(() => getToken(), []);
  useEffect(() => {
    const getUserProfile = async () => {
      const profileData = await fetchUserProfile(token);
      setProfile(profileData);
    };

    getUserProfile();
    // eslint-disable-next-line
  }, []);

  if (!profile) return <div>Loading...</div>;



  return (
    <Layout fullcontent={true}>
      <ProfileHeader profile={profile.profil} nomComplet={profile.username} />
      <Bio bio={profile.profil.bio}  nomComplet={profile.username} competences={profile.profil.competences}/>
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
    </Layout>
  );
}
