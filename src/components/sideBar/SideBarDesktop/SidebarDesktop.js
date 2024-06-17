import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./SidebarDesktop.css";
import useStorage from "../../../hooks/useStorage";
import { routesSide } from "../../../constants/routes";
import styled from "styled-components";
const StyledSidebar = styled.div`
  position: fixed;
  top: 100px;
  z-index: 28;
`;
const SidebarDesktop = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentRoute] = useStorage({ key: "type" });

  if (
    typeof currentRoute === "string" &&
    routesSide.hasOwnProperty(currentRoute)
  ) {
    const menus = routesSide[currentRoute];

    const handleMouseEnter = () => setIsExpanded(true);
    const handleMouseLeave = () => setIsExpanded(false);

    return (
      <StyledSidebar
        className={`sidebar-container ${isExpanded ? "expanded" : "collapsed"}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Nav className="flex-column nav-menu">
          {menus.map((menu, key) => (
            <Nav.Item key={key} className="nav-item">
              <NavLink to={menu.route} className="nav-link">
                {menu.icon &&
                  React.createElement(menu.icon, { className: "sidebar-icon" })}
                <span className="icon-text">{menu.name}</span>
              </NavLink>
            </Nav.Item>
          ))}
        </Nav>
      </StyledSidebar>
    );
  }

  return null;
};

export default SidebarDesktop;
