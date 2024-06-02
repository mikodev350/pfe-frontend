import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchLessons, updateLesson } from "../../api/apiLesson";
import Loader from "../loader/Loader";
import { Table, Button, Modal, Form } from "react-bootstrap";
import TableHeader from "../table/TableHeader";
import TableBody from "../table/TableBody";
import TableCell from "../table/TableCell";
import PaginationComponent from "../pagination/Pagination";
import TableRow from "../table/TableRow";
import { parseISO, format } from "date-fns";
import { BiEdit, BiTrash } from "react-icons/bi";

const header = ["#", "Lesson", "Date", "Options"];

const LessonTable = ({ searchValue, token, moduleId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery(
    ["lessons", currentPage, searchValue, moduleId],
    () => fetchLessons(currentPage, token, searchValue, moduleId),
    {
      onSuccess: (response) => {
        setTotalPages(response.totalPages);
      },
    }
  );

  const updateLessonMutation = useMutation(
    (updatedLesson) =>
      updateLesson(updatedLesson.id, { nom: updatedLesson.nom }, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("lessons");
      },
      onError: (error) => {
        console.error("Error updating lesson:", error);
      },
    }
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState({});

  const handleEdit = (lesson) => {
    setCurrentLesson(lesson);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    await updateLessonMutation.mutateAsync(currentLesson);
    setShowEditModal(false);
  };

  const handleInputChange = (e) => {
    setCurrentLesson({ ...currentLesson, nom: e.target.value });
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
              <TableCell dataLabel={header[3]}>
                <BiEdit size={24} onClick={() => handleEdit(item)} />
                <BiTrash size={24} />
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

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Lesson</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="lessonName">
              <Form.Label>Lesson Name</Form.Label>
              <Form.Control
                type="text"
                value={currentLesson.nom || ""}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LessonTable;
