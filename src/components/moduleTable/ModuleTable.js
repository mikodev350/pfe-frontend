import React, { useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  fetchModules,
  updateModule,
  syncOfflineChangesModule,
} from "../../api/apiModule";
import Loader from "../loader/Loader";
import { Table } from "react-bootstrap";
import TableHeader from "../table/TableHeader";
import TableBody from "../table/TableBody";
import TableCell from "../table/TableCell";
import TableRow from "../table/TableRow";
import TableIconeModule from "../table/TableIconeModule";
import PaginationComponent from "../pagination/Pagination";
import { parseISO, format } from "date-fns";

const header = ["#", "Module", "Total de ressources", "Date", "Options"];

const ModuleTable = ({ searchValue, idParcours, token }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);
  const queryClient = useQueryClient();

  const fetchModulesMemoized = useCallback(
    async (page, search) => {
      const response = await fetchModules(page, token, search, idParcours);
      return response;
    },
    [token, idParcours]
  );

  const { data, isLoading, isError, error, refetch } = useQuery(
    ["modules", searchValue, idParcours, currentPage],
    () => fetchModulesMemoized(currentPage, searchValue),
    {
      keepPreviousData: true,
      onSuccess: (response) => {
        setTotalPages(response.totalPages);
      },
    }
  );

  useEffect(() => {
    refetch(); // Recharger les données après changement de page ou de filtre
  }, [currentPage, searchValue, refetch, token]);

  useEffect(() => {
    const handleOnline = async () => {
      try {
        await syncOfflineChangesModule(token, queryClient);
        await queryClient.invalidateQueries([
          "modules",
          searchValue,
          idParcours,
        ]);
        refetch(); // Recharger les données après synchronisation
      } catch (error) {
        console.error("Error syncing offline changes:", error);
      }
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [token, queryClient, searchValue, idParcours, refetch]);

  const updateModuleMutation = useMutation(
    (data) => updateModule(data.id, { nom: data.name }, token),
    {
      onError: (error) => {
        console.error("Error updating module:", error);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["modules", searchValue, idParcours]);
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
              <TableCell item={item.nom} dataLabel={header[1]} />
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
                moduleName={item.nom || ""}
                dataLabel={header[4]}
                className="border-table-left"
                handleUpdateModule={handleUpdateModule}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default ModuleTable;
