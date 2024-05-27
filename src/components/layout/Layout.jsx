import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useLocation } from "react-router-dom";

import useStorage from "../../hooks/useStorage";
import Header from "../header/Header";

import SidebarDesktop from "../sideBar/SideBarDesktop/SidebarDesktop";
import SideBarMobile from "../sideBar/sideBarMobile/SideBarMobile";

// import ChatApp from "../messaging/ChatApp"; // Assurez-vous que le chemin est correct
// import ChatManager from "../messaging/ChatManager";
import ChatApplication from "../messaging/ChatApplication";
import ChatApp from "../messaging/ChatApp";
import SearchFormDetail from "../searchForm/SearchFormDetail";
import SocialMediaNavbar from "../header/SocialMediaNavbar";
// import Messenger from "../messenger/Messenger"; // Assurez-vous que le chemin est correct

const Layout = ({ fullcontent, backgroundColorIdentification, children }) => {
  const role = React.useMemo(() => {
    return localStorage.getItem("role");
  }, []);
  const location = useLocation();
  const currentRoute = location.pathname.split("/")[1].toUpperCase();
  // console.log(currentRoute);
  const [, , setType] = useStorage({ key: "type" });
  if (currentRoute === "STUDENT") {
    setType("type", "DASHEBOARD_STUDENT");
  } else if (currentRoute === "TEACHER") {
    setType("type", "DASHEBOARD_TEACHER");
  } else if (currentRoute === "SETTINGS") {
    if (role === "STUDENT") setType("type", "SETTINGS_STUDENT");
    else {
      setType("type", "SETTINGS_TEACHER");
    }
  } else {
    // localStorage.clear();
  }

  // useEffect(() => {
  //   if (currentRoute === "STUDENT") {
  //     setRole("role","DASHEBOARD_STUDENT");
  //   } else if (currentRoute === "TEACHER") {
  //     setRole("role","DASHEBOARD_TEACHER");
  //   }else if(currentRoute === "SETTINGS"){
  //     setRole("role","SETTINGS_TEACHER");

  //   }else{
  //     localStorage.clear();

  //   }

  // }, [setRole,currentRoute]);

  const backgroundColor = backgroundColorIdentification ? "white" : "#F1F1F1";

  return (
    <>
      {/* <Header /> */}
      <  SocialMediaNavbar/>
      <aside>
        <SideBarMobile />
      </aside>
      <main style={{ backgroundColor, minHeight: "100vh" }}>
        <Container>
          {fullcontent ? (
            children
          ) : (
            <Row>
              <Col md={2} className="rc-side-bar">
                <SidebarDesktop />
              </Col>
              <Col md={7}>{children}</Col>
              {/* <Col md={2}>
                <Messenger />
              </Col> */}
              {/* <Col md={3} style={{ backgroundColor: "#f8f9fa" }}>
                <MessagingArea />
              </Col> */}
              <div className="col-md-3">
                {/* <ChatApplication /> Integrated ChatManager           */}
                <ChatApp/>    </div>
            </Row>
          )}
        </Container>
      </main>
    </>
  );
};

export default Layout;
