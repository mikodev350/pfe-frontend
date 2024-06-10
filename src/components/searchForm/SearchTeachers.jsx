import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { FaSearchPlus } from 'react-icons/fa';
import useOnClickOutside from '../header/useOnClickOutside';
import { getAllTeachers, getSubjects, getLevels } from '../../api/apiData';

const styles = {
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#6c757d',
    color: '#fff',
    cursor: 'pointer',
    position: 'relative',
    marginRight: '15px',
  },
  filterDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    padding: '10px',
    borderRadius: '5px',
    width: '300px',
    zIndex: 1000,
  },
  filterGroup: {
    marginBottom: '10px',
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

const SearchTeachers = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    teacherName: '',
    subjectFilter: [],
    levelFilter: [],
  });

  const [subjectOptions, setSubjectOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterDropdownRef = useRef(null);
  useOnClickOutside(filterDropdownRef, () => setIsFilterOpen(false));

  useEffect(() => {
    const fetchData = async () => {
      const subjects = await getSubjects();
      setSubjectOptions(subjects.map((s) => ({ value: s.id, label: s.name })));

      const levels = await getLevels();
      setLevelOptions(levels.map((l) => ({ value: l.id, label: l.name })));
    };
    fetchData();
  }, []);

  const handleSubjectChange = (selectedSubjects) => {
    const newFilters = {
      ...filters,
      subjectFilter: selectedSubjects.map((s) => s.value),
    };
    setFilters(newFilters);
  };

  const handleLevelChange = (selectedLevels) => {
    const newFilters = {
      ...filters,
      levelFilter: selectedLevels.map((l) => l.value),
    };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setIsFilterOpen(false); // Close the dropdown after applying filters
  };

  return (
    <div style={{ position: 'relative' }} ref={filterDropdownRef}>
      <div
        style={styles.filterButton}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <FaSearchPlus />
      </div>
      {isFilterOpen && (
        <div style={styles.filterDropdown}>
          <Form>
            <div style={styles.filterGroup}>
              <Form.Control
                type="text"
                placeholder="Search by name..."
                value={filters.teacherName}
                onChange={(e) =>
                  setFilters({ ...filters, teacherName: e.target.value })
                }
              />
            </div>
            <div style={styles.filterGroup}>
              <Select
                isMulti
                options={subjectOptions}
                name="subject"
                placeholder="Select subjects..."
                onChange={handleSubjectChange}
                classNamePrefix="select"
                value={subjectOptions.filter((option) =>
                  filters.subjectFilter.includes(option.value)
                )}
              />
            </div>
            <div style={styles.filterGroup}>
              <Select
                isMulti
                options={levelOptions}
                name="level"
                placeholder="Select levels..."
                onChange={handleLevelChange}
                classNamePrefix="select"
                value={levelOptions.filter((option) =>
                  filters.levelFilter.includes(option.value)
                )}
              />
            </div>
            <div style={styles.customButton} onClick={applyFilters}>
              Apply Filters
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default SearchTeachers;
