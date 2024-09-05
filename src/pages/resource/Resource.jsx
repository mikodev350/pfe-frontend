import React, { useState } from "react";
import { Container, Col, Row ,Button} from "react-bootstrap";
import { Link } from "react-router-dom";
import SearchForm from "../../components/searchForm/SearchForm";
import ResourceTable from "../../components/resourceTable/ResourceTable";
import styled from "styled-components";

// Styled Button with Gradient Background
const GradientButton = styled(Button)`
  background: linear-gradient(135deg, #10266f, #3949ab);
  border: 2px solid #10266f; /* Border matching the input */
  color: #ffffff;
  font-weight: bold;
  border-radius: 8px; /* Rounded corners to mimic input field */
  height: 50px; /* Match the height of the input */
  width: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px; /* Add padding similar to the input */
  transition: border-color 0.3s ease-in-out, background 0.3s ease-in-out,
    transform 0.2s ease-in-out;

  &:hover {
    background: linear-gradient(
      135deg,
      #3949ab,
      #10266f
    ); /* Darken the gradient on hover */
    transform: translateY(-3px);
    border-color: #3949ab; /* Match border with background on hover */
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(16, 38, 111, 0.25); /* Focus outline */
    outline: none; /* Remove default focus outline */
  }

  @media (max-width: 576px) {
    height: 45px; /* Adjust height for mobile */
    font-size: 1rem; /* Adjust font size for mobile */
    padding: 8px 16px; /* Adjust padding for mobile */
    width: 250px;
  }
`;

// Styled Title
const StyledTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #10266f;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-bottom: 2px solid #3949ab;
  padding-bottom: 0.5rem;
`;

const Resource = () => {
  const [searchValue, setSearchValue] = useState("");
const [isFirstClick, setIsFirstClick] = useState(true);

  const handleSearch = async (value) => {
    setSearchValue(value);
  };

 return (
    <Container>
      <StyledTitle>Ressources</StyledTitle>
      <Row>
        <Col xs={12} md={6}>
          <Link to={`/dashboard/new-resource`}  >
            <GradientButton>
              Ajouter une ressource
            </GradientButton>
          </Link>
        </Col>
        <Col xs={12} md={6}>
          <SearchForm searchValue={searchValue} onSearch={handleSearch} />
        </Col>
      </Row>
      <div style={{marginTop:"15px"}}>
              <ResourceTable searchValue={searchValue} />
      </div>
    </Container>
  );
};

export default Resource;
