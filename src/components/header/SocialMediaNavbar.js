import React, { useState, useRef } from "react";
import { Navbar, Nav, Container, Badge, NavbarBrand } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaEnvelope,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaUser,
} from "react-icons/fa";
import useOnClickOutside from "../../util/useOnClickOutside";
import ButtonSearchFormDetail from "../searchForm/ButtonSearchFormDetail";
import { useAppSelector } from "../../hooks/hooks";
import AppLogo from "./GGG.png"; // Import du logo

const styles = {
  navIcon: {
    fontSize: "1.2rem",
    position: "relative",
    marginRight: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "30%",
    color: "#10266f",
    backgroundColor: "#cae6fa",
    cursor: "pointer",
    transition: "transform 0.3s ease, color 0.3s ease",
  },
  navIconHover: {
    color: "#1e80c9",
    transform: "scale(1.1)",
  },
  badge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "2px solid #fff",
    fontSize: "0.7rem",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navProfile: {
    position: "relative",
  },
  searchBarContainer: {
    display: "flex",
    alignItems: "center",
    maxWidth: "600px",
    width: "100%",
    borderRadius: "50px",
    padding: "0px 15px",
    gap: "20px",
  },
  searchBarInput: {
    flex: "1",
    border: "0",
    outline: "none",
    padding: "10px 15px",
    borderRadius: "50px",
    fontSize: "1rem",
    backgroundColor: "#fff",
  },
  searchIcon: {
    color: "#1e80c9",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  customDropdown: {
    cursor: "pointer",
    position: "absolute",
    backgroundColor: "#f0f4f8", // Couleur de fond douce
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    padding: "10px",
    borderRadius: "10px",
    width: "270px",
    zIndex: 1000,
    right: 0,
    maxHeight: "500px",
    overflowY: "auto",
    border: "1px solid #e0e0e0",
  },
  dropdownItem: {
    padding: "12px",
    textDecoration: "none",
    color: "#333",
    display: "flex",
    alignItems: "center",
    fontSize: "0.9rem",
    borderRadius: "8px",
    margin: "5px 0",
    backgroundColor: "#fff",
    transition: "background-color 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)", // Ombre douce
    border: "1px solid #e0e0e0",
  },
  dropdownItemHover: {
    backgroundColor: "#e6f2fb",
  },
  notificationIcon: {
    marginRight: "10px",
    fontSize: "1.2rem",
    color: "#1e80c9",
  },
  notificationText: {
    flex: 1,
    fontWeight: "bold", // Nom de l'expéditeur en gras
    fontSize: "1rem",
  },
  notificationTime: {
    fontSize: "0.8rem",
    color: "#a0a0a0",
    marginLeft: "10px",
  },
  fixedNavbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    backgroundColor: "transparent", // Set background to transparent
    boxShadow: "none", // Remove any box shadow
  },
};

const messages = [
  { id: 1, text: "Message 1" },
  { id: 2, text: "Message 2" },
];

