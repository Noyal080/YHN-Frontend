import { CommonTableProps } from "@/utils";
import {
  Box,
  Button,
  CardBody,
  CardRoot,
  Flex,
  Heading,
  IconButton,
  Input,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
} from "@chakra-ui/react";
import { FiTrash } from "react-icons/fi";
import { LuPencil } from "react-icons/lu";

const CommonTable: React.FC<CommonTableProps> = ({
  title,
  columns,
  rows,
  onEdit,
  onDelete,
  onSearch,
  onAdd,
  filterComponent,
}) => {
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

          {/* Add Button */}
          <Button colorScheme="blue" onClick={onAdd}>
            Add
          </Button>
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
    </CardRoot>
  );
};

export default CommonTable;
