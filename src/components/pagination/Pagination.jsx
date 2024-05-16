import React from "react";
import { Pagination } from "react-bootstrap";

function PaginationComponent({ currentPage, totalPages, onPageChange }) {
  return (
    <Pagination>
      <Pagination.First onClick={() => onPageChange(1)} />
      <Pagination.Prev
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
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      />
      <Pagination.Last onClick={() => onPageChange(totalPages)} />
    </Pagination>
  );
}

export default PaginationComponent;
