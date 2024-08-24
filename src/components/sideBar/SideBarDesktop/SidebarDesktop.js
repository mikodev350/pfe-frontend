import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import useStorage from "../../../hooks/useStorage";
import { routesSide } from "../../../constants/routes";
import styled from "styled-components";
import Hamburger from "hamburger-react";
import useOnClickOutside from "../../../util/useOnClickOutside";

const StyledSidebar = styled.div`
  position: fixed;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  top: 50px;
  width: 220px;
  height: calc(
    100vh - 50px
  ); /* Ajuster la hauteur pour qu'elle corresponde à la hauteur de la fenêtre */
  background-color: #10266f;
  color: #ffffff;
  z-index: 28;
  left: ${(props) => (props.expanded ? "0" : "-260px")};
  transition: left 0.3s ease;
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

  .nav-menu {
    padding: 0px;
  }

  .nav-item {
    margin: 3px 0;
  }

  .nav-link {
    display: flex;
    align-items: center;
    padding: 10px;
    text-decoration: none;
    color: #ffffff;
    transition: background-color 0.3s ease, transform 0.3s ease;
    border-radius: 10px;
    position: relative;
    overflow: hidden;

    &:hover {
      transform: scale(1.05);
    }

    &:hover .sidebar-icon {
      background-color: #e2e7f9;
      color: #10266f;
    }

    .sidebar-icon {
      margin-right: 19px;
      color: #ffffff;
      font-weight: 600;
      font-size: 2.5rem;
      background-color: #10266f;
      border-radius: 30%;
      padding: 10px;
      transition: background-color 0.3s ease, transform 0.3s ease;
    }

    .icon-text {
      font-size: 15px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: opacity 0.3s ease;
      //opacity: ${(props) => (props.expanded ? 1 : 0)};
      color: #ffffff;
    }
  }

  .sub-menu-container {
    padding-left: 20px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.3s ease;
    opacity: 0;
  }

  .sub-menu-container.expanded {
    max-height: 200px;
    opacity: 1;
  }
`;

const SidebarDesktop = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const sidebar = React.useRef(null);

  const [isExpanded, setIsExpanded] = useState(null);
  const [expandedEvaluations, setExpandedEvaluations] = useState(false);
  const [expandedCollaborations, setExpandedCollaborations] = useState(false); // Ajout de l'état pour "Collaborations"
  const [currentRoute] = useStorage({ key: "type" });
  useOnClickOutside(sidebar, () => {
    if (windowWidth < 900) {
      setIsExpanded(false);
    }
  });
  // if (
  //   typeof currentRoute === "string" &&
  //   routesSide.hasOwnProperty(currentRoute)
  // ) {
  const menus = routesSide[currentRoute];
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
  React.useEffect(() => {
    if (windowWidth < 900) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }, [windowWidth]);

  const toggleEvaluations = () => setExpandedEvaluations(!expandedEvaluations);
  const toggleCollaborations = () =>
    setExpandedCollaborations(!expandedCollaborations); // Fonction de basculement pour "Collaborations"
  if (isExpanded === null) return null;
  return (
    <div
      style={{
        position: "relative",
      }}
      ref={sidebar}
    >
      <StyledSidebar
        className={`sidebar-container ${isExpanded ? "expanded" : ""}`}
        // onMouseEnter={handleMouseEnter}

        expanded={isExpanded}
      >
        {windowWidth < 900 && (
          <div
            style={{
              position: "absolute",
              left: "260px",
              top: "10px",
              zIndex: 12220,
            }}
          >
            <Hamburger toggled={isExpanded} toggle={setIsExpanded} />
          </div>
        )}

        <div className="flex-column nav-menu mt-5 ">
          {menus.map((menu, key) => (
            <React.Fragment key={key}>
              {menu.name === "Évaluations" ? (
                <>
                  <Nav.Item className="nav-item" onClick={toggleEvaluations}>
                    <NavLink to="#" className="nav-link">
                      {menu.icon &&
                        React.createElement(menu.icon, {
                          className: "sidebar-icon",
                        })}
                      <span className="icon-text">{menu.name}</span>
                    </NavLink>
                  </Nav.Item>
                  <div
                    className={`sub-menu-container ${
                      expandedEvaluations ? "expanded" : ""
                    }`}
                  >
                    {menu.subRoutes.map((subRoute, subKey) => (
                      <Nav.Item key={subKey} className="nav-item">
                        <NavLink to={subRoute.route} className="nav-link">
                          {subRoute.icon &&
                            React.createElement(subRoute.icon, {
                              className: "sidebar-icon",
                            })}
                          <span className="icon-text">{subRoute.name}</span>
                        </NavLink>
                      </Nav.Item>
                    ))}
                  </div>
                </>
              ) : menu.name === "Communauté" ? (
                <>
                  <Nav.Item className="nav-item" onClick={toggleCollaborations}>
                    <NavLink to="#" className="nav-link">
                      {menu.icon &&
                        React.createElement(menu.icon, {
                          className: "sidebar-icon",
                        })}
                      <span className="icon-text">{menu.name}</span>
                    </NavLink>
                  </Nav.Item>
                  <div
                    className={`sub-menu-container ${
                      expandedCollaborations ? "expanded" : ""
                    }`}
                  >
                    {menu.subRoutes.map((subRoute, subKey) => (
                      <Nav.Item key={subKey} className="nav-item">
                        <NavLink to={subRoute.route} className="nav-link">
                          {subRoute.icon &&
                            React.createElement(subRoute.icon, {
                              className: "sidebar-icon",
                            })}
                          <span className="icon-text">{subRoute.name}</span>
                        </NavLink>
                      </Nav.Item>
                    ))}
                  </div>
                </>
              ) : (
                <Nav.Item className="nav-item">
                  <NavLink to={menu.route} className="nav-link">
                    {menu.icon &&
                      React.createElement(menu.icon, {
                        className: "sidebar-icon",
                      })}
                    <span className="icon-text">{menu.name}</span>
                  </NavLink>
                </Nav.Item>
              )}
            </React.Fragment>
          ))}
        </div>
      </StyledSidebar>
    </div>
  );
  // }
};

export default SidebarDesktop;
