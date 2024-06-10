import React, { useState, useRef } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Form,
  FormControl,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaEnvelope,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import useOnClickOutside from "../../util/useOnClickOutside";
import ButtonSearchFormDetail from "../searchForm/ButtonSearchFormDetail";

const styles = {
  navIcon: {
    fontSize: "1.5rem",
    position: "relative",
    marginRight: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    color: "#fff",
    backgroundColor: "#6c757d",
  },
  badge: {
    position: "absolute",
    top: "0",
    right: "0",
    transform: "translate(50%, -50%)",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "2px solid #fff",
  },
  navProfile: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
  },
  searchBar: {
    maxWidth: "500px",
    flex: "1 1 auto",
  },
};

const notifications = [
  { id: 1, text: "Notification 1", time: "1hr" },
  { id: 2, text: "Notification 2", time: "30 mins" },
];

const messages = [
  { id: 1, text: "Message 1" },
  { id: 2, text: "Message 2" },
];

function SocialMediaNavbar({ onFilterChange }) {
  const messageDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useOnClickOutside(messageDropdownRef, () => setIsMessagesOpen(false));
  useOnClickOutside(notificationDropdownRef, () =>
    setIsNotificationsOpen(false)
  );

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm p-3 rounded">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="me-auto">
          <img
            src="/logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="education"
          />{" "}
          MySocial
        </Navbar.Brand>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Form className="d-flex mx-2" style={styles.searchBar}>
            <FormControl
              type="search"
              placeholder="Search"
              className="me-auto"
              aria-label="Search"
            />
          </Form>
          <ButtonSearchFormDetail onFilterChange={onFilterChange} />
        </div>
        <Nav className="ms-auto">
          <div style={{ position: "relative" }} ref={messageDropdownRef}>
            <div
              style={styles.navIcon}
              onClick={() => setIsMessagesOpen(!isMessagesOpen)}
            >
              <FaEnvelope />
              <Badge pill style={styles.badge}>
                {messages.length}
              </Badge>
            </div>
            {isMessagesOpen && (
              <div style={styles.customDropdown}>
                {messages.map((message) => (
                  <div key={message.id} style={styles.dropdownItem}>
                    {message.text}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ position: "relative" }} ref={notificationDropdownRef}>
            <div
              style={styles.navIcon}
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <FaBell />
              <Badge pill style={styles.badge}>
                {notifications.length}
              </Badge>
            </div>
            {isNotificationsOpen && (
              <div style={styles.customDropdown}>
                {notifications.map((notification) => (
                  <div key={notification.id} style={styles.dropdownItem}>
                    {notification.text}
                    <small className="text-muted">{notification.time}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
          <NavDropdown
            title={<FaUserCircle style={{ fontSize: "1.5rem" }} />}
            id="nav-dropdown-profile"
            align="end"
            className="no-arrow"
            style={styles.navProfile}
          >
            <NavDropdown.Item
              as={Link}
              to="/profile"
              style={styles.dropdownItem}
            >
              <FaUserCircle /> My Profile
            </NavDropdown.Item>
            <NavDropdown.Item
              as={Link}
              to="/settings"
              style={styles.dropdownItem}
            >
              <FaCog /> Settings
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              as={Link}
              to="/logout"
              style={styles.dropdownItem}
            >
              <FaSignOutAlt /> Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default SocialMediaNavbar;
