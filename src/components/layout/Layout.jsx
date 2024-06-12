import React, { useEffect } from "react";
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
import useStorage from "../../hooks/useStorage";
import SidebarDesktop from "../sideBar/SideBarDesktop/SidebarDesktop";
import SideBarMobile from "../sideBar/sideBarMobile/SideBarMobile";
import SocialMediaNavbar from "../header/SocialMediaNavbar";
import ResourceResults from "../search-results/ResourceResults";
import UserResults from "../search-results/UserResults";

const Layout = ({ fullcontent, backgroundColorIdentification, children }) => {
  const role = React.useMemo(() => localStorage.getItem("role"), []);
  const location = useLocation();
  const currentRoute = location.pathname.split("/")[1].toUpperCase();
  const [, , setType] = useStorage({ key: "type" });

  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.search.results);
  const searchStatus = useSelector((state) => state.search.status);
  const filterType = useSelector((state) => state.search.filterType);

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
    if (currentRoute === "STUDENT") {
      setType("type", "DASHEBOARD_STUDENT");
    } else if (currentRoute === "TEACHER") {
      setType("type", "DASHEBOARD_TEACHER");
    } else if (currentRoute === "SETTINGS") {
      if (role === "STUDENT") setType("type", "SETTINGS_STUDENT");
      else setType("type", "SETTINGS_TEACHER");
    }
    if(role ==='STUDENT'){
            setType("type", "DASHEBOARD_STUDENT");

    }else{
      setType("type", "DASHEBOARD_TEACHER");
    }

    // Clear search results and filters when the location changes
    dispatch(clearResults());
  }, [currentRoute, role, setType, dispatch, location.pathname]);

  const backgroundColor = backgroundColorIdentification ? "white" : "#F1F1F1";

  return (
    <>
      <SocialMediaNavbar onFilterChange={handleSearchResults} />
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
                {role === "STUDENT" ? (
                  <SidebarDesktop student />
                ) : role === "TEACHER" ? (
                  <SidebarDesktop teacher />
                ) : (
                  <SidebarDesktop />
                )}
              </Col>
              <Col md={9}>
                {searchStatus === "loading" && <div>Loading...</div>}
                {searchResults.length > 0 ? (
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
        </Container>
      </main>
    </>
  );
};

export default Layout;
