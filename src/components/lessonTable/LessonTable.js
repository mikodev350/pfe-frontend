import React, { useState } from "react";
import { useQuery } from "react-query";
import { fetchLessons } from "../../api/apiLesson";
import Loader from "../loader/Loader";
import { Table, Button } from "react-bootstrap";
import TableHeader from "../table/TableHeader";
import TableBody from "../table/TableBody";
import TableCell from "../table/TableCell";
import PaginationComponent from "../pagination/Pagination";
import TableRow from "../table/TableRow";
import { parseISO, format } from "date-fns";

const header = ["#", "Lesson", "ID Module", "Date", "Options"];

const LessonTable = ({ searchValue, onEditLesson }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);

  const { data, isLoading, isError, error } = useQuery(
    ["lessons", currentPage, searchValue],
    () => fetchLessons(currentPage, "token", searchValue, 1), // Pass the correct module ID
    {
      onSuccess: (response) => {
        setTotalPages(response.totalPages);
      },
    }
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <>
      <Table responsive className="text-center table-dashboard">
        <TableHeader header={header} />
        <TableBody>
          {data?.data.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell
                item={index + 1 + (currentPage - 1) * pageSize}
                dataLabel={header[0]}
                className="border-table-right"
              />
              <TableCell item={item.name} dataLabel={header[1]} />
              <TableCell item={item.idModule} dataLabel={header[2]} />
              <TableCell
                item={
                  item.createdAt
                    ? format(parseISO(item.createdAt), "dd-MM-yyyy")
                    : "N/A"
                }
                dataLabel={header[3]}
              />
              <TableCell dataLabel={header[4]}>
                <Button variant="warning" onClick={() => onEditLesson(item)}>
                  Modifier
                </Button>
              </TableCell>
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
    </>
  );
};

export default LessonTable;
