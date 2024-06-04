import React, { useState } from "react";
import { Row, Table, Button } from "react-bootstrap";
import { format, parseISO } from "date-fns";
import { useQuery } from "react-query";
import { fetchResources } from "../../api/apiResource";
import Loader from "../loader/Loader";
import PaginationComponent from "../pagination/Pagination";
import TableRow from "../table/TableRow";
import TableCell from "../table/TableCell";
import TableBody from "../table/TableBody";
import { getToken } from "../../util/authUtils";
import { useNavigate } from "react-router-dom";

const header = ["#", "Name", "Type", "Date of Creation", "Action"];

const isValidDate = (dateString) => {
  const date = parseISO(dateString);
  return !isNaN(date.getTime());
};

const ResourceTable = ({ searchValue }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const token = React.useMemo(() => getToken(), []);
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery(
    ["resources", currentPage, pageSize, searchValue],
    () => fetchResources(currentPage, pageSize, "", searchValue, token)
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

  const resources = Array.isArray(data?.data) ? data.data : [];

  return (
    <Row>
      <Table className="text-center table-dashboard">
        <thead>
          <tr>
            {header.map((h, index) => (
              <th
                key={index}
                className={
                  index === 0
                    ? "border-table-right"
                    : index === header.length - 1
                    ? "border-table-left border-left-zero"
                    : ""
                }
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <TableBody>
          {resources.map((resource, index) => (
            <TableRow key={index}>
              <TableCell dataLabel={header[0]} item={index + 1} />
              <TableCell dataLabel={header[1]} item={resource.nom} />
              <TableCell dataLabel={header[2]} item={resource.format} />
              <TableCell
                dataLabel={header[3]}
                item={
                  isValidDate(resource.createdAt)
                    ? format(parseISO(resource.createdAt), "dd-MM-yyyy").toString()
                    : "Invalid Date"
                }
              />
                <TableCell
                dataLabel={header[4]}
                item={
                  <>
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/student/update-resource/${resource.id}`)}
                    >
                      Edit
                    </Button>
                    <Button variant="danger" className="ml-2">
                      Delete
                    </Button>
                  </>
                }
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="d-flex justify-content-center">
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </Row>
  );
};

export default ResourceTable;
