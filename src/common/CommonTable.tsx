import { CommonTableProps } from "@/utils";
import {
  Box,
  CardBody,
  CardFooter,
  CardRoot,
  createListCollection,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
  Text,
} from "@chakra-ui/react";
import {
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiSettings,
  FiTrash,
} from "react-icons/fi";
import { LuPencil } from "react-icons/lu";
import CommonButton from "./Buttons";

import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";

import { useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { HiSwatch } from "react-icons/hi2";

const options = createListCollection({
  items: [
    { id: "10", label: 10, value: 10 },
    { id: "20", label: 20, value: 20 },
    { id: "30", label: 30, value: 30 },
    { id: "100", label: 100, value: 100 },
  ],
});

const CommonTable: React.FC<CommonTableProps> = ({
  title,
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
}) => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  const handleSort = (key: string) => {
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
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Flex flex={1} alignItems="center" gap={4}>
            <Heading size="xl">{title}</Heading>
          </Flex>
          <Input
            placeholder="Search..."
            maxW="300px"
            onChange={(e) => onSearch?.(e.target.value)}
            mr={4}
            size={"sm"}
            border={"1px solid"}
          />
          <IconButton
            aria-label="Delete"
            size="sm"
            colorPalette={"black"}
            variant="surface"
          >
            <FiSettings />
          </IconButton>
        </Flex>

        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          {/* Render the filter component if provided */}
          {filterComponent ? (
            <Box flex={1}>{filterComponent}</Box>
          ) : (
            <Box flex={1}></Box>
          )}

          {/* Add Button */}
          {onAdd && (
            <CommonButton
              label={addName || "Add"}
              icon={<FiPlus />}
              onPress={() => onAdd()}
              alignContent="end"
              size="sm"
              variant="surface"
              colorPalette="gray"
            />
          )}
        </Flex>

        <TableRoot variant={"outline"}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableColumnHeader
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  cursor="pointer"
                  alignItems="center"
                >
                  <Flex align={"center"}>
                    <Text mr={2}>{column.label} </Text>
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
                <TableCell colSpan={columns.length + 1}>
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
                  {columns.map((column) => (
                    <TableCell key={column.key}>{row[column.key]}</TableCell>
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
