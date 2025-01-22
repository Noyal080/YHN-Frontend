import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeletonProps } from "@/utils";
import {
  Box,
  TableRoot,
  TableHeader,
  TableRow,
  TableColumnHeader,
  TableBody,
  TableCell,
} from "@chakra-ui/react";

const TableSkeleton = <T,>({
  visibleColumns,
  rowCount,
}: TableSkeletonProps<T>) => {
  return (
    <Box w="100%">
      <TableRoot variant={"outline"}>
        <TableHeader>
          <TableRow>
            {visibleColumns
              .filter((column) => column.visible)
              .map((column) => (
                <TableColumnHeader key={String(column.key)}>
                  <Skeleton height="20px" width="120px" variant={"pulse"} />
                </TableColumnHeader>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, index) => (
            <TableRow key={index}>
              {visibleColumns
                .filter((column) => column.visible)
                .map((column) => (
                  <TableCell key={String(column.key)}>
                    <Skeleton height="20px" width="120px" variant={"pulse"} />
                  </TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </Box>
  );
};

export default TableSkeleton;
