import {
  CardBody,
  CardFooter,
  CardRoot,
  createListCollection,
  Flex,
  HStack,
  IconButton,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
  Text,
} from "@chakra-ui/react";
import { FiChevronDown, FiChevronUp, FiTrash } from "react-icons/fi";
import { LuPencil } from "react-icons/lu";

import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";

import { useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { HiSwatch } from "react-icons/hi2";
import { Column, CommonTableProps } from "@/utils";
import TableHead from "./TableHeader";
import TableSkeleton from "./TableSkeleton";

const options = createListCollection({
  items: [
    { id: "10", label: 10, value: 10 },
    { id: "20", label: 20, value: 20 },
    { id: "30", label: 30, value: 30 },
    { id: "100", label: 100, value: 100 },
  ],
});

const CommonTable = <T,>({
  title,
  loading,
  columns,
  rows,
  onEdit,
  onDelete,
  onSearch,
  onAdd,
  filterComponent,
  isDraggable,
  count,
  entriesPerPage,
  setEntriesPerPage,
  addName,
}: CommonTableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    "asc"
  );
  const [visibleColumns, setVisibleColumns] = useState<Column<T>[]>(columns);

  const handleColumnVisibilityChange = (key: keyof T, visible: boolean) => {
    // Update the visibility of the selected column
    setVisibleColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.key === key ? { ...col, visible: visible } : col
      )
    );
  };
  console.log(isDraggable, visibleColumns);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      // Toggle sort direction or reset
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
      );
    } else {
      // Set new sort key and default to ascending
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (!sortKey || !sortDirection) return 0;

    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleEntriesChange = (value: string) => {
    setEntriesPerPage(value);
  };

  return (
    <CardRoot variant={"elevated"}>
      <CardBody>
        <TableHead
          columns={visibleColumns}
          handleColumnVisibilityChange={handleColumnVisibilityChange}
          title={title}
          onSearch={onSearch}
          filterComponent={filterComponent}
          onAdd={onAdd}
          addName={addName}
        />

        {loading ? (
          <TableSkeleton visibleColumns={visibleColumns} rowCount={5} />
        ) : (
          <TableRoot variant={"outline"}>
            <TableHeader>
              <TableRow>
                {visibleColumns
                  .filter((column) => column.visible) // Only render visible columns
                  .map((column) => (
                    <TableColumnHeader
                      key={String(column.key)}
                      onClick={() => handleSort(column.key)}
                      cursor="pointer"
                      alignItems="center"
                    >
                      <Flex align={"center"}>
                        <Text mr={4}>{column.label}</Text>
                        {sortKey === column.key && sortDirection === "asc" && (
                          <FiChevronUp />
                        )}
                        {sortKey === column.key && sortDirection === "desc" && (
                          <FiChevronDown />
                        )}
                      </Flex>
                    </TableColumnHeader>
                  ))}
                {(onEdit || onDelete) && (
                  <TableColumnHeader textAlign="center">
                    Actions
                  </TableColumnHeader>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      visibleColumns.filter((column) => column.visible).length +
                      1
                    }
                  >
                    <EmptyState
                      icon={<HiSwatch />}
                      title="No data found"
                      size={"lg"}
                      // description="Try adjusting your search"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                sortedRows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {visibleColumns
                      .filter((column) => column.visible) // Only render visible columns
                      .map((column) => (
                        <TableCell key={String(column.key)}>
                          {column.render
                            ? column.render(row)
                            : String(row[column.key])}
                        </TableCell>
                      ))}
                    {(onEdit || onDelete) && (
                      <TableCell>
                        <Flex justifyContent="center" gap={2}>
                          {onEdit && (
                            <IconButton
                              aria-label="Edit"
                              size="sm"
                              onClick={() => onEdit(row)}
                              variant="surface"
                              colorPalette={"blue"}
                            >
                              <LuPencil />
                            </IconButton>
                          )}
                          {onDelete && (
                            <IconButton
                              aria-label="Delete"
                              size="sm"
                              colorPalette={"red"}
                              variant="surface"
                              onClick={() => onDelete(row)}
                            >
                              <FiTrash />
                            </IconButton>
                          )}
                        </Flex>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </TableRoot>
        )}
      </CardBody>

      <CardFooter>
        <Flex justifyContent="space-between" alignItems="center" w="100%">
          <Flex alignItems="center" gap={2}>
            <Text>Show</Text>
            <select
              defaultValue={entriesPerPage}
              value={entriesPerPage}
              onChange={(e) => handleEntriesChange(e.target.value)}
            >
              {options.items.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Text>entries</Text>
          </Flex>
          {count && (
            <Flex alignItems="center" gap={2}>
              <PaginationRoot count={count} pageSize={10}>
                <HStack>
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </HStack>
              </PaginationRoot>
            </Flex>
          )}
        </Flex>
      </CardFooter>
    </CardRoot>
  );
};

export default CommonTable;
