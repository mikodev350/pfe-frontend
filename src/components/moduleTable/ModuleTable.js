import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchModules, updateModule } from "../../api/apiModule";
import Loader from "../loader/Loader";
import { Table } from "react-bootstrap";
import TableHeader from "../table/TableHeader";
import TableBody from "../table/TableBody";
import TableCell from "../table/TableCell";
import PaginationComponent from "../pagination/Pagination";
import TableRow from "../table/TableRow";
import TableIconeModule from "../table/TableIconeModule";
import { parseISO, format } from "date-fns";

const header = ["#", "Module", "Total de resources", "Date", "Options"];

const ModuleTable = ({ searchValue, idParcours }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);
  const queryClient = useQueryClient();

  const token = "token";

  const fetchModulesMemoized = React.useCallback(
    async (page, search) => {
      const response = await fetchModules(page, token, search, idParcours);
      return response;
    },
    [token, idParcours]
  );

  const { data, isLoading, isError, error } = useQuery(
    ["modules", currentPage, pageSize, searchValue, idParcours],
    async () => {
      if (searchValue) {
        return fetchModulesMemoized(currentPage, searchValue);
      } else {
        return fetchModulesMemoized(currentPage, "");
      }
    },
    {
      onSuccess: (response) => {
        setTotalPages(response.totalPages);
      },
    }
  );

  const updateModuleMutation = useMutation(
    (data) => updateModule(Number(data.id), { name: data.name }),
    {
      onError: (error) => {
        console.error("Error updating module:", error);
      },
      onSettled: () => {
        queryClient.invalidateQueries([
          "modules",
          currentPage,
          pageSize,
          searchValue,
          idParcours,
        ]);
      },
    }
  );

  const handleUpdateModule = async (moduleId, newName) => {
    try {
      await updateModuleMutation.mutateAsync({ id: moduleId, name: newName });
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

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
              <TableCell item={item.totalResource ?? 0} dataLabel={header[2]} />
              <TableCell
                item={
                  item.createdAt
                    ? format(parseISO(item.createdAt), "dd-MM-yyyy")
                    : "N/A"
                }
                dataLabel={header[3]}
              />
              <TableIconeModule
                moduleId={item.id || ""}
                moduleName={item.name || ""}
                dataLabel={header[4]}
                className="border-table-left"
                handleUpdateModule={handleUpdateModule}
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

export default ModuleTable;
