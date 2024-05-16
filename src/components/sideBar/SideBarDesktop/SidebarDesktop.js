import React from "react";
import { Nav, NavItem } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./SidebarDesktop.css";
import { routesSide } from "../../../constants/routes";
import useStorage from "../../../hooks/useStorage";

function SidebarDesktop() {
  const [currentRoute] = useStorage({ key: "type" });

  if (
    typeof currentRoute === "string" &&
    routesSide.hasOwnProperty(currentRoute)
  ) {
    const menus = routesSide[currentRoute];

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        Nav,
        { variant: "pills", className: "flex-column text-left" },
        menus.map((menu, key) =>
          React.createElement(
            NavItem,
            { key: key, className: "mb-20" },
            React.createElement(
              NavLink,
              { to: menu.route, className: "nav-link padding-Navlink" },
              menu.icon &&
                React.createElement(menu.icon, {
                  style: { margin: "5px 10px 10px 0px" },
                }),
              menu.name
            )
          )
        )
      )
    );
  }

  return null;
}

export default SidebarDesktop;

// import React, { useState } from "react";
// import { Nav, NavItem } from "react-bootstrap";
// import { NavLink } from "react-router-dom";
// import "./SideBar.css";
// import { routesSide } from "../../../constants/routes";
// import useStorage from "../../../hooks/useStorage";

// function SidebarDesktop() {
//     const [currentRoute] = useStorage({ key: "type" });

//     if (typeof currentRoute === "string" && routesSide.hasOwnProperty(currentRoute)) {
//         const menus = routesSide[currentRoute];

//         return React.createElement(
//             React.Fragment,
//             null,
//             React.createElement(
//                 Nav,
//                 { variant: "pills", className: "flex-column text-left" },
//                 menus.map((menu, key) =>
//                     React.createElement(
//                         NavItem,
//                         { key: key, className: "mb-20" },
//                         React.createElement(
//                             NavLink,
//                             { to: menu.route, className: "nav-link padding-Navlink" },
//                             menu.icon && React.createElement(menu.icon, { style: { margin: "5px 10px 10px 0px" } }),
//                             menu.name
//                         )
//                     )
//                 )
//             )
//         );
//     }

//     return null;
// }

// export default SidebarDesktop;
