import React from "react";
import { Form } from "react-bootstrap";
import styled from "styled-components";

const StyledFormControl = styled(Form.Control)`
  height: 50px; /* Increase the height */
  font-size: 1.1rem; /* Increase the font size */
  padding: 10px 20px; /* Add some padding */
  border-radius: 8px; /* Rounded corners */
  border: 2px solid #10266f; /* Border matching the button */
  transition: border-color 0.3s ease-in-out;

  &:focus {
    border-color: #3949ab; /* Change border color on focus */
    box-shadow: none; /* Remove the default bootstrap shadow */
    outline: none; /* Remove the outline */
  }
`;

const SearchForm = ({ searchValue, onSearch }) => {
  const handleInputChange = (e) => {
    onSearch(e.target.value); // Call the callback function with the new search value
  };

  // State to track the width of the screen
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);

  // Function to update state based on screen width
  const updateScreenSize = () => {
    setIsSmallScreen(window.innerWidth <= 991); // You can adjust the 991 value based on your needs
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
    <div className={`${!isSmallScreen ? "d-flex justify-content-end mb-3" : ""}`}>
      <Form>
        <Form.Group className="mb-3">
          <StyledFormControl
            type="text"
            placeholder="Rechercher..."
            value={searchValue}
            onChange={handleInputChange}
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default SearchForm;
