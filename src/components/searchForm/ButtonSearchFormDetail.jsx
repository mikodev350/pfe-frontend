import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import ResourceFilterModal from '../model-filter/Resource-filter-modal/ResourceFilterModal';
import UserFilterModal from '../model-filter/User-filter-modal/UserFilterModal';
import { fetchAdvancedSearch, fetchUserSearch, setFilterType } from "../../redux/features/search-slice";
import styled from 'styled-components';
import useOnClickOutside from '../../util/useOnClickOutside';
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
    width: "300px",
    zIndex: 1000,
    right: -100,
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



const ButtonSearchFormDetail = () => {
 
 
  const searchDropdownRef = React.useRef(null);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
useOnClickOutside(searchDropdownRef, () => setIsMessagesOpen(false));

  const [isMessageHovered, setIsMessageHovered] = useState(false);


  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const dispatch = useDispatch();

  const handleResourceModalClose = () => setShowResourceModal(false);
  const handleUserModalClose = () => setShowUserModal(false);

  const handleResourceSearch = (filters) => {
    dispatch(setFilterType('resource'));
    const { parcoursFilter, moduleFilter, lessonFilter, ...rest } = filters;
    const params = {
      ...rest,
      parcours: parcoursFilter ? parcoursFilter.join(',') : '',
      modules: moduleFilter ? moduleFilter.join(',') : '',
      lessons: lessonFilter ? lessonFilter.join(',') : '',
    };
    dispatch(fetchAdvancedSearch(params));
  };

  const handleUserSearch = (filters) => {
    dispatch(setFilterType('user'));
    dispatch(fetchUserSearch(filters));
  };
  
  return (
    <>
             <div style={{ position: "relative" }} ref={searchDropdownRef}>
            <div
              style={{
                ...styles.navIcon,
                ...(isMessageHovered ? styles.navIconHover : {}),
              }}
              onClick={() => setIsMessagesOpen(!isMessagesOpen)}
              onMouseEnter={() => setIsMessageHovered(true)}
              onMouseLeave={() => setIsMessageHovered(false)}
            >
              <FaSearch />
               
            </div>
            {isMessagesOpen && (
              <div style={styles.customDropdown} className="dropdown-menu show">
                 <div
                    onClick={() => setShowResourceModal(true)}
                    className="dropdown-item"
                    style={styles.dropdownItem}
                  >
                    Ressources
                  </div>
                  <div
                 
                      onClick={() => setShowUserModal(true)}
                    className="dropdown-item"
                    style={styles.dropdownItem}
                  >
                    Utilisateurs
                  </div>
         
              </div>
            )}
          </div>

     

      <ResourceFilterModal
        show={showResourceModal}
        handleClose={handleResourceModalClose}
        onFilterChange={handleResourceSearch}
      />

      <UserFilterModal
        show={showUserModal}
        handleClose={handleUserModalClose}
        onFilterChange={handleUserSearch}
      />
    </>
  );
};

const ButtonNavbar  = styled(Button)`
   width: 150px !important;
   font-size: 15px !important

`
export default ButtonSearchFormDetail;
