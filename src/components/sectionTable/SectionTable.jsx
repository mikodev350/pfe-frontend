import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
// import { getToken } from "../../util/authUtils";
import { fetchSections, updateSection } from "../../api/apiSection";
import Loader from "../loader/Loader";
import { Table } from "react-bootstrap";
import TableHeader from "../table/TableHeader";
import TableBody from "../table/TableBody";
import TableCell from "../table/TableCell";
// import TableIconeSection from "../table/TableIconeSection";
import PaginationComponent from "../pagination/Pagination";
import TableRow from "../table/TableRow";
import { parseISO, format } from "date-fns";
import TableIconeSection from "../table/TableIconeSection";

const header = ["#", "module", "Total de resource", "Date", "Options"];

export const SectionTable = ({ searchValue }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);
  const queryClient = useQueryClient();

//   const token = React.useMemo(() => getToken(), []);

    const token = "token";

  const fetchSectionsMemoized = React.useCallback(
    async (page, search) => {
      const response = await fetchSections(page, token || "", search);
      return response;
    },
    [token]
  );

  const { data, isLoading, isError, error } = useQuery(
    ["sections", currentPage, pageSize, searchValue],
    async () => {
      if (searchValue) {
        return fetchSectionsMemoized(currentPage, searchValue);
      } else {
        return fetchSectionsMemoized(currentPage, "");
      }
    },
    {
      onSuccess: (response) => {
        setTotalPages(response.totalPages);
      },
    }
  );

  const updateSectionMutation = useMutation(
    (data) => updateSection(Number(data.id), { name: data.name }),
    {
      onError: (error) => {
        console.error("Error updating section:", error);
      },
      onSettled: () => {
        queryClient.invalidateQueries([
          "sections",
          currentPage,
          pageSize,
          searchValue,
        ]);
      },
    }
  );

  const handleUpdateSection = async (sectionId, newName) => {
    try {
      await updateSectionMutation.mutateAsync({ id: sectionId, name: newName });
    } catch (error) {
      console.error("Error updating section:", error);
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
              <TableCell item={item.totalresource ?? 0} dataLabel={header[2]} />
              <TableCell
                item={
                  item.createdAt
                    ? format(parseISO(item.createdAt), "dd-MM-yyyy")
                    : "N/A"
                }
                dataLabel={header[3]}
              />
              <TableIconeSection
                sectionId={item.id || ""}
                sectionName={item.name || ""}
                dataLabel={header[4]}
                className="border-table-left"
                handleUpdateSection={handleUpdateSection}
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
