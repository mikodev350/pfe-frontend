import React from "react";
import TypeBagbe from "../badge/TypeBagbe";

export default function TableCell({
  index,
  type,
  item,
  children,
  dataLabel,
  className,
  correction,
}) {
  return (
    <td className={`table-cell-height ${className}`} data-label={dataLabel}>
      {children ? (
        children
      ) : type ? (
        <TypeBagbe item={type} />
      ) : item !== undefined ? (
        item === 0 ? (
          0
        ) : (
          item
        )
      ) : index !== undefined ? (
        index
      ) : (
        <span>&nbsp;</span>
      )}
    </td>
  );
}
