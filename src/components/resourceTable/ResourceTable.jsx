// components/resourceTable/ResourceTable.js
import React, { useState, useEffect } from "react";
import { Card as BootstrapCard, Row, Col } from "react-bootstrap";
import { format, parseISO } from "date-fns";
import { useQuery, useQueryClient } from "react-query";
import { fetchResources } from "../../api/apiResource";
import Loader from "../loader/Loader";
import PaginationComponent from "../pagination/Pagination";

import { getToken } from "../../util/authUtils";
import TableIconeResource from "../table/TableIconeResource";
import styled from "styled-components";



const Container = styled.div`
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f0f0f5; /* Neutral background */

  @media (max-width: 768px) {
    padding: 10px;
  }
`;


const CardGrid = styled(Row)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  width: calc(100% - 50px); /* Adjusted width to create space from the sidebar */
  max-width: 1200px;
  margin-bottom: 20px;
  margin-left: 50px; /* Add margin to create separation from the sidebar */

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    width: 100%;
    margin-left: 0;
  }
`;
const ModernCard = styled.div`
  position: relative;
  padding: 20px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
    border-color: #007bff;
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 80px;
    background: linear-gradient(45deg, #FFD700 30%, #FFB352 60%, #FFB352);
    clip-path: polygon(100% 0, 0 0, 100% 100%);
    z-index: 0;
  }

  @media (max-width: 768px) {
    padding: 15px;
    &:before {
      width: 60px;
      height: 60px;
    }
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CardSubtitle = styled.h3`
  font-size: 1rem;
  color: #555;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const CardText = styled.p`
  font-size: 0.9rem;
  color: #666;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;
const ActionWrapper = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;

  svg {
    transition: transform 0.2s ease;
  }

  svg:hover {
    transform: scale(1.2);
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;


const isValidDate = (dateString) => {
  const date = parseISO(dateString);
  return !isNaN(date.getTime());
};
const ResourceTable = ({ searchValue }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const token = React.useMemo(() => getToken(), []);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery(
    ["resources", currentPage, pageSize, searchValue],
    () => fetchResources(currentPage, pageSize,searchValue, token),
    { keepPreviousData: true }
  );

  useEffect(() => {
    const handleOnline = async () => {
      // await syncOfflineChangesResource(token, queryClient);
      refetch();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [token, queryClient, refetch]);

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
    <Container>
      <CardGrid>
        {resources.map((resource, index) => (
          <Col key={index}>
            <ModernCard>
              <CardContent>
                <CardTitle>{resource.nom}</CardTitle>
                <CardSubtitle>Type : {resource.format}</CardSubtitle>
                <CardText>
                  Date :{" "}
                  {isValidDate(resource.createdAt)
                    ? format(parseISO(resource.createdAt), "dd-MM-yyyy")
                    : "N/A"}
                </CardText>
              </CardContent>
              <ActionWrapper>
                <TableIconeResource id={resource.id} />
              </ActionWrapper>
            </ModernCard>
          </Col>
        ))}
      </CardGrid>
      <PaginationWrapper>
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </PaginationWrapper>
    </Container>
  );

};

export default ResourceTable;
























// // components/resourceTable/ResourceTable.js
// import React, { useState } from "react";
// import { Row, Table } from "react-bootstrap";
// import { format, parseISO } from "date-fns";
// import { useQuery } from "react-query";
// import { fetchResources } from "../../api/apiResource";
// import Loader from "../loader/Loader";
// import PaginationComponent from "../pagination/Pagination";
// import TableRow from "../table/TableRow";
// import TableCell from "../table/TableCell";
// import TableBody from "../table/TableBody";
// import { getToken } from "../../util/authUtils";
// import { useNavigate } from "react-router-dom";
// import TableIconeResource from "../table/TableIconeResource";

// const header = ["#", "Name", "Type", "Date of Creation", "Action"];

// const isValidDate = (dateString) => {
//   const date = parseISO(dateString);
//   return !isNaN(date.getTime());
// };

// const ResourceTable = ({ searchValue }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 5;
//   const token = React.useMemo(() => getToken(), []);
//   const navigate = useNavigate();
//   const { data, isLoading, isError, error } = useQuery(
//     ["resources", currentPage, pageSize, searchValue],
//     () => fetchResources(currentPage, pageSize, "", searchValue, token),
//     { keepPreviousData: true }
//   );

//   const totalPages = data?.totalPages || 1;

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (isError) {
//     return <div>Error fetching data: {error.message}</div>;
//   }

//   const resources = Array.isArray(data?.data) ? data.data : [];

//   return (
//     <Row>
//       <Table className="text-center table-dashboard">
//         <thead>
//           <tr>
//             {header.map((h, index) => (
//               <th
//                 key={index}
//                 className={
//                   index === 0
//                     ? "border-table-right"
//                     : index === header.length - 1
//                     ? "border-table-left border-left-zero"
//                     : ""
//                 }
//               >
//                 {h}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <TableBody>
//           {resources.map((resource, index) => (
//             <TableRow key={index}>
//               <TableCell dataLabel={header[0]} item={index + 1} />
//               <TableCell dataLabel={header[1]} item={resource.nom} />
//               <TableCell dataLabel={header[2]} item={resource.format} />
//               <TableCell
//                 dataLabel={header[3]}
//                 item={
//                   isValidDate(resource.createdAt)
//                     ? format(parseISO(resource.createdAt), "dd-MM-yyyy").toString()
//                     : "Invalid Date"
//                 }
//               />
//               <TableIconeResource dataLabel={header[4]} id={resource.id} />
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//       <div className="d-flex justify-content-center">
//         <PaginationComponent
//           totalPages={totalPages}
//           currentPage={currentPage}
//           onPageChange={handlePageChange}
//         />
//       </div>
//     </Row>
//   );
// };

// export default ResourceTable;
