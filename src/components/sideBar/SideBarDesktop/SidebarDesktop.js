import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import useStorage from "../../../hooks/useStorage";
import { routesSide } from "../../../constants/routes";
import styled from "styled-components";

// Définition des styles pour la barre latérale
const StyledSidebar = styled.div`
// margin-left:5px;
  position: fixed;
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  top: 50px; /* Ajustez cette valeur en fonction de la hauteur de votre navbar */
  left: -20;
  width: 60px; /* Longueur minimisée de la barre latérale */
  height: calc(150vh - 60px); /* Ajustez la hauteur pour prendre en compte le décalage du haut */
  background-color: #10266f; /* Couleur de fond de la barre latérale */
  color: #FFFFFF; /* Couleur du texte */
  
  z-index: 28;
  transition: width 0.3s ease;
  // overflow-y: auto;
    overflow: hiden;

  // border-radius: 20px; /* Ajout du border-radius */

  &.expanded {
    width: 220px; /* Longueur de la barre latérale lorsqu'elle est étendue */
  }

  &.collapsed {
    width: 60px; /* Longueur de la barre latérale lorsqu'elle est réduite */
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
    color: #ffffff; /* Texte en blanc */
    transition: background-color 0.3s ease, transform 0.3s ease;
    border-radius: 10px; /* Ajout du border-radius */
    position: relative; /* Pour positionner le pseudo-élément */
    overflow: hidden;

    &:hover {
      transform: scale(1.05); /* Effet de zoom au survol */
    }

    &:hover .sidebar-icon {
      background-color: #e2e7f9 ; /* Arrière-plan des icônes au survol */
      color: #10266f /* Couleur des icônes au survol */
    }

    .sidebar-icon {
    
      margin-right: 19px;
      color: #ffffff; /* Couleur des icônes */
      font-weight: 600; /* Poids des icônes */
      font-size: 2.5rem; /* Taille des icônes */
      background-color: #10266f; /* Couleur de fond des icônes */
      border-radius: 30%; /* Forme ronde des icônes */
      padding: 10px; /* Espacement autour des icônes */
      transition: background-color 0.3s ease, transform 0.3s ease;
    }

    .icon-text {
      font-size: 15px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: opacity 0.3s ease;

      /* Masquer le texte lorsque la barre latérale est réduite */
      opacity: ${(props) => (props.expanded ? 1 : 0)};
      color: #ffffff; /* Assurez-vous que le texte soit en blanc */
    }
  }
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
        expanded={isExpanded} // Passer l'état d'expansion au styled-component
      >
        <Nav className="flex-column nav-menu mt-5 ">
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
