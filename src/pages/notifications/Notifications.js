import React from "react";
import { useAppSelector } from "../../hooks/hooks";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";

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
    backgroundColor: "#fff",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    padding: "10px",
    borderRadius: "10px",
    width: "250px",
    zIndex: 1000,
    right: 0,
    maxHeight: "400px", // Augmente la hauteur maximale
    overflowY: "auto", // Active le défilement vertical
    border: "1px solid #e0e0e0", // Ajoute une bordure légère
  },
  dropdownItem: {
    padding: "10px",
    textDecoration: "none",
    color: "#10266f",
    display: "flex",
    alignItems: "center",
    fontSize: "0.9rem",
    borderRadius: "8px",
    margin: "5px 0",
    backgroundColor: "#f9f9f9",
    transition: "background-color 0.3s ease",
  },
  dropdownItemHover: {
    backgroundColor: "#e6f2fb", // Change la couleur au survol
  },
  notificationIcon: {
    marginRight: "10px",
    fontSize: "1.2rem",
    color: "#1e80c9",
  },
  notificationText: {
    flex: 1,
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

export default function Notifications() {
  const { notifications, total_count, total_new_messages } = useAppSelector(
    (state) => state.notification
  );
  return (
    <div>
      Notifications
      <hr />
      {notifications.map((notification) => (
        <Link
          to={
            "/" +
            "dashboard" +
            notification.redirect_url +
            `?notif_id=${notification.id}`
          }
          key={notification.id}
          style={styles.dropdownItem}
          className="dropdown-item"
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.dropdownItemHover.backgroundColor)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.dropdownItem.backgroundColor)
          }
        >
          <FaEnvelope style={styles.notificationIcon} />
          <span style={styles.notificationText}>
            {notification?.expediteur?.username + " " + notification?.notifText}
          </span>
          <small style={styles.notificationTime}>{notification.time}</small>
        </Link>
      ))}
    </div>
  );
}
