import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link as ScrollLink } from "react-scroll";
import styled from "styled-components";

// ******* affichier Logo ******
import AppLogo from "./images/ellogo.png";

// Styled Components
const Header = styled.header`

  .custom-navbar {
    background-color: rgba(255, 255, 255, 0) !important; /* Couleur de fond blanche avec opacité de 0.8 */
    padding: 8px 20px; /* Increased padding for a cleaner look */
    // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Softer shadow */
    z-index: 1000; /* Ensure the navbar stays on top */
      box-shadow: none;
padding-top:0px;
  }

  .logo img {
    height: 35px; /* Augmentez cette valeur pour agrandir l'image */
  }

  .logo {
    font-size: 16px;
    font-weight: bold;
  }
  .nav-link-custom {
    color: #10266f !important; /* Dark text color */
    font-size: 15px; /* Smaller text size */
    margin: 0 10px; /* Adjusted margin for better spacing */
    text-decoration: none;
    position: relative; /* Necessary for the pseudo-element positioning */
    transition:
      color 0.3s ease,
      background-color 0.3s ease,
      box-shadow 0.3s ease;
    border-radius: 5px;
    padding: 5px 10px; /* Adjusted padding */
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
  .navbar-toggler {
    border: none;
  }

  .navbar-toggler:focus {
    outline: none;
  }

  .header__btn {
    font-size: 15px; /* Smaller text size */
    // font-weight:500;
    background-color: #1e80c9; /* Primary button color */
    border-radius: 50px; /* More rounded corners */
    padding: 6px 15px !important;
    margin-left: 20px; /* Added margin-left for better spacing */
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease,
      box-shadow 0.3s ease;
      color: #fff !important;
    cursor: pointer;
    &:hover {
      background-color: #10266f; /* Updated hover color */
      transform: scale(1.05); /* Slightly larger on hover */
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add shadow on hover */
      
    }
  }
  #clssone {
  
    background-color:  #fff;
    color: #10266f !important;
    border: 2px solid #eea129; 
         padding: 4px 14px !important;

    &:hover {
      background-color: #eea129;   /* Updated hover color */
      }
  }

  .navbar-nav {
    flex-grow: 0;
    justify-content: center; /* Center the navigation links */
    align-items: center; /* Center align the navigation links vertically */
  }
  .navbar-collapse {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Align the collapse content to the left */
    @media (max-width: 992px) {
      flex-direction: column;
      margin-left: 0 !important; /* Reset margin-left on smaller screens */
    }
  }
`;

const CustomNavbar = () => {
  return (
    <Header  >
      {/* ***** nhit l3fsa t3 fix  */}
      <Navbar expand="lg"   className="custom-navbar" style={{ backgroundColor: "rgba(255, 255, 255, 0) !important" }} >
        <Container >
          <Navbar.Brand as={ScrollLink} to="hero" smooth={true} duration={500} className="logo">
            {/* ******** dert import l logo fi 3od lien  ******* */}
            <img src={AppLogo} alt="Easy Learn Logo" />
            {/* ******  Ajoutit titre t3 logo ******** */}
            <span style={{ color: '#10266f' }}>Easy</span><span style={{ color: '#59bcf3' }}> Learn</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" style={{ marginTop: '0px', marginLeft: '200px' }}  className="d-flex text-center">
            {/* ******** Ajoutit style lles links ***** */}
            <Nav className="navbar-nav link-effect-3">
              <Nav.Link as={ScrollLink} to="hero" smooth={true} duration={500} className="nav-link-custom">Accueil</Nav.Link>
              <Nav.Link as={ScrollLink} to="services" smooth={true} duration={500} className="nav-link-custom">Cours</Nav.Link>
              <Nav.Link as={ScrollLink} to="about" smooth={true} duration={500} className="nav-link-custom">Blog</Nav.Link>
              <Nav.Link as={ScrollLink} to="contact" smooth={true} duration={500} className="nav-link-custom">Contact</Nav.Link>
            </Nav>
         {/* *******   hna zdt class ***** */}
            <Nav className='nav_btn'>
              <Nav.Link as={ScrollLink} to="sign-up" smooth={true} duration={500} className="header__btn text-center" id="clssone">
                S'inscrire
              </Nav.Link>
          {/* *******   hna zdt link lbtn t3 se connecter  ***** */}
              <Nav.Link as={ScrollLink} to="login" smooth={true} duration={500} className="header__btn text-center" id="clsstwo ">
              {"Se\u00A0connecter"}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Header>
  );
};

export default CustomNavbar;
