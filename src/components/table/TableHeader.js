import React from "react";
import TableRow from "./TableRow";

export default function TableHeader({ header }) {
  return (
    <thead>
      <TableRow>
        {header.map((item) => (
          <th style={{ minWidth: "100%" }} scope="col" key={item}>
            {item}
          </th>
        ))}
      </TableRow>
    </thead>
  );
}
