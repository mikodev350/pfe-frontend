import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import TableHeader from "../table/TableHeader";
import TableBody from "../table/TableBody";
import TableCell from "../table/TableCell";
import PaginationComponent from "../pagination/Pagination";
import TableRow from "../table/TableRow";
import TableIconeParcours from "../table/TableIconeParcours";
import { useQuery, useQueryClient } from "react-query";
import { fetchParcours, deletePathway, createPathway, updatePathway } from "../../api/ApiParcour";
import db from "../../database/database";
import { format, parseISO } from "date-fns";

const header = ["#", "Nom", "Date", "Options"];

export const ParcoursTable = ({ searchValue, token }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery(
    ["parcours", currentPage, searchValue],
    () => fetchParcours(currentPage, searchValue, token),
    {
      keepPreviousData: true,
      onSuccess: async (data) => {
        // Store the fetched data in IndexedDB
        await db.parcours.bulkPut(data.data);
      },
      onError: async () => {
        // Load data from IndexedDB in case of error
        const localData = await db.parcours
          .filter((parcour) => parcour.nom.includes(searchValue))
          .offset((currentPage - 1) * pageSize)
          .limit(pageSize)
          .toArray();
        return { data: localData, totalPages: Math.ceil(localData.length / pageSize) };
      }
    }
  );

  useEffect(() => {
    refetch();
  }, [currentPage, searchValue, token, refetch]);

  useEffect(() => {
    const handleOnline = async () => {
      await refetch();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [token, queryClient, refetch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deletePathway(id, token);
      if (response.status === "success" || response.status === "offline") {
        refetch();
      }
    } catch (error) {
      console.error("Error deleting pathway:", error);
    }
  };

  const handleCreate = async (newPathway) => {
    try {
      const response = await createPathway(newPathway, token);
      if (response.status === "success" || response.status === "offline") {
        setCurrentPage(1); // Reset to the first page to show the newly added item
        refetch();
      }
    } catch (error) {
      console.error("Error creating pathway:", error);
    }
  };

  const handleUpdate = async (id, updatedPathway) => {
    try {
      const response = await updatePathway(id, updatedPathway, token);
      if (response.status === "success" || response.status === "offline") {
        // Update the local cache with the new data
        queryClient.setQueryData(["parcours", currentPage, searchValue], (oldData) => {
          const newData = oldData.data.map((item) => (item.id === id ? response.data : item));
          return { ...oldData, data: newData };
        });
      }
    } catch (error) {
      console.error("Error updating pathway:", error);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isError) {
    return <div>Erreur lors de la récupération des données : {error.message}</div>;
  }

  return (
    <>
      <Table responsive className="text-center table-dashboard">
        <TableHeader header={header} />
        <TableBody>
          {data.data.map((item, index) => (
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
                onDelete={() => handleDelete(item.id)}
                onUpdate={(updatedPathway) => handleUpdate(item.id, updatedPathway)}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="d-flex justify-content-center">
        <PaginationComponent
          totalPages={data.totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};