function SocialMediaNavbar({ onFilterChange }) {
  const { notifications, total_count, total_new_messages } = useAppSelector(
    (state) => state.notification
  );

  const messageDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isMessageHovered, setIsMessageHovered] = useState(false);
  const [isNotificationHovered, setIsNotificationHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  useOnClickOutside(messageDropdownRef, () => setIsMessagesOpen(false));
  useOnClickOutside(notificationDropdownRef, () =>
    setIsNotificationsOpen(false)
  );
  useOnClickOutside(profileDropdownRef, () => setIsProfileOpen(false));

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
  const navigate = useNavigate();

  const handleOpenDropDown = (type) => {
    if (windowWidth < 600) {
      if (type === "messages") {
        navigate("/chat");
      } else if (type === "notifications") {
        navigate("/dashboard/notifications");
      }
    } else {
      if (type === "messages") {
        setIsMessagesOpen(!isMessagesOpen);
      } else if (type === "notifications") {
        setIsNotificationsOpen(!isNotificationsOpen);
      }
    }
  };

  return (
    <Navbar
      expand="lg"
      className="pt-2 pb-1 rounded"
      style={{
        ...styles.fixedNavbar,
        backgroundColor: "white",
        position: "sticky",
      }}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="me-auto">
          <img
            src={AppLogo}
            width="100"
            height="40"
            className="d-inline-block align-top"
            alt="education"
          />
        </Navbar.Brand>
        <Nav
          style={{
            minWidth: "200px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
          }}
        >
          <ButtonSearchFormDetail onFilterChange={onFilterChange} />

          {/* Message Icon with count */}
          <div style={{ position: "relative" }} ref={messageDropdownRef}>
            <div
              style={{
                ...styles.navIcon,
                ...(isMessageHovered ? styles.navIconHover : {}),
              }}
              onClick={() => handleOpenDropDown("messages")}
              onMouseEnter={() => setIsMessageHovered(true)}
              onMouseLeave={() => setIsMessageHovered(false)}
            >
              <FaEnvelope />
              {total_new_messages > 0 && (
                <Badge style={styles.badge}>{total_new_messages}</Badge>
              )}
            </div>
            {isMessagesOpen && (
              <div style={styles.customDropdown} className="dropdown-menu show">
                {messages.map((message) => (
                  <a
                    key={message.id}
                    href="#"
                    className="dropdown-item"
                    style={styles.dropdownItem}
                  >
                    {message.text}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: "relative" }} ref={notificationDropdownRef}>
            <div
              style={{
                ...styles.navIcon,
                ...(isNotificationHovered ? styles.navIconHover : {}),
              }}
              onClick={() => handleOpenDropDown("notifications")}
              onMouseEnter={() => setIsNotificationHovered(true)}
              onMouseLeave={() => setIsNotificationHovered(false)}
            >
              <FaBell />
              {total_count > 0 && (
                <Badge style={styles.badge}>{total_count}</Badge>
              )}
            </div>
            {isNotificationsOpen && (
              <div style={styles.customDropdown}>
                {notifications.map((notification) => (
                  <span key={notification.id} onc>
                    <Link
                      to={
                        "/" +
                        "dashboard" +
                        notification.redirect_url +
                        `?notif_id=${notification.id}`
                      }
                      style={styles.dropdownItem}
                      // onClick={() => {
                      //   handleNotificationClick(notification.id); // Appelle la fonction ici
                      // }}
                      className="dropdown-item"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          styles.dropdownItemHover.backgroundColor)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          styles.dropdownItem.backgroundColor)
                      }
                      o
                    >
                      <span style={styles.notificationText}>
                        <FaEnvelope style={styles.notificationIcon} />

                        {notification?.expediteur?.username}
                        <br />
                        {notification?.notifText}
                      </span>
                      <small style={styles.notificationTime}>
                        {notification.time}
                      </small>
                    </Link>
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Profile Icon */}
          <div style={{ position: "relative" }} ref={profileDropdownRef}>
            <div
              style={{
                ...styles.navIcon,
                ...(isProfileHovered ? styles.navIconHover : {}),
              }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              onMouseEnter={() => setIsProfileHovered(true)}
              onMouseLeave={() => setIsProfileHovered(false)}
            >
              <FaUserCircle />
            </div>
            {isProfileOpen && (
              <div style={styles.customDropdown} className="dropdown-menu show">
                <Link
                  to="/dashboard/my-profile"
                  className="dropdown-item"
                  style={styles.dropdownItem}
                >
                  <FaUser /> Profile
                </Link>
                <Link
                  to="/settings/information-account"
                  className="dropdown-item"
                  style={styles.dropdownItem}
                >
                  <FaCog /> Settings
                </Link>
                <span
                  className="dropdown-item"
                  style={styles.dropdownItem}
                  onClick={() => {
                    window.localStorage.clear();
                    navigate("/");
                  }}
                >
                  <FaSignOutAlt /> Logout
                </span>
              </div>
            )}
          </div>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default SocialMediaNavbar;
