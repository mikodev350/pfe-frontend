import React, { useState } from "react";
import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { Link as ScrollLink } from "react-scroll";
import styled from "styled-components";

// ******* affichier Logo ******
import AppLogo from "./images/ggg.png";
import { Link } from "react-router-dom";

// Styled Components
const Header = styled.header`
  /* Styles généraux */
  .custom-navbar {
    background-color: rgba(255, 255, 255, 0) !important;
    padding: 0px 20px;
    z-index: 1000;
    box-shadow: none;
  }

  .logo img {
    height: 50px;
  }

  .logo {
    font-size: 16px;
    font-weight: bold;
    padding-top: 0px;
  }

  .nav-link-custom {
    color: #10266f !important;
    font-size: 15px;
    margin: 0 10px;
    text-decoration: none;
    position: relative;
    transition:
      color 0.3s ease,
      background-color 0.3s ease,
      box-shadow 0.3s ease;
    border-radius: 5px;
    padding: 0px 10px;
    cursor: pointer;
  }

  .nav-link-custom::before {
    content: attr(data-hover);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-width: 0;
    overflow: hidden;
    border-bottom: 2px solid #59bcf3;
    color: #fff;
    white-space: nowrap;
    transition: max-width 0.5s ease-in-out;
  }

  .nav-link-custom:hover {
    font-weight: bold;
    color: #10266f !important;
    background-color: transparent !important;
  }

  .nav-link-custom:hover::before {
    max-width: 100%;
  }

  .header__btn {
    font-size: 15px;
    background-color: #1e80c9;
    border-radius: 50px;
    padding: 6px 15px !important;
    margin-left: 20px;
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
      rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease,
      box-shadow 0.3s ease;
    color: #fff !important;
    cursor: pointer;
  }

  .header__btn:hover {
    background-color: #10266f;
    transform: scale(1.05);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  #clssone {
    background-color: #fff;
    color: #10266f !important;
    border: 2px solid #eea129;
    padding: 4px 14px !important;
  }

  #clssone:hover {
    background-color: #eea129;
  }

  .navbar-collapse {
    display: none; /* Cacher la barre de navigation normale */
  }
  .navbar-toggler {
    display: block; /* Afficher le bouton de basculement */
  }

  .offcanvas {
    width: auto;
    height: 100vh;
    // padding: 2rem;
    text-align: center;
  }

  .offcanvas-body {
    display: flex;
    // flex-direction: column;
    align-items: center; /* Centrer horizontalement */
    justify-content: center; /* Centrer verticalement */
    height: 100%; /* Occuper toute la hauteur */
  }

  .nav_btn {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .navbar-toggler-hidden {
    display: none; /* Masquer le bouton de basculement lorsqu'il est actif */
  }

  /* Styles pour les écrans de taille minimale de 993px */
  @media (min-width: 993px) {
    .navbar-toggler {
      display: none; /* Masquer le bouton de basculement sur les écrans plus grands */
    }

    .navbar-collapse {
      display: flex;
      justify-content: center; /* Centrer les éléments de la navbar */
    }

    .nav_btn {
      margin-left: auto; /* Garder les boutons à droite */
    }
  }
`;

const CustomNavbar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleToggle = () => setShowOffcanvas(!showOffcanvas);

  return (
    <Header>
      <Navbar
        expand="lg"
        className="custom-navbar "
        style={{ backgroundColor: "rgba(255, 255, 255, 0) !important", marginTop: "20px"}}
      >
        <Container>
          <Navbar.Brand
            as={ScrollLink}
            to="hero"
            smooth={true}
            duration={500}
            className="logo"
          >
            {/* ******** dert import l logo fi 3od lien  ******* */}
            <img src={AppLogo} alt="Easy Learn Logo" />
            {/* ******  Ajoutit titre t3 logo ******** */}
            {/* <span style={{ color: '#10266f' }}>Easy</span><span style={{ color: '#59bcf3' }}> Learn</span> */}
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            onClick={handleToggle}
            className={showOffcanvas ? "navbar-toggler-hidden" : ""}
          />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="top"
            show={showOffcanvas}
            onHide={handleToggle}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">
                <img src={AppLogo} className="logoMenu" />
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="navbar-nav link-effect-3 ml-200">
                <Nav.Link
                  as={ScrollLink}
                  to="hero"
                  smooth={true}
                  duration={500}
                  className="nav-link-custom"
                >
                  Accueil
                </Nav.Link>
                <Nav.Link
                  as={ScrollLink}
                  to="services"
                  smooth={true}
                  duration={500}
                  className="nav-link-custom"
                >
                  Cours
                </Nav.Link>
                <Nav.Link
                  as={ScrollLink}
                  to="about"
                  smooth={true}
                  duration={500}
                  className="nav-link-custom"
                >
                  Blog
                </Nav.Link>
                <Nav.Link
                  as={ScrollLink}
                  to="contact"
                  smooth={true}
                  duration={500}
                  className="nav-link-custom"
                >
                  Contact
                </Nav.Link>
              </Nav>
              <Nav className="nav_btn">
               <Link to="/signup">
                <Nav.Item 
                  duration={500}
                  className="header__btn text-center"
                  id="clssone"
                >
                  S'inscrire
                </Nav.Item></Link> 
                <Link to="/login">
                <Nav.Item 
                  duration={500}
                  className="header__btn text-center"
                  id="clsstwo"
                >
                  {"Se\u00A0connecter"}
                </Nav.Item></Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </Header>
  );
};

export default CustomNavbar;
