// path: ./src/components/searchForm/SearchFormDetail.js

import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import { FaSearch } from "react-icons/fa";
import useOnClickOutside from "../../util/useOnClickOutside";
import axios from "axios";

let styles = {
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
    parcoursFilter: [],
    moduleFilter: [],
    lessonFilter: [],
    resourceFilter: [],
  });

  const [parcoursOptions, setParcoursOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [lessonOptions, setLessonOptions] = useState([]);
  const [resourceOptions, setResourceOptions] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterDropdownRef = useRef(null);
  useOnClickOutside(filterDropdownRef, () => setIsFilterOpen(false));

  useEffect(() => {
    const fetchData = async () => {
      const parcours = await getAllParcours();
      setParcoursOptions(parcours.map((p) => ({ value: p.id, label: p.name })));

      const resources = await getResources();
      setResourceOptions(
        resources.map((r) => ({ value: r.id, label: r.name }))
      );
    };
    fetchData();
  }, []);

  const handleParcoursChange = async (selectedParcours) => {
    const newFilters = {
      ...filters,
      parcoursFilter: selectedParcours.map((p) => p.value),
    };
    setFilters(newFilters);

    const modules = await getModulesByParcours(
      selectedParcours.map((p) => p.value)
    );
    setModuleOptions(modules.map((m) => ({ value: m.id, label: m.name })));
    setLessonOptions([]); // Reset lessons when parcours changes
  };

  const handleModulesChange = async (selectedModules) => {
    const newFilters = {
      ...filters,
      moduleFilter: selectedModules.map((m) => m.value),
    };
    setFilters(newFilters);

    const lessons = await getLessonsByModule(
      selectedModules.map((m) => m.value)
    );
    setLessonOptions(lessons.map((l) => ({ value: l.id, label: l.name })));
  };

  const handleLessonsChange = (selectedLessons) => {
    const newFilters = {
      ...filters,
      lessonFilter: selectedLessons.map((l) => l.value),
    };
    setFilters(newFilters);
  };

  const handleResourcesChange = (selectedResources) => {
    const newFilters = {
      ...filters,
      resourceFilter: selectedResources.map((r) => r.value),
    };
    setFilters(newFilters);
  };

  const applyFilters = async () => {
    const queryParams = new URLSearchParams();

    if (filters.parcoursFilter.length) {
      queryParams.append("parcours", filters.parcoursFilter.join(","));
    }
    if (filters.moduleFilter.length) {
      queryParams.append("modules", filters.moduleFilter.join(","));
    }
    if (filters.lessonFilter.length) {
      queryParams.append("lessons", filters.lessonFilter.join(","));
    }
    if (filters.resourceFilter.length) {
      queryParams.append("resources", filters.resourceFilter.join(","));
    }

    const response = await axios.get(
      `http://localhost:1337/api/custom-search/advanced?${queryParams.toString()}`
    );

    onFilterChange(response.data);
    setIsFilterOpen(false); // Close the dropdown after applying filters
  };

  return (
    <div style={{ position: "relative" }} ref={filterDropdownRef}>
      <div
        style={styles.filterButton}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        Recherche Avancée
      </div>
      {isFilterOpen && (
        <div style={styles.filterDropdown}>
          <Form>
            <div style={styles.filterGroup}>
              <Select
                isMulti
                options={parcoursOptions}
                name="parcours"
                placeholder="Select parcours..."
                onChange={handleParcoursChange}
                classNamePrefix="select"
                value={parcoursOptions.filter((option) =>
                  filters.parcoursFilter.includes(option.value)
                )}
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
                value={moduleOptions.filter((option) =>
                  filters.moduleFilter.includes(option.value)
                )}
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
                value={lessonOptions.filter((option) =>
                  filters.lessonFilter.includes(option.value)
                )}
              />
            </div>
            <div style={styles.filterGroup}>
              <Select
                isMulti
                options={resourceOptions}
                name="resource"
                placeholder="Select resources..."
                onChange={handleResourcesChange}
                classNamePrefix="select"
                value={resourceOptions.filter((option) =>
                  filters.resourceFilter.includes(option.value)
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

export default SearchFormDetail;
