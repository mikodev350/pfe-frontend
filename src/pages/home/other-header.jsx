import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Navbar.css';  // Assurez-vous que ce fichier contient les styles CSS fournis

const CustomNavbar = () => {
  return (
    <header>
      <Navbar expand="lg" fixed="top" className="custom-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="logo">
            <img src="path/to/logo.png" alt="Easy Learn Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="nav-link-custom">Accueil</Nav.Link>
              <Nav.Link as={Link} to="/courses" className="nav-link-custom">Cours</Nav.Link>
              <Nav.Link as={Link} to="/blog" className="nav-link-custom">Blog</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="nav-link-custom">Contact</Nav.Link>
              <NavDropdown title="Plus" id="basic-nav-dropdown" className="nav-link-custom">
                <NavDropdown.Item as={Link} to="/about">À propos</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/faq">FAQ</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/support">Support</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link as={Link} to="/sign-up" className="e-btn header__btn header__btn-2 ml-50">
                S'inscrire
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default CustomNavbar;
