import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link as ScrollLink } from 'react-scroll';
import styled from 'styled-components';

// Styled Components
const Header = styled.header`
  .custom-navbar {
    background-color: #ffffff; /* White background */
    padding: 15px 20px; /* Increased padding for a cleaner look */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Softer shadow */
    z-index: 1000; /* Ensure the navbar stays on top */
  }

  .logo img {
    height: 40px;
  }

  .nav-link-custom {
    color: #333 !important; /* Dark text color */
    font-size: 14px; /* Smaller text size */
    margin: 0 10px; /* Adjusted margin for better spacing */
    transition: color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
    border-radius: 5px;
    padding: 5px 10px; /* Adjusted padding */
    cursor: pointer;
    &:hover {
      color: #fff !important; /* White text on hover */
      background-color: #4169E1; /* Updated hover color */
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add shadow on hover */
    }
  }

  .navbar-toggler {
    border: none;
    &:focus {
      outline: none;
    }
  }

  .header__btn {
    background-color: #007bff; /* Primary button color */
    color: #fff !important;
    border-radius: 20px; /* More rounded corners */
    padding: 10px 20px;
    font-size: 16px;
    margin-left: 15px; /* Added margin-left for better spacing */
    transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    &:hover {
      background-color: #4169E1; /* Updated hover color */
      transform: scale(1.05); /* Slightly larger on hover */
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add shadow on hover */
    }
  }

  .navbar-nav {
    flex-grow: 1;
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
    <Header>
      <Navbar expand="lg" fixed="top" className="custom-navbar">
        <Container>
          <Navbar.Brand as={ScrollLink} to="hero" smooth={true} duration={500} className="logo">
            <img src="path/to/logo.png" alt="Easy Learn Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" style={{ marginTop: '0px', marginLeft: '280px' }} className="d-flex text-center">
            <Nav className="navbar-nav">
              <Nav.Link as={ScrollLink} to="hero" smooth={true} duration={500} className="nav-link-custom">Accueil</Nav.Link>
              <Nav.Link as={ScrollLink} to="services" smooth={true} duration={500} className="nav-link-custom">Cours</Nav.Link>
              <Nav.Link as={ScrollLink} to="about" smooth={true} duration={500} className="nav-link-custom">Blog</Nav.Link>
              <Nav.Link as={ScrollLink} to="contact" smooth={true} duration={500} className="nav-link-custom">Contact</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link as={ScrollLink} to="sign-up" smooth={true} duration={500} className="header__btn text-center">
                S'inscrire
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Header>
  );
};

export default CustomNavbar;
