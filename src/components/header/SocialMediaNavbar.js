import React, { useState, useEffect, useRef } from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Container,
  NavDropdown,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaEnvelope,
  FaUserCircle,
  FaSignOutAlt,
  FaSearchPlus,
  FaCog,
} from "react-icons/fa";
import Select from "react-select";
import useOnClickOutside from "../header/useOnClickOutside";
import {
  getAllParcours,
  getModulesByParcours,
  getLessonsByModule,
} from "../../api/apiData";

const styles = {
  navIcon: {
    fontSize: "1.5rem",
    position: "relative",
    marginRight: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    color: "#fff",
    backgroundColor: "#6c757d",
  },
  badge: {
    position: "absolute",
    top: "0",
    right: "0",
    transform: "translate(50%, -50%)",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "2px solid #fff",
  },
  navProfile: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
  },
  searchBar: {
    maxWidth: "500px",
    flex: "1 1 auto",
  },
  customDropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    padding: "10px",
    borderRadius: "5px",
    width: "300px",
    zIndex: 1000,
    right: 0,
  },
  dropdownItem: {
    padding: "10px 20px",
    textDecoration: "none",
    color: "black",
    display: "flex",
    justifyContent: "space-between",
  },
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

const notifications = [
  { id: 1, text: "Notification 1", time: "1hr" },
  { id: 2, text: "Notification 2", time: "30 mins" },
];

const messages = [
  { id: 1, text: "Message 1" },
  { id: 2, text: "Message 2" },
];

const SearchFormDetail = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    searchValue: "",
    formatFilter: "",
    parcoursFilter: [],
    moduleFilter: [],
    lessonFilter: [],
  });

  const [parcoursOptions, setParcoursOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [lessonOptions, setLessonOptions] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterDropdownRef = useRef(null);
  useOnClickOutside(filterDropdownRef, () => setIsFilterOpen(false));

  useEffect(() => {
    const fetchData = async () => {
      const parcours = await getAllParcours();
      setParcoursOptions(parcours.map((p) => ({ value: p.id, label: p.name })));
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
                value={filters.searchValue}
                onChange={(e) =>
                  handleFilterChange("searchValue", e.target.value)
                }
              />
            </div>
            <div style={styles.filterGroup}>
              <Form.Control
                as="select"
                value={filters.formatFilter}
                onChange={(e) =>
                  handleFilterChange("formatFilter", e.target.value)
                }
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
                onChange={handleLessonsChange}
                classNamePrefix="select"
                value={lessonOptions.filter((option) =>
                  filters.lessonFilter.includes(option.value)
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

function SocialMediaNavbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const messageDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useOnClickOutside(messageDropdownRef, () => setIsMessagesOpen(false));
  useOnClickOutside(notificationDropdownRef, () =>
    setIsNotificationsOpen(false)
  );
  useOnClickOutside(filterDropdownRef, () => setIsFilterOpen(false));

  const handleFilterChange = (newFilters) => {
    console.log("Applied Filters: ", newFilters);
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm p-3 rounded">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="me-auto">
          <img
            src="/logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="education"
          />{" "}
          MySocial
        </Navbar.Brand>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Form className="d-flex mx-2" style={styles.searchBar}>
            <FormControl
              type="search"
              placeholder="Search"
              className="me-auto"
              aria-label="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form>
          <SearchFormDetail onFilterChange={handleFilterChange} />
        </div>
        <Nav className="ms-auto">
          <div style={{ position: "relative" }} ref={messageDropdownRef}>
            <div
              style={styles.navIcon}
              onClick={() => setIsMessagesOpen(!isMessagesOpen)}
            >
              <FaEnvelope />
              <Badge pill style={styles.badge}>
                {messages.length}
              </Badge>
            </div>
            {isMessagesOpen && (
              <div style={styles.customDropdown}>
                {messages.map((message) => (
                  <div key={message.id} style={styles.dropdownItem}>
                    {message.text}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ position: "relative" }} ref={notificationDropdownRef}>
            <div
              style={styles.navIcon}
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <FaBell />
              <Badge pill style={styles.badge}>
                {notifications.length}
              </Badge>
            </div>
            {isNotificationsOpen && (
              <div style={styles.customDropdown}>
                {notifications.map((notification) => (
                  <div key={notification.id} style={styles.dropdownItem}>
                    {notification.text}
                    <small className="text-muted">{notification.time}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
          <NavDropdown
            title={<FaUserCircle style={{ fontSize: "1.5rem" }} />}
            id="nav-dropdown-profile"
            align="end"
            className="no-arrow"
            style={styles.navProfile}
          >
            <NavDropdown.Item
              as={Link}
              to="/profile"
              style={styles.dropdownItem}
            >
              <FaUserCircle /> My Profile
            </NavDropdown.Item>
            <NavDropdown.Item
              as={Link}
              to="/settings"
              style={styles.dropdownItem}
            >
              <FaCog /> Settings
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              as={Link}
              to="/logout"
              style={styles.dropdownItem}
            >
              <FaSignOutAlt /> Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default SocialMediaNavbar;
