import React from "react";
import { Form } from "react-bootstrap";

const SearchForm = ({ searchValue, onSearch }) => {
  const handleInputChange = (e) => {
    onSearch(e.target.value); // Call the callback function with the new search value
  };

  // State to track the width of the screen
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);

  // Function to update state based on screen width
  const updateScreenSize = () => {
    setIsSmallScreen(window.innerWidth <= 991); // You can adjust the 768 value based on your needs
  };

  // Listen for screen size changes when the component mounts
  React.useEffect(() => {
    updateScreenSize(); // Update the initial state
    window.addEventListener("resize", updateScreenSize); // Add an event listener to track screen size changes
    return () => {
      window.removeEventListener("resize", updateScreenSize); // Remove the event listener when the component unmounts
    };
  }, []);

  return (
    <div className={`${!isSmallScreen ? " d-flex justify-content-end mb-3" : ""} `}>
      <Form>
        <Form.Group className="mb-3 InputSearch">
          <Form.Control
            type="text"
            placeholder="search..."
            value={searchValue}
            onChange={handleInputChange}
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default SearchForm;
