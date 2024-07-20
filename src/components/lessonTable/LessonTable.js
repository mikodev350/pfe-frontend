import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  fetchLessons,
  updateLesson,
  deleteLesson,
  syncOfflineChangesLesson,
} from "../../api/apiLesson";
import Loader from "../loader/Loader";
import { Table } from "react-bootstrap";
import TableHeader from "../table/TableHeader";
import TableBody from "../table/TableBody";
import TableCell from "../table/TableCell";
import PaginationComponent from "../pagination/Pagination";
import TableRow from "../table/TableRow";
import { parseISO, format } from "date-fns";
import { BiEdit, BiTrash } from "react-icons/bi";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const header = ["#", "Leçon", "Date", "Options"];

const LessonTable = ({ searchValue, token, moduleId, onEditLesson }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);
  const queryClient = useQueryClient();

  const fetchLessonsMemoized = useCallback(
    async (page, search) => {
      const response = await fetchLessons(page, token, search, moduleId);
      console.log("Fetched Lessons: ", response.data);
      return response;
    },
    [token, moduleId]
  );

  const { data, isLoading, isError, error, refetch } = useQuery(
    ["lessons", { searchValue, moduleId, currentPage }],
    () => fetchLessonsMemoized(currentPage, searchValue),
    {
      keepPreviousData: true,
      onSuccess: (response) => {
        console.log("Query onSuccess: ", response);
        setTotalPages(response.totalPages);
      },
    }
  );

  useEffect(() => {
    console.log("Refetching query");
    refetch();
  }, [currentPage, searchValue, token, refetch]);

  const updateLessonMutation = useMutation(
    async (data) => {
      await updateLesson(data.id, { nom: data.name }, token);
      await queryClient.invalidateQueries([
        "lessons",
        { searchValue, moduleId, currentPage },
      ]);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "lessons",
          { searchValue, moduleId, currentPage },
        ]);
      },
      onError: (error) => {
        toast.error(
          `Erreur lors de la mise à jour de la leçon : ${error.message}`
        );
      },
    }
  );

  const deleteLessonMutation = useMutation(
    async (lessonId) => {
      await deleteLesson(lessonId, token);
      await queryClient.invalidateQueries([
        "lessons",
        { searchValue, moduleId, currentPage },
      ]);
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries([
          "lessons",
          { searchValue, moduleId, currentPage },
        ]);
        toast.success("Leçon supprimée avec succès !");
        if (navigator.onLine) {
          await syncOfflineChangesLesson(token, queryClient);
        }
      },
      onError: (error) => {
        toast.error(
          `Erreur lors de la suppression de la leçon : ${error.message}`
        );
      },
    }
  );

  const handleUpdateLesson = async (lessonId, newName) => {
    try {
      console.log("Updating lesson:", lessonId, newName);
      await updateLessonMutation.mutateAsync({ id: lessonId, name: newName });
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };

  const handleDelete = (lessonId) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas annuler cette action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimez-la!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLessonMutation.mutate(lessonId);
      }
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div>Erreur lors de la récupération des données : {error.message}</div>
    );
  }

  console.log("Data fetched: ", data?.data);

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
              <TableCell dataLabel={header[3]}>
                <BiEdit size={24} onClick={() => onEditLesson(item)} />
                <BiTrash size={24} onClick={() => handleDelete(item.id)} />
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
