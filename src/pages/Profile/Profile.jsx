import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useQuery } from "react-query";
import { ProfileHeader } from "./ProfileHeader";
import { Bio } from "./Bio";
import Experience from "./Experience";
import Education from "./Education";
import { fetchMyProfile, fetchUserProfile } from "../../api/apiProfile";
import { getToken } from "../../util/authUtils";
import { useParams, Link } from "react-router-dom";

import "./Profile.css";

export default function Profile() {
  const { id } = useParams();
  const token = React.useMemo(() => getToken(), []);
  const localUserId = localStorage.getItem("userId");

  const { data: profile, isLoading } = useQuery(
    ["profile", id ? id : "me"],
    () => (id ? fetchUserProfile(id, token) : fetchMyProfile(token)),
    {
      enabled: !!token,
    }
  );


  if (isLoading) return <div>Loading...</div>;

  return (
    <>
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
        bio={profile.profil.bio}
        nomComplet={profile?.username}
        competences={profile?.profil?.competences}
      />

<Container>
      <Row>
        <Col lg={6} md={12} className="mb-4">
          <Experience experiences={profile?.experiences} />
        </Col>
        <Col lg={6} md={12} className="mb-4">
          <Education educations={profile?.educations} />
        </Col>
      </Row>
    </Container>



    </>
  );
}
