import styled from 'styled-components';
import { Container, Card, Form, Button } from 'react-bootstrap';

export const StyledContainer = styled(Container)`
  max-width: 90%;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const StyledCard = styled(Card)`
  margin: 20px auto;
  max-width: 600px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const StyledCardHeader = styled(Card.Header)`
  background-color: #007bff !important;
  color: white !important;
  padding: 15px !important;
  height: 57px !important;
  border-radius: 15px 15px 0 0 !important;
  font-weight: bold !important;
  font-size: 1.5rem !important;
  text-align: center !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
`;

export const StyledCardBody = styled(Card.Body)`
  padding: 20px;
`;

export const StyledFormGroup = styled(Form.Group)`
  margin-bottom: 15px;
`;

export const StyledFormLabel = styled(Form.Label)`
  font-weight: bold;
  color: #495057;
`;

export const StyledFormControl = styled(Form.Control)`
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

export const StyledFormControlFeedback = styled(Form.Control.Feedback)`
  color: #dc3545;
`;

export const StyledFormCheck = styled(Form.Check)`
  color: #495057;
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

export const StyledButton = styled(Button)`
  padding: 8px 20px;
  border-radius: 50px;
  border: 2px solid ${props => props.variant === 'danger' ? '#dc3545' : '#007bff'};
  background-color: transparent;
  color: ${props => props.variant === 'danger' ? '#dc3545' : '#007bff'};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${props => props.variant === 'danger' ? '#dc3545' : '#007bff'};
    color: white;
  }
`;
