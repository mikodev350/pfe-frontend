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
import CustomNavbar from "../../pages/home/other-header";

const Layout = ({ fullcontent, backgroundColorIdentification, children }) => {
  const location = useLocation();
  const currentRoute = location.pathname.split("/")[1].toUpperCase();

  const dispatch = useDispatch();
  const { role, type } = useSelector((state) => state.role);
  const searchResults = useSelector((state) => state.search.results);
  const searchStatus = useSelector((state) => state.search.status);
  const filterType = useSelector((state) => state.search.filterType);
  const [prevLocation, setPrevLocation] = useState(location.pathname);

  const handleSearchResults = (filters) => {
    const { parcoursFilter, moduleFilter, lessonFilter, userType, ...rest } = filters;

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

  useEffect(() => {
    let newType;
    let newRole = role;

    switch (currentRoute) {
      case "STUDENT":
        newType = "DASHEBOARD_STUDENT";
        newRole = "STUDENT";
        break;
      case "TEACHER":
        newType = "DASHEBOARD_TEACHER";
        newRole = "TEACHER";
        break;
      case "SETTINGS":
        newType = "SETTINGS";
        break;
      default:
        const storedRole = localStorage.getItem("role");
        if (storedRole === "STUDENT") {
          newType = "DASHEBOARD_STUDENT";
        } else if (storedRole === "TEACHER") {
          newType = "DASHEBOARD_TEACHER";
        } else {
          newType = "DEFAULT";
        }
        break;
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
  }, [currentRoute, location.pathname, prevLocation, dispatch, role, type]);

  const backgroundColor = backgroundColorIdentification ? "white" : "#F1F1F1";

  return (
    <>
      {/* <SocialMediaNavbar onFilterChange={handleSearchResults} /> */}
      <CustomNavbar />
      <aside>
        <SideBarMobile />
      </aside>
      <main style={{ backgroundColor, minHeight: "100vh" }}>
        <Container>
          {fullcontent ? (
            children
          ) : (
            <Row>
              <Col md={3} className="rc-side-bar">
                {type === "DASHEBOARD_STUDENT" && <SidebarDesktop student />}
                {type === "DASHEBOARD_TEACHER" && <SidebarDesktop teacher />}
                {type === "SETTINGS" && <SidebarDesktop settings />}
              </Col>
              <Col md={9}>
                {searchStatus === "loading" && <div>Loading...</div>}
                {searchStatus === "succeeded" && searchResults.length === 0 ? (
                  <ErrorPage message="Aucun résultat trouvé." />
                ) : (
                  searchResults.length > 0 ? (
                    filterType === "resource" ? (
                      <ResourceResults results={searchResults} />
                    ) : (
                      <UserResults results={searchResults} />
                    )
                  ) : (
                    children
                  )
                )}
              </Col>
            </Row>
          )}
        </Container>
      </main>
    </>
  );
};

export default Layout;
