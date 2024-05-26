import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Overlay, Tooltip } from "react-bootstrap";
import Select from "react-select";
import { getAllParcours, getModulesByParcours, getLessonsByModule } from "../../api/apiData";
import { FaSearchPlus } from "react-icons/fa";
import useOnClickOutside from "../header/useOnClickOutside";

const styles = {
  filterButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#6c757d",
    color: "#fff",
    cursor: "pointer",
    position: "relative",
    marginRight: "15px",
  },
  filterDropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "#fff",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    padding: "10px",
    borderRadius: "5px",
    width: "300px",
    zIndex: 1000,
  },
  filterGroup: {
    marginBottom: "10px",
  },
  filterLabel: {
    display: "block",
    marginBottom: "5px",
  },
  filterInput: {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
  },
  customButton: {
    width: "100%",
    backgroundColor: "#007bff",
    borderColor: "#007bff",
    padding: "10px 0",
    color: "#fff",
    textAlign: "center",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

const SearchFormDetail = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    searchValue: "",
    formatFilter: "",
    parcoursFilter: [],
    moduleFilter: [],
    lessonFilter: []
  });

  const [parcoursOptions, setParcoursOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [lessonOptions, setLessonOptions] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const filterDropdownRef = useRef(null);
  const filterButtonRef = useRef(null);

  useOnClickOutside(filterDropdownRef, () => setIsFilterOpen(false));

  useEffect(() => {
    const fetchData = async () => {
      const parcours = await getAllParcours();
      setParcoursOptions(parcours.map(p => ({ value: p.id, label: p.name })));
    };
    fetchData();
  }, []);

  const handleParcoursChange = async (selectedParcours) => {
    const newFilters = { ...filters, parcoursFilter: selectedParcours.map(p => p.value) };
    setFilters(newFilters);

    const modules = await getModulesByParcours(selectedParcours.map(p => p.value));
    setModuleOptions(modules.map(m => ({ value: m.id, label: m.name })));
    setLessonOptions([]); // Reset lessons when parcours changes
  };

  const handleModulesChange = async (selectedModules) => {
    const newFilters = { ...filters, moduleFilter: selectedModules.map(m => m.value) };
    setFilters(newFilters);

    const lessons = await getLessonsByModule(selectedModules.map(m => m.value));
    setLessonOptions(lessons.map(l => ({ value: l.id, label: l.name })));
  };

  const handleLessonsChange = (selectedLessons) => {
    const newFilters = { ...filters, lessonFilter: selectedLessons.map(l => l.value) };
    setFilters(newFilters);
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setIsFilterOpen(false); // Close the dropdown after applying filters
  };

  return (
    <div style={{ position: "relative" }} ref={filterDropdownRef}>
      <div
        style={styles.filterButton}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        onMouseEnter={() => setShowOverlay(true)}
        onMouseLeave={() => setShowOverlay(false)}
        ref={filterButtonRef}
      >
        <FaSearchPlus />
      </div>
      <Overlay target={filterButtonRef.current} show={showOverlay} placement="bottom">
        {(props) => (
          <Tooltip id="overlay-tooltip" {...props}>
            Advanced search options
          </Tooltip>
        )}
      </Overlay>
      {isFilterOpen && (
        <div style={styles.filterDropdown}>
          <Form>
            <div style={styles.filterGroup}>
              <Form.Control
                type="text"
                placeholder="Search by name..."
                value={filters.searchValue}
                onChange={(e) => handleFilterChange('searchValue', e.target.value)}
              />
            </div>
            <div style={styles.filterGroup}>
              <Form.Control
                as="select"
                value={filters.formatFilter}
                onChange={(e) => handleFilterChange('formatFilter', e.target.value)}
              >
                <option value="">All Formats</option>
                <option value="cours">Cours</option>
                <option value="devoir">Devoir</option>
                <option value="ressource numérique">Ressource Numérique</option>
              </Form.Control>
            </div>
            <div style={styles.filterGroup}>
              <Select
                isMulti
                options={parcoursOptions}
                name="parcours"
                onChange={handleParcoursChange}
                classNamePrefix="select"
                value={parcoursOptions.filter(option => filters.parcoursFilter.includes(option.value))}
              />
            </div>
            <div style={styles.filterGroup}>
              <Select
                isMulti
                options={moduleOptions}
                name="module"
                onChange={handleModulesChange}
                classNamePrefix="select"
                value={moduleOptions.filter(option => filters.moduleFilter.includes(option.value))}
              />
            </div>
            <div style={styles.filterGroup}>
              <Select
                isMulti
                options={lessonOptions}
                name="lesson"
                onChange={handleLessonsChange}
                classNamePrefix="select"
                value={lessonOptions.filter(option => filters.lessonFilter.includes(option.value))}
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

export default SearchFormDetail;
