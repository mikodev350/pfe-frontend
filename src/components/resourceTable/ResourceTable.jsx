import React, { useState } from "react";
import { Row, Table } from "react-bootstrap";

import { format, parseISO } from "date-fns";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchResources } from "../../api/apiResource"; // Ensure the function name and import path are correct
import Loader from "../loader/Loader";
import PaginationComponent from "../pagination/Pagination";
import TableRow from "../table/TableRow";
import { getToken } from "../../util/authUtils";
import TableCell from "../table/TableCell";
import TableBody from "../table/TableBody";
import TableIconeResource from "../table/TableIconeResource";


const header = [
  "#",
  "Name",
  "Type",
  "Date of Creation",
  "Public Access",
  "Action"
];

const isExpiredResource = (resourceEndDate) => {
  return new Date(resourceEndDate) < new Date();
};

const isValidDate = (dateString) => {
  const date = parseISO(dateString);
  return !isNaN(date.getTime());
};

const ResourceTable = ({ searchValue }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const { section } = useParams();
  const token = React.useMemo(() => getToken(), []);

  const { data, isLoading, isError, error } = useQuery(["resources", currentPage, pageSize, searchValue], () =>
    fetchResources(currentPage, pageSize, section ?? "", searchValue, token || "")
  );

  const totalPages = data?.totalPages || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const resources = data?.data || [];

  return (
    <Row>
      <Table className="text-center table-dashboard">
        <thead>
          <tr>
            <th className="border-table-right" style={{ width: "5%" }}>#</th>
            <th>Name</th>
            <th>Type</th>
            <th>Date of Creation</th>
            {/* <th>Status</th> */}
            <th>Public Access</th>
            <th className="border-table-left border-left-zero">Action</th>
          </tr>
        </thead>
        <TableBody>
          {resources.map((resource, index) => (
            <TableRow key={index}>
              <TableCell dataLabel={header[0]} index={index + 1} />
              <TableCell dataLabel={header[1]} item={resource.name} />
              <TableCell dataLabel={header[2]} item={resource.type} />
              <TableCell dataLabel={header[3]} item={isValidDate(resource.dateOfCreation) ? format(parseISO(resource.dateOfCreation), "dd-MM-yyyy").toString() : "Invalid Date"} />
              <TableCell dataLabel={header[5]} item={resource.isPublic ? "Yes" : "No"} />
              <TableIconeResource dataLabel={header[6]} id={resource.id}
   />
              
              {/* Add actions or buttons here as needed */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="d-flex justify-content-center">
        <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      </div>
    </Row>
  );
};

export default ResourceTable;
