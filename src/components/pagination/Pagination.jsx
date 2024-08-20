import React from "react";
import { Pagination } from "react-bootstrap";
import styled from "styled-components";

const CustomPagination = styled(Pagination)`
  justify-content: center;
  margin-top: 20px;

  .page-item {
    margin: 0 5px; /* Add spacing between pagination items */
  }

  .page-item.active .page-link {
    background-color: #10266f; /* Dark blue background for active page */
    border-color: #10266f;
    color: #ffffff; /* White text for active page */
  }

  .page-item .page-link {
    color: #10266f; /* Dark blue text for page links */
    border-radius: 50%;
    border: 1px solid #ddd; /* Light border for non-active pages */
    background-color: #f8f9fa; /* Light background for non-active pages */
  }

  .page-item.disabled .page-link {
    color: #ccc; /* Light gray for disabled controls */
    background-color: #f8f9fa;
  }

  .page-item .page-link:hover {
    background-color: #d9e2ec; /* Slightly darker background on hover */
    color: #10266f; /* Dark blue text on hover */
  }
`;

function PaginationComponent({ currentPage, totalPages, onPageChange }) {
  return (
    <CustomPagination>
      <Pagination.First
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      />
      <Pagination.Prev
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      />
      {Array.from({ length: totalPages }, (_, index) => (
        <Pagination.Item
          key={index + 1}
          active={index + 1 === currentPage}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      />
      <Pagination.Last
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      />
    </CustomPagination>
  );
}

export default PaginationComponent;
