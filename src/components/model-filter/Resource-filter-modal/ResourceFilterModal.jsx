import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { getParcoursFromLocalStorage, getModulesFromLocalStorage, getLessonsFromLocalStorage } from '../../../api/apiDataSelect';

const ResourceFilterModal = ({ show, handleClose, onFilterChange }) => {
  const [filters, setFilters] = useState({
    name: '',
    parcoursFilter: [],
    moduleFilter: [],
    lessonFilter: [],
  });

  const [parcoursOptions, setParcoursOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [lessonOptions, setLessonOptions] = useState([]);

  useEffect(() => {
    const loadOptions = () => {
      setParcoursOptions(getParcoursFromLocalStorage().map(p => ({ value: p.id, label: p.name })));
    };
    loadOptions();
  }, []);

  const handleParcoursChange = (selectedParcours) => {
    const selectedParcoursIds = selectedParcours.map(p => p.value);
    const filteredModules = getModulesFromLocalStorage().filter(m => selectedParcoursIds.includes(m.idparcour));
    setModuleOptions(filteredModules.map(m => ({ value: m.id, label: m.name })));
    setLessonOptions([]);
    setFilters({ ...filters, parcoursFilter: selectedParcoursIds });
  };

  const handleModulesChange = (selectedModules) => {
    const selectedModulesIds = selectedModules.map(m => m.value);
    const filteredLessons = getLessonsFromLocalStorage().filter(l => selectedModulesIds.includes(l.idmodule));
    setLessonOptions(filteredLessons.map(l => ({ value: l.id, label: l.name })));
    setFilters({ ...filters, moduleFilter: selectedModulesIds });
  };

  const handleLessonsChange = (selectedLessons) => {
    setFilters({ ...filters, lessonFilter: selectedLessons.map(l => l.value) });
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const applyFilters = () => {
    onFilterChange(filters);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Filtrer Ressources</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Rechercher par nom"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Select
              isMulti
              options={parcoursOptions}
              placeholder="Sélectionner Parcours"
              onChange={handleParcoursChange}
              value={parcoursOptions.filter(option => filters.parcoursFilter.includes(option.value))}
            />
          </Form.Group>
          <Form.Group>
            <Select
              isMulti
              options={moduleOptions}
              placeholder="Sélectionner Modules"
              onChange={handleModulesChange}
              value={moduleOptions.filter(option => filters.moduleFilter.includes(option.value))}
            />
          </Form.Group>
          <Form.Group>
            <Select
              isMulti
              options={lessonOptions}
              placeholder="Sélectionner Leçons"
              onChange={handleLessonsChange}
              value={lessonOptions.filter(option => filters.lessonFilter.includes(option.value))}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={applyFilters}>
          Appliquer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResourceFilterModal;
