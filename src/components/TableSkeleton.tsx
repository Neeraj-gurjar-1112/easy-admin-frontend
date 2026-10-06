import { Skeleton } from "primereact/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

// Loading placeholder shaped like the table it replaces.
export default function TableSkeleton({ rows = 8, columns = 6 }: TableSkeletonProps) {
  return (
    <div className="table-skeleton" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div className="table-skeleton-row" key={rowIndex}>
          {Array.from({ length: columns }).map((__, colIndex) => (
            <Skeleton className="table-skeleton-cell" key={colIndex} />
          ))}
        </div>
      ))}
    </div>
  );
}
