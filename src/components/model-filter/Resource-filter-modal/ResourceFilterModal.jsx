import React, { useState, useEffect } from 'react';
import { Modal, Button, Form,Container,Row,Col } from 'react-bootstrap';
import Select from 'react-select';
import { getParcoursFromLocalStorage, getModulesFromLocalStorage, getLessonsFromLocalStorage } from '../../../api/apiDataSelect';
import styled from 'styled-components';


const StyledSelect = styled(Select)`
  .css-13cymwt-control {
    border-radius: 10px !important;
    border: 1px solid #0066cc !important;
    height: 50px !important;
    box-shadow: none !important;
    background-color: #f8f9fa !important;

    &:hover,
    &:focus,
    &:active {
      border-radius: 10px !important;
      border-color: #0056b3 !important; /* Border color on focus */
    }
  }

  .css-1fdsijx-ValueContainer {
    padding: 0 12px !important;
  }

  .css-qbdosj-Input input {
    font-size: 16px !important;
    padding: 5px 0 !important;
    color: #695057 !important;
  }

  .css-1jqq78o-placeholder {
    font-size: 16px !important;
    color: #6c757d !important;
  }

  .css-1nmdiq5-menu {
    border-radius: 10px !important;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1) !important;
  }

  .css-1xc3v61-indicatorContainer {
    padding: 8px !important;
  }

  .css-1fdsijx-ValueContainer .css-12jo7m5-singleValue {
    font-size: 16px !important;
    color: #495057 !important;
  }

  .css-13cymwt-control:focus-within {
    border-radius: 10px !important;
    border-color: #0056b3 !important;
    outline: none !important;
  }
`;

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
            <br />
          </Form.Group>
          <Form.Group>
            <Select
              isMulti
              options={parcoursOptions}
              placeholder="Sélectionner Parcours"
              onChange={handleParcoursChange}
              value={parcoursOptions.filter(option => filters.parcoursFilter.includes(option.value))}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? '#0066cc' : '#ced4da',
                  borderRadius: '20px',
                  height: '45px', // Reduced height
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#0056b3',
                  },
                }),
                placeholder: (baseStyles) => ({
                  ...baseStyles,
                  color: '#6c757d',
                  fontSize: '14px', // Slightly smaller font size
                }),
                multiValue: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: '#e9ecef',
                  borderRadius: '10px',
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '20px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                }),
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: state.isFocused ? '#f8f9fa' : 'white',
                  color: '#495057',
                  '&:active': {
                    backgroundColor: '#0066cc',
                    color: 'white',
                  },
                }),
              }}
            />
            <br />
          </Form.Group>
          <Form.Group>
            <Select
              isMulti
              options={moduleOptions}
              placeholder="Sélectionner Modules"
              onChange={handleModulesChange}
              value={moduleOptions.filter(option => filters.moduleFilter.includes(option.value))}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? '#0066cc' : '#ced4da',
                  borderRadius: '20px',
                  height: '45px', // Reduced height
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#0056b3',
                  },
                }),
                placeholder: (baseStyles) => ({
                  ...baseStyles,
                  color: '#6c757d',
                  fontSize: '14px', // Slightly smaller font size
                }),
                multiValue: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: '#e9ecef',
                  borderRadius: '10px',
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '20px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                }),
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: state.isFocused ? '#f8f9fa' : 'white',
                  color: '#495057',
                  '&:active': {
                    backgroundColor: '#0066cc',
                    color: 'white',
                  },
                }),
              }}
            />
            <br />
          </Form.Group>
          <Form.Group>
            <Select
              isMulti
              options={lessonOptions}
              placeholder="Sélectionner Leçons"
              onChange={handleLessonsChange}
              value={lessonOptions.filter(option => filters.lessonFilter.includes(option.value))}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? '#0066cc' : '#ced4da',
                  borderRadius: '20px',
                  height: '45px', // Reduced height
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#0056b3',
                  },
                }),
                placeholder: (baseStyles) => ({
                  ...baseStyles,
                  color: '#6c757d',
                  fontSize: '14px', // Slightly smaller font size
                }),
                multiValue: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: '#e9ecef',
                  borderRadius: '10px',
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '20px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                }),
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: state.isFocused ? '#f8f9fa' : 'white',
                  color: '#495057',
                  '&:active': {
                    backgroundColor: '#0066cc',
                    color: 'white',
                  },
                }),
              }}
            />
            <br />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Container>
          <Row>
            <Col sm={6}>
            <Button variant="secondary" onClick={handleClose}               
        style={{
                width: "100%",
                height: "52px",
                backgroundColor: "#007bff",
                borderColor: "#007bff",
              }}>
          Annuler
        </Button>
            </Col>
                        <Col sm={6}> <Button variant="primary" onClick={applyFilters} 
         style={{
                width: "100%",
                height: "52px",
                backgroundColor: "#007bff",
                borderColor: "#007bff",
              }}
              >
          Appliquer
        </Button>
        </Col>
          </Row>
        </Container>
       
      </Modal.Footer>
    </Modal>
  );
};

export default ResourceFilterModal;
