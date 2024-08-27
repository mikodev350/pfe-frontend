import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useLocation } from "react-router-dom";
import {
  fetchAdvancedSearch,
  fetchUserSearch,
  setFilterType,
  clearResults,
} from "../../redux/features/search-slice";
import { setRole, setType } from "../../redux/features/role-slice";
import SidebarDesktop from "../sideBar/SideBarDesktop/SidebarDesktop";
import SideBarMobile from "../sideBar/sideBarMobile/SideBarMobile";
import SocialMediaNavbar from "../header/SocialMediaNavbar";
import ResourceResults from "../search-results/ResourceResults";
import UserResults from "../search-results/UserResults";
import ErrorPage from "../../pages/error-page/ErrorPage";

const Layout = ({ fullcontent, backgroundColorIdentification, children }) => {
  const location = useLocation();

  const dispatch = useDispatch();
  const { role, type } = useSelector((state) => state.role);
  const searchResults = useSelector((state) => state.search.results);
  const searchStatus = useSelector((state) => state.search.status);
  const filterType = useSelector((state) => state.search.filterType);
  const [prevLocation, setPrevLocation] = useState(location.pathname);

  const handleSearchResults = (filters) => {
    const { parcoursFilter, moduleFilter, lessonFilter, userType, ...rest } =
      filters;

    const params = {
      ...rest,
      parcours: parcoursFilter ? parcoursFilter.join(",") : "",
      modules: moduleFilter ? moduleFilter.join(",") : "",
      lessons: lessonFilter ? lessonFilter.join(",") : "",
    };

    if (userType) {
      dispatch(setFilterType("user"));
      dispatch(fetchUserSearch(params));
    } else {
      dispatch(setFilterType("resource"));
      dispatch(fetchAdvancedSearch(params));
    }
  };
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
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    let newType = type;
    let newRole = role;

    if (storedRole) {
      if (storedRole === "STUDENT") {
        newType = "DASHEBOARD_STUDENT";
        newRole = "STUDENT";
      } else if (storedRole === "TEACHER") {
        newType = "DASHEBOARD_TEACHER";
        newRole = "TEACHER";
      }
    } else {
      newType = "DEFAULT";
      newRole = "";
    }

    if (newType !== type) {
      dispatch(setType(newType));
    }

    if (newRole !== role) {
      dispatch(setRole(newRole));
    }

    if (location.pathname !== prevLocation) {
      dispatch(clearResults());
      setPrevLocation(location.pathname);
    }
  }, [location.pathname, prevLocation, dispatch, role, type]);

  const backgroundColor = backgroundColorIdentification ? "white" : "#F1F1F1";

  return (
    <>
      <SocialMediaNavbar onFilterChange={handleSearchResults} />
      <aside>
        <SideBarMobile />
      </aside>

      {type === "DASHEBOARD_STUDENT" && <SidebarDesktop student />}
      {type === "DASHEBOARD_TEACHER" && <SidebarDesktop teacher />}
      {type === "SETTINGS" && <SidebarDesktop settings />}
      <main style={{ backgroundColor, minHeight: "100vh",paddingLeft: windowWidth < 900 ? "20px " : "240px"}}>
        <>
          
          {fullcontent ? (
            children
          ) : (
            <Row>
              <Col md={12}>
                {searchStatus === "loading" && <div>Loading...</div>}
                {searchStatus === "succeeded" && searchResults.length === 0 ? (
                  <ErrorPage message="Aucun résultat trouvé." />
                ) : searchResults.length > 0 ? (
                  filterType === "resource" ? (
                    <ResourceResults results={searchResults} />
                  ) : (
                    <UserResults results={searchResults} />
                  )
                ) : (
                  children
                )}
              </Col>
            </Row>
          )}
        </>
      </main>
    </>
  );
};

export default Layout;
