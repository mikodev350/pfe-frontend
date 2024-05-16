import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
// Importez useDispatch si vous utilisez Redux
import { useDispatch } from "react-redux";
import { onUpdateSidebarStatus } from "../../features/sidebarSlice";
// import { onUpdateSidebarStatus } from "../pathToYourSidebarSlice";

export default function Header() {
  const dispatch = useDispatch(); // Décommentez si vous utilisez Redux

  return (
    <>
      <Navbar
        collapseOnSelect
        className="shadow-sm p-3 bg-white rounded"
        expand="sm"
        bg="light"
        variant="light"
      >
        <Container>
          <Link to="/" className="navbar-brand">
            Test
          </Link>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={() => dispatch(onUpdateSidebarStatus())}
          />
          <Navbar.Collapse id="responsive-navbar-nav" className="show">
            <Nav className="me-auto justify-content-end flex-grow-1 pe-3">
              <Link
                to="/"
                data-rr-ui-event-key="/"
                className="nav-link btn-logout"
              >
                Home
              </Link>
              <Link
                to="/login"
                data-rr-ui-event-key="/login"
                className="nav-link"
              >
                Login
              </Link>
              <Link
                to="/signup"
                data-rr-ui-event-key="/signup"
                className="nav-link"
              >
                SignUp
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
