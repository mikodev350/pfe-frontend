import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Navbar as BootstrapNavbar,
} from "react-bootstrap";
import { Button, Link as ScrollLink } from "react-scroll";
import styled from "styled-components";
import Hamburger from "hamburger-react";

// ******* affichier Logo ******
import AppLogo from "./images/ggg.png";
import { Link } from "react-router-dom";
import useOnClickOutside from "../../util/useOnClickOutside";

const StyledSidebar = styled.div`
  position: fixed;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  top: 0px !important;
  button: 0px !important;
  z-index: 100220 !important;
  width: 220px !important;
  padding: 30px;
  height: calc(
    100vh
  ); /* Ajuster la hauteur pour qu'elle corresponde à la hauteur de la fenêtre */
  background-color: #10266f;
  color: #ffffff;

  right: ${(props) => (props.open ? "0px" : "-220px")};
  transition: right 0.3s ease;
  // overflow-y: auto; /* Activer le défilement vertical */
  //overflow-x: hidden; /* Cacher le défilement horizontal */
  /* Hide scrollbar for all browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */

  &::-webkit-scrollbar {
    /* WebKit browsers like Chrome, Safari */
    width: 0;
    height: 0;
  }

  // .nav-menu {
  //   padding: 0px;
  // }

  // .nav-item {
  //   margin: 3px 0;
  // }

  // .nav-link {
  //   display: flex;
  //   align-items: center;
  //   padding: 10px;
  //   text-decoration: none;
  //   color: #ffffff;
  //   transition: background-color 0.3s ease, transform 0.3s ease;
  //   border-radius: 10px;
  //   position: relative;
  //   overflow: hidden;

  //   &:hover {
  //     transform: scale(1.05);
  //   }

  //   &:hover .sidebar-icon {
  //     background-color: #e2e7f9;
  //     color: #10266f;
  //   }

  //   .sidebar-icon {
  //     margin-right: 19px;
  //     color: #ffffff;
  //     font-weight: 600;
  //     font-size: 2.5rem;
  //     background-color: #10266f;
  //     border-radius: 30%;
  //     padding: 10px;
  //     transition: background-color 0.3s ease, transform 0.3s ease;
  //   }

  //   .icon-text {
  //     font-size: 15px;
  //     white-space: nowrap;
  //     overflow: hidden;
  //     text-overflow: ellipsis;
  //     transition: opacity 0.3s ease;
  //     //opacity: ${(props) => (props.expanded ? 1 : 0)};
  //     color: #ffffff;
  //   }
  // }

  // .sub-menu-container {
  //   padding-left: 20px;
  //   max-height: 0;
  //   overflow: hidden;
  //   transition: max-height 0.3s ease, opacity 0.3s ease;
  //   opacity: 0;
  // }

  // .sub-menu-container.expanded {
  //   max-height: 200px;
  //   opacity: 1;
  // }
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

const ButtonStyled = styled(Button)`
  background-color: ${(props) => (props.second ? "#FFB352" : "#10266f")};
  border-radius: 12px;
  color: ${(props) => (props.second ? "black" : "white")};
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

const AnimatedLink = styled(Link)`
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

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <NavbarCustom isVisible={isVisible}>
        <Container style={{ position: "relative" }}>
          <Navbar.Brand href="#home">
            <img src={AppLogo} alt="Easy Learn Logo" height={"45px"} />
          </Navbar.Brand>

          {windowWidth < 900 ? (
            <div
              style={{
                position: "absolute",
                right: "0px",
                top: "10px",
                zIndex: 12220,
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
              {" "}
              <Nav className="mr-auto">
                <AnimatedLink to="#link1">Accueil</AnimatedLink>
                <AnimatedLink to="#link1">Cours</AnimatedLink>
                <AnimatedLink to="#link1">Blog</AnimatedLink>
                <AnimatedLink to="#link1">Contact</AnimatedLink>
              </Nav>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <Nav className="nav_btn">
                  <ButtonStyled
                    variant="primary"
                    second={true}
                    className="button-Login  w-100"
                  >
                    <Link to="/signup">S'inscrire</Link>
                  </ButtonStyled>

                  <Link to="/login">
                    {" "}
                    <ButtonStyled
                      variant="primary"
                      className="button-Login  w-100"
                    >
                      {"Se\u00A0connecter"}
                    </ButtonStyled>
                  </Link>
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </NavbarCustom>
      <div
        style={{
          position: "relative",
        }}
        ref={sidebar}
      >
        <StyledSidebar open={isExpanded}>
          {" "}
          <AnimatedLink to="#link1" white={true}>
            Accueil
          </AnimatedLink>
          <AnimatedLink to="#link1" white={true}>
            Cours
          </AnimatedLink>
          <AnimatedLink to="#link1" white={true}>
            Blog
          </AnimatedLink>
          <AnimatedLink to="#link1" white={true}>
            Contact
          </AnimatedLink>
          <br />
          <AnimatedLink to="#link1" white={true}>
            {"Se\u00A0connecter"}
          </AnimatedLink>
          <AnimatedLink to="#link1" white={true}>
            S'inscrire
          </AnimatedLink>
        </StyledSidebar>
      </div>
    </>
    //
    //
  );
};

export default CustomNavbar;
