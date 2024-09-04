import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
} from "react-bootstrap";
import styled from "styled-components";
import Hamburger from "hamburger-react";
import { Link as ReactScrollLink } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import useOnClickOutside from "../../util/useOnClickOutside";

const StyledSidebar = styled.div`
  position: fixed;
  font-family: "Roboto", sans-serif;
  top: 0;
  right: ${(props) => (props.open ? "0" : "-100%")};
  z-index: 100220;
  width: 260px;
  padding: 20px;
  height: 100vh;
  background-color: #10266f;
  color: #ffffff;
  transition: right 0.3s ease-in-out, background-color 0.3s ease-in-out;
  box-shadow: ${(props) => (props.open ? "0px 0px 15px rgba(0, 0, 0, 0.5)" : "none")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  & a {
    color: #ffffff;
    text-decoration: none;
    margin: 15px 0;
    font-size: 1.2rem;
    font-weight: bold;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: #ffb352;
    }
  }
`;

const NavbarCustom = styled(Navbar)`
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  background-color: ${({ isVisible }) => (isVisible ? "white" : "#FDF3E2")};
  box-shadow: ${({ isVisible }) =>
    isVisible ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none"};
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
`;

const ButtonStyled = styled.button`
  background-color: ${(props) => (props.second ? "white" : "#2180D0")};
  border-radius: 20px;
  color: ${(props) => (props.second ? "black" : "white")};
  border: 2px solid ${(props) => (props.second ? "#FFB352" : "#2180D0")};
  padding: 5px 20px;
  margin: 0px 10px;
  transition: 0.3s;
  font-weight: bold;
  &:hover {
    opacity: 0.8;
    background-color: ${(props) => (props.second ? "#FFB352" : "#10266f")};
  }
  a {
    color: ${(props) => (props.second ? "black" : "white")};
  }
`;

const AnimatedRouterLink = styled(RouterLink)`
  display: block;
  color: ${(props) => (props.white ? "#fff !important" : "#000")};
  text-decoration: none;
  margin-right: 20px;

  &::after {
    content: "";
    display: block;
    width: 0;
    height: 3px;
    background: ${(props) => (props.white ? "#fff !important" : "#000")};
    transition: width 0.3s;
  }

  &:hover::after {
    width: 100%;
    transition: width 0.3s;
  }
`;

const AnimatedScrollLink = styled(ReactScrollLink)`
  display: block;
  color: ${(props) => (props.white ? "#fff !important" : "#000")};
  text-decoration: none;
  margin-right: 20px;

  &::after {
    content: "";
    display: block;
    width: 0;
    height: 3px;
    background: ${(props) => (props.white ? "#fff !important" : "#000")};
    transition: width 0.3s;
  }

  &:hover::after {
    width: 100%;
    transition: width 0.3s;
  }
`;

const CustomNavbar = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isFirstClick, setIsFirstClick] = React.useState(true);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 90) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isExpanded, setIsExpanded] = useState(null);
  const sidebar = React.useRef(null);

  useOnClickOutside(sidebar, () => {
    setIsExpanded(false);
  });

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLinkClick = (event, path) => {
    if (isFirstClick) {
      event.preventDefault();
      setIsFirstClick(false);
      window.location.href = path; // Force a full page reload
    }
  };

  return (
    <>
      <NavbarCustom isVisible={isVisible}>
        <Container style={{ position: "relative" }}>
          <RouterLink to="/">
            <Navbar.Brand>
              <img src={"/img/logo.png"} alt="Easy Learn Logo" height={"45px"} />
            </Navbar.Brand>
          </RouterLink>

          {windowWidth < 900 ? (
            <div
              style={{
                position: "absolute",
                right: isExpanded ? "170px" : "0px",
                top: "3px",
                zIndex: 1221120,
                transition: "0.3s",
              }}
            >
              <Hamburger
                toggled={isExpanded}
                toggle={setIsExpanded}
                color="#10266F"
              />
            </div>
          ) : (
            <>
              <Nav className="mr-auto">
                <AnimatedScrollLink smooth={true} duration={500} to="why">
                  Pourquoi
                </AnimatedScrollLink>
                <AnimatedScrollLink smooth={true} duration={500} to="testimonial">
                  Rejoindre
                </AnimatedScrollLink>
                <AnimatedScrollLink smooth={true} duration={500} to="services">
                  Services
                </AnimatedScrollLink>
                <AnimatedScrollLink smooth={true} duration={500} to="proud">
                  Équipe
                </AnimatedScrollLink>
              </Nav>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <Nav className="nav_btn">
                  <ButtonStyled variant="primary" second={true}>
                    <RouterLink to="/signup" onClick={(e) => handleLinkClick(e, "/signup")}>
                      S'inscrire
                    </RouterLink>
                  </ButtonStyled>
                  <ButtonStyled variant="primary">
                    <RouterLink to="/login" onClick={(e) => handleLinkClick(e, "/login")}>
                      Se&nbsp;connecter
                    </RouterLink>
                  </ButtonStyled>
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </NavbarCustom>
      <div ref={sidebar}>
        <StyledSidebar open={isExpanded}>
          <AnimatedRouterLink to="/" white={true} onClick={(e) => handleLinkClick(e, "/")}>
            Accueille
          </AnimatedRouterLink>
          <br />
          <AnimatedScrollLink smooth={true} duration={500} to="why">
            Pourquoi
          </AnimatedScrollLink>
          <AnimatedScrollLink smooth={true} duration={500} to="testimonial" white={true}>
            Rejoindre
          </AnimatedScrollLink>
          <AnimatedScrollLink smooth={true} duration={500} to="services" white={true}>
            Services
          </AnimatedScrollLink>
          <AnimatedScrollLink smooth={true} duration={500} to="proud" white={true}>
            Équipe
          </AnimatedScrollLink>
          <AnimatedRouterLink to="/login" white={true} >
            {"Se\u00A0connecter"}
          </AnimatedRouterLink>
          <AnimatedRouterLink to="/signup" white={true} >
            S'inscrire
          </AnimatedRouterLink>
        </StyledSidebar>
      </div>
    </>
  );
};

export default CustomNavbar;
