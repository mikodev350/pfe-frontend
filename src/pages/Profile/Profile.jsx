import React from "react";
import { useQuery } from "react-query";
import { ProfileHeader } from "./ProfileHeader";
import { Bio } from "./Bio";
import Experience from "./Experience";
import Education from "./Education";
import { Container, Row, Col, Button } from "react-bootstrap";
import { fetchMyProfile, fetchUserProfile } from "../../api/apiProfile";
import { getToken } from "../../util/authUtils";
import { useParams, Link } from "react-router-dom";

export default function Profile() {
  alert("i AM HERREEEEEEE !!!!!!!!!!!!!!!!!!!!!")
  const { id } = useParams();
  const token = React.useMemo(() => getToken(), []);
  const localUserId = localStorage.getItem('userId'); // Retrieve the user ID from localStorage

  const { data: profile, isLoading } = useQuery(
    ["profile", id ? id : "me"],
    () => (id ? fetchUserProfile(id, token) : fetchMyProfile(token)),
    {
      enabled: !!token,
    }
  );

  if (isLoading) return <div>Loading...</div>;

  console.log('====================================');
    console.log("profile");
  console.log(profile);
  console.log('====================================');

  return (
    <>
      <Row>
        <Col className="mt-3 d-flex justify-content-end">
          {profile.isMyProfile && (
            <Link to={"/student/edit-profile"}>
              <Button variant="primary">Edit Profile</Button>
            </Link>
          )}
        </Col>
      </Row>
      <ProfileHeader
        id={id}
        token={token}
        profile={profile?.profil}
        nomComplet={profile?.username}
        isRequestSender={profile?.isRequestSender}
        isRequestReceiver={profile?.isRequestReceiver}
        isMyProfile={profile?.isMyProfile}
        relationIsExist={profile?.relationIsExist}
        isFriends={profile?.isFriends}
        type={profile?.type}
      />
      <Bio
        bio={profile?.profil?.bio}
        nomComplet={profile?.username}
        competences={profile?.profil?.competences}
      />
      <Container>
        <Row>
          <Col sm={6}>
            <Experience experiences={profile?.experiences} />
          </Col>
          <Col sm={6}>
            <Education educations={profile?.educations} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
