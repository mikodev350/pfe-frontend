import React, { useEffect, useRef, useState } from "react";
import Nav from "react-bootstrap/Nav";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  onUpdateSidebarStatus,
  sidebarState,
} from "../../../features/sidebarSlice";
import { routesSide } from "../../../constants/routes";

import "./SideBarMobile.css";
import { useAppSelector } from "../../../hooks/hooks";
import useStorage from "../../../hooks/useStorage";
import { AiOutlineClose } from "react-icons/ai";

import Button from "react-bootstrap/Button";

function SideBarMobile() {
  const [currentRoute] = useStorage({ key: "type" });

  const location = useLocation(); // Utilisez useLocation ici au niveau supérieur du composant
  const dispatch = useDispatch();
  let linkItems = [
    { route: "/", name: "Home" },
    { route: "/signup", name: "Sign Up" },
    { route: "/login", name: "Login" },
  ];

  // Maintenant, isActive est une fonction à l'intérieur du composant SideBarMobile
  function isActive(route) {
    return route === location.pathname;
  }
  if (
    typeof currentRoute === "string" &&
    routesSide.hasOwnProperty(currentRoute)
  ) {
    const menus = routesSide[currentRoute];
    linkItems = linkItems.concat(menus);
  }

  const [blur, setBlur] = useState(false);
  const menu = useRef(null);
  const { isOpenSideBar } = useAppSelector(sidebarState);

  const handleClickOutside = (event) => {
    if (menu.current && !menu.current.contains(event.target)) {
      if (isOpenSideBar) return dispatch(onUpdateSidebarStatus());
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [isOpenSideBar, dispatch]);

  useEffect(() => {
    if (!isOpenSideBar) {
      const delayDebounceFn = setTimeout(() => {
        setBlur(isOpenSideBar);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setBlur(isOpenSideBar);
    }
  }, [isOpenSideBar]);

  function closeNav() {
    dispatch(onUpdateSidebarStatus());
  }

  return (
    <>
      <div
        className="fade"
        style={{
          position: "fixed",
          bottom: 0,
          top: 0,
          right: 0,
          left: 0,
          zIndex: 20,
          backgroundColor: "black",
          transition: "1s",
          opacity: isOpenSideBar ? "0.8" : 0,
          display: blur ? "block" : "none",
        }}
      ></div>

      <div
        ref={menu}
        style={{
          position: "fixed",
          bottom: 0,
          top: 0,
          left: isOpenSideBar ? 0 : "-400px",
          width: "75%",
          maxWidth: "400px",
          zIndex: 100,
          backgroundColor: "white",
          transition: "0.5s",
        }}
        className={isOpenSideBar ? "sidenav open" : "sidenav"}
      >
        <span>
          {" "}
          <Button
            variant="outline-light"
            // className="closebtn"
            className="button-side-bar-close"
            onClick={closeNav}
            style={{ width: "20px !important " }}
          >
            <AiOutlineClose size={22} />
          </Button>{" "}
        </span>

        <Nav className="flex-column mt-5">
          {linkItems.map((item, index) => (
            <Link
              key={index}
              to={item.route}
              className={`nav-link ${isActive(item.route) ? "active" : ""}`}
              onClick={closeNav}
            >
              {item.name}
            </Link>
          ))}
        </Nav>
      </div>
    </>
  );
}

export default SideBarMobile;
