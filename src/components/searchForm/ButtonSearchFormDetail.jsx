import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import ResourceFilterModal from '../model-filter/Resource-filter-modal/ResourceFilterModal';
import UserFilterModal from '../model-filter/User-filter-modal/UserFilterModal';
import { fetchAdvancedSearch, fetchUserSearch, setFilterType } from "../../redux/features/search-slice";

const ButtonSearchFormDetail = () => {
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
      <Button variant="yellow" onClick={() => setShowResourceModal(true)}>
        <FaSearch /> Filtrer Ressources
      </Button>
      <Button variant="primary" className="ml-2" onClick={() => setShowUserModal(true)}>
        <FaSearch /> Filtrer Utilisateurs
      </Button>

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

export default ButtonSearchFormDetail;
