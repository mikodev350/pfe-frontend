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
import { setType } from "../../redux/features/role-slice";
import SidebarDesktop from "../sideBar/SideBarDesktop/SidebarDesktop";
import SideBarMobile from "../sideBar/sideBarMobile/SideBarMobile";
import SocialMediaNavbar from "../header/SocialMediaNavbar";
import ResourceResults from "../search-results/ResourceResults";
import UserResults from "../search-results/UserResults";
import ErrorPage from "../../pages/error-page/ErrorPage";
import Retour from "../retour-arriere/Retour";
import CustomNavbar from "../../pages/home/other-header";
import { fetchDataAndStore } from "../../api/apiDataSelect";  // Import the data fetching function
import { getToken } from "../../util/authUtils";

const Layout = ({
  center,
  fullcontent,
  backgroundColorIdentification,
  children,
}) => {
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

       const token = getToken();  // Get the token

 // Appel de la fonction fetchDataAndStore pour récupérer et stocker les données
    const fetchData = async () => {
      try {
        if (token) {
          await fetchDataAndStore(token);  // Fetch data and store in localStorage
          console.log("Données récupérées et stockées avec succès.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();  // Call the fetchData function

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



     if ((location.pathname === "/settings/information-account") ||(location.pathname === "/settings/change-password")) {
      newType = "SETTINGS";
    }

    if (newType !== type) {
      dispatch(setType(newType));
    }
    if (location.pathname !== prevLocation) {
      dispatch(clearResults());
      setPrevLocation(location.pathname);
    }



  }, [location.pathname, prevLocation, dispatch, role, type]);

  const backgroundColor = backgroundColorIdentification ? "white" : "#F1F1F1";

  return (
    <>
      {localStorage.getItem("token") ? (
        <SocialMediaNavbar onFilterChange={handleSearchResults} />
      ) : (
        <CustomNavbar />
      )}
      <aside>
        <SideBarMobile />
      </aside>

      {type === "DASHEBOARD_STUDENT" && <SidebarDesktop student />}
      {type === "DASHEBOARD_TEACHER" && <SidebarDesktop teacher />}
      {type === "SETTINGS" && <SidebarDesktop settings />}
      <main
      
        style={{
          backgroundColor,
          minHeight: "100vh",
          paddingLeft: windowWidth < 900 || center ? "20px " : "240px",
        }}
      >
        <div className={center ? "container" : ""}>
          {fullcontent ? (
            children
          ) : (
            <Row>
              <Col md={12}>
                {searchStatus === "loading" && <div>Loading...</div>}
                {searchStatus === "succeeded" && searchResults.length === 0 ? (
                  <>
                    {" "}
                    <Retour />
                    <ErrorPage message="Aucun résultat trouvé." />
                  </>
                ) : searchResults.length > 0 ? (
                  filterType === "resource" ? (
                    <>
                      <Retour />
                      <ResourceResults results={searchResults} />
                    </>
                  ) : (
                    <>
                      {" "}
                      <Retour />
                      <UserResults results={searchResults} />
                    </>
                  )
                ) : (

                  
                  children
                )}
              </Col>
            </Row>
          )}
        </div>
      </main>
    </>
  );
};

export default Layout;
