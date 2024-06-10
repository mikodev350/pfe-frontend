import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { FaTimes } from 'react-icons/fa';
import useOnClickOutside from '../../../util/useOnClickOutside';
import { getParcoursFromLocalStorage, getModulesFromLocalStorage, getLessonsFromLocalStorage } from '../../../api/apiDataSelect';

const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '300px',
    height: '100%',
    backgroundColor: '#fff',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    padding: '20px',
    zIndex: 1000,
    overflowY: 'auto',
    transition: 'transform 0.3s ease-in-out',
    transform: 'translateX(-100%)',
  },
  sidebarOpen: {
    transform: 'translateX(0)',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
  },
  filterGroup: {
    marginBottom: '20px',
  },
  customButton: {
    width: '100%',
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    padding: '10px 0',
    color: '#fff',
    textAlign: 'center',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

const levelsOptions = [
  { value: 'AP1', label: '1ère année primaire (AP1)' },
  { value: 'AP2', label: '2ème année primaire (AP2)' },
  { value: 'AP3', label: '3ème année primaire (AP3)' },
  { value: 'AP4', label: '4ème année primaire (AP4)' },
  { value: 'AP5', label: '5ème année primaire (AP5)' },
  { value: 'AM1', label: '1ère année moyenne (AM1)' },
  { value: 'AM2', label: '2ème année moyenne (AM2)' },
  { value: 'AM3', label: '3ème année moyenne (AM3)' },
  { value: 'AM4', label: '4ème année moyenne (AM4)' },
  { value: 'AS1', label: '1ère année secondaire (AS1)' },
  { value: 'AS2', label: '2ème année secondaire (AS2)' },
  { value: 'AS3', label: '3ème année secondaire (AS3)' },
  { value: 'L1', label: '1ère année Licence (L1)' },
  { value: 'L2', label: '2ème année Licence (L2)' },
  { value: 'L3', label: '3ème année Licence (L3)' },
  { value: 'M1', label: '1ère année Master (M1)' },
  { value: 'M2', label: '2ème année Master (M2)' },
];

const teachingLevelsOptions = [
  { value: 'Primaire', label: 'Primaire' },
  { value: 'Moyen', label: 'Moyen' },
  { value: 'Lycée', label: 'Lycée' },
  { value: 'Université', label: 'Université' },
];

const SearchSidebar = ({ type, onClose, onFilterChange }) => {
  const [filters, setFilters] = useState({
    searchValue: '',
    parcoursFilter: [],
    moduleFilter: [],
    lessonFilter: [],
    subjectFilter: '',
    levelFilter: '',
    specialtyFilter: '',
    firstName: '',
    lastName: '',
    userType: '',
    parcoursType: '',
    teachingLevels: [],
    parcoursName: '',
  });

  const [parcoursOptions, setParcoursOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [lessonOptions, setLessonOptions] = useState([]);

  const sidebarRef = useRef(null);
  useOnClickOutside(sidebarRef, onClose);

  useEffect(() => {
    const loadOptions = () => {
      setParcoursOptions(getParcoursFromLocalStorage().map(p => ({ value: p.id, label: p.name })));
    };
    loadOptions();
  }, []);

  const handleParcoursChange = async (selectedParcours) => {
    const selectedParcoursIds = selectedParcours.map(p => p.value);
    const filteredModules = getModulesFromLocalStorage().filter(m => selectedParcoursIds.includes(m.idparcour));
    setModuleOptions(filteredModules.map(m => ({ value: m.id, label: m.name })));
    setLessonOptions([]); // Reset lessons when parcours changes
    setFilters({ ...filters, parcoursFilter: selectedParcoursIds });
  };

  const handleModulesChange = async (selectedModules) => {
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
    onClose(); // Close the sidebar after applying filters
  };

  return (
    <div
      style={{
        ...styles.sidebar,
        ...(type ? styles.sidebarOpen : {}),
      }}
      ref={sidebarRef}
    >
      <FaTimes style={styles.closeButton} onClick={onClose} />
      <Form>
        {type === 'parcours' && (
          <>
            <div style={styles.filterGroup}>
              <Form.Control
                type="text"
                placeholder="Search by name..."
                value={filters.searchValue}
                onChange={(e) => handleFilterChange('searchValue', e.target.value)}
              />
            </div>
            <div style={styles.filterGroup}>
              <Select
                isMulti
                options={parcoursOptions}
                name="parcours"
                placeholder="Select parcours..."
                onChange={handleParcoursChange}
                classNamePrefix="select"
                value={parcoursOptions.filter((option) => filters.parcoursFilter.includes(option.value))}
              />
            </div>
            <div style={styles.filterGroup}>
              <Select
                isMulti
                options={moduleOptions}
                name="module"
                placeholder="Select modules..."
                onChange={handleModulesChange}
                classNamePrefix="select"
                value={moduleOptions.filter((option) => filters.moduleFilter.includes(option.value))}
              />
            </div>
            <div style={styles.filterGroup}>
              <Select
                isMulti
                options={lessonOptions}
                name="lesson"
                placeholder="Select lessons..."
                onChange={handleLessonsChange}
                classNamePrefix="select"
                value={lessonOptions.filter((option) => filters.lessonFilter.includes(option.value))}
              />
            </div>
          </>
        )}
        {type === 'user' && (
          <>
            <div style={styles.filterGroup}>
              <Form.Control
                as="select"
                value={filters.userType}
                onChange={(e) => handleFilterChange('userType', e.target.value)}
              >
                <option value="">Select User Type</option>
                <option value="student">Étudiant</option>
                <option value="teacher">Professeur</option>
              </Form.Control>
            </div>
            <div style={styles.filterGroup}>
              <Form.Control
                type="text"
                placeholder="Nom"
                value={filters.lastName}
                onChange={(e) => handleFilterChange('lastName', e.target.value)}
              />
            </div>
            {filters.userType === 'student' && (
              <>
                <div style={styles.filterGroup}>
                  <Form.Control
                    as="select"
                    value={filters.parcoursType}
                    onChange={(e) => handleFilterChange('parcoursType', e.target.value)}
                  >
                    <option value="">Select Parcours Type</option>
                    <option value="academique">Académique</option>
                    <option value="continue">Continue</option>
                  </Form.Control>
                </div>
                {filters.parcoursType === 'academique' && (
                  <>
                    <div style={styles.filterGroup}>
                      <Select
                        options={levelsOptions}
                        name="level"
                        placeholder="Niveau d'enseignement"
                        onChange={(selectedOption) => handleFilterChange('levelFilter', selectedOption.value)}
                        classNamePrefix="select"
                        value={levelsOptions.find((option) => option.value === filters.levelFilter)}
                      />
                    </div>
                    {filters.levelFilter && ['L1', 'L2', 'L3', 'M1', 'M2'].includes(filters.levelFilter) && (
                      <div style={styles.filterGroup}>
                        <Form.Control
                          type="text"
                          placeholder="Spécialité"
                          value={filters.specialtyFilter}
                          onChange={(e) => handleFilterChange('specialtyFilter', e.target.value)}
                        />
                      </div>
                    )}
                  </>
                )}
                {filters.parcoursType === 'continue' && (
                  <div style={styles.filterGroup}>
                    <Form.Control
                      type="text"
                      placeholder="Nom du parcours"
                      value={filters.parcoursName}
                      onChange={(e) => handleFilterChange('parcoursName', e.target.value)}
                    />
                  </div>
                )}
              </>
            )}
            {filters.userType === 'teacher' && (
              <>
                <div style={styles.filterGroup}>
                  <Form.Control
                    type="text"
                    placeholder="Matières enseignées"
                    value={filters.subjectFilter}
                    onChange={(e) => handleFilterChange('subjectFilter', e.target.value)}
                  />
                </div>
                <div style={styles.filterGroup}>
                  <Select
                    isMulti
                    options={teachingLevelsOptions}
                    name="teachingLevels"
                    placeholder="Niveau(x) enseigné(s)"
                    onChange={(selectedOptions) =>
                      handleFilterChange('teachingLevels', selectedOptions.map((option) => option.value))
                    }
                    classNamePrefix="select"
                    value={teachingLevelsOptions.filter((option) =>
                      filters.teachingLevels.includes(option.value)
                    )}
                  />
                </div>
              </>
            )}
          </>
        )}
        <div style={styles.customButton} onClick={applyFilters}>
          Apply Filters
        </div>
      </Form>
    </div>
  );
};

export default SearchSidebar;
