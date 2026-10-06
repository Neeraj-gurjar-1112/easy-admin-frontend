"use client";

import { Paginator, type PaginatorPageChangeEvent } from "primereact/paginator";
import { formatNumber } from "@/utils/formatters";
import { PAGE_SIZE_OPTIONS } from "@/utils/constants";

interface ListPaginationProps {
  /** 1-based page, same as the API. */
  page: number;
  limit: number;
  totalRecords: number;
  onChange: (next: { page: number; limit: number }) => void;
}

// Footer under a table: "Total 1,234" on the left, PrimeReact Paginator on the right.
// Converts PrimeReact's 0-based `first` offset to the API's 1-based page.
export default function ListPagination({ page, limit, totalRecords, onChange }: ListPaginationProps) {
  const handleChange = (event: PaginatorPageChangeEvent) => {
    onChange({ page: event.page + 1, limit: event.rows });
  };

  return (
    <div className="list-pagination">
      <p className="list-pagination-total">
        Total <strong>{formatNumber(totalRecords)}</strong>
      </p>
      <Paginator
        first={(page - 1) * limit}
        rows={limit}
        totalRecords={totalRecords}
        rowsPerPageOptions={PAGE_SIZE_OPTIONS}
        onPageChange={handleChange}
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      />
    </div>
  );
}
