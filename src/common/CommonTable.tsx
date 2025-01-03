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
  Select,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
  Text,
} from "@chakra-ui/react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { LuPencil } from "react-icons/lu";
import CommonButton from "./Buttons";
import {
  SelectContent,
  SelectRoot,
  SelectTrigger,
} from "@/components/ui/select";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";

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
}) => {
  const handleEntriesChange = (value: string) => {
    setEntriesPerPage(value);
  };
  return (
    <CardRoot variant={"elevated"}>
      <CardBody>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Flex flex={1} alignItems="center" gap={4}>
            {/* Title */}
            <Heading size="xl">{title}</Heading>

            {/* Search Bar */}
            <Input
              placeholder="Search..."
              maxW="300px"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </Flex>
          {onAdd && (
            <CommonButton
              label="Add"
              icon={<FiPlus />}
              onPress={() => onAdd()}
              size="lg"
              variant="outline"
              colorPalette={"teal"}
            />
          )}
        </Flex>

        {/* Filter Component */}
        <Box mb={4}>{filterComponent}</Box>

        {/* Table */}
        <TableRoot variant={"outline"}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableColumnHeader key={column.key}>
                  {column.label}
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
            {rows.map((row, rowIndex) => (
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
                        >
                          <LuPencil />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          aria-label="Delete"
                          size="sm"
                          colorScheme="red"
                          onClick={() => onDelete(row)}
                        >
                          <FiTrash />
                        </IconButton>
                      )}
                    </Flex>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </CardBody>
      <CardFooter>
        <Flex justifyContent="space-between" alignItems="center" w="100%">
          {/* Show Entries */}
          <Flex alignItems="center" gap={2}>
            <Text>Show</Text>
            <select
              defaultValue={entriesPerPage}
              value={entriesPerPage}
              onChange={(e) => handleEntriesChange(e.target.value)}
              className="block w-24 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
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
