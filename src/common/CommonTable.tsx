import { CommonTableProps } from "@/utils";
import {
  Box,
  Flex,
  Heading,
  IconButton,
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
}) => {
  return (
    <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="sm" bg="white">
      {/* Table Title */}
      <Heading size="md" mb={4}>
        {title}
      </Heading>

      {/* Table */}
      <TableRoot>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableColumnHeader key={column.key}>
                {column.label}
              </TableColumnHeader>
            ))}
            <TableColumnHeader textAlign="center">Actions</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.key}>{row[column.key]}</TableCell>
              ))}
              <TableCell>
                <Flex justifyContent="center" gap={2}>
                  <IconButton
                    aria-label="Edit"
                    size="sm"
                    onClick={() => onEdit(row)}
                  >
                    <LuPencil />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    size="sm"
                    colorScheme="red"
                    onClick={() => onDelete(row)}
                  >
                    <FiTrash />
                  </IconButton>
                </Flex>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </Box>
  );
};

export default CommonTable;
