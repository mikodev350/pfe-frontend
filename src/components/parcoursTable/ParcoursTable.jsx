import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import Loader from "../loader/Loader";
import { Table } from "react-bootstrap";
import TableHeader from "../table/TableHeader";
import TableBody from "../table/TableBody";
import TableCell from "../table/TableCell";
import PaginationComponent from "../pagination/Pagination";
import TableRow from "../table/TableRow";
import { parseISO, format } from "date-fns";
import TableIconeParcours from "../table/TableIconeParcours"; // Assurez-vous de créer ce composant ou de l'ajuster en conséquence
import { fetchParcours } from "../../api/ApiParcour";

const header = ["#", "Nom", "Date", "Options"];

export const ParcoursTable = ({ searchValue, token }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);

  const fetchParcoursMemoized = React.useCallback(
    async (page, search) => {
      const response = await fetchParcours(page, search,token);
      return response;
    },
    []
  );

  const { data, isLoading, isError, error } = useQuery(
    ["parcours", currentPage, pageSize, searchValue],
    async () => {
      if (searchValue) {
        return fetchParcoursMemoized(currentPage, searchValue);
      } else {
        return fetchParcoursMemoized(currentPage, "");
      }
    },
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
              <TableCell item={item.nom} dataLabel={header[1]} />
              <TableCell
                item={
                  item.createdAt
                    ? format(parseISO(item.createdAt), "dd-MM-yyyy")
                    : "N/A"
                }
                dataLabel={header[2]}
              />
              <TableIconeParcours
                parcoursId={item.id || ""}
                parcoursName={item.nom || ""}
                dataLabel={header[3]}
                className="border-table-left"
                // Ajoutez les autres props nécessaires ici
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
    </>
  );
};
