import { Box, Flex, Heading, IconButton, Input } from "@chakra-ui/react";
import { FiPlus, FiSettings } from "react-icons/fi";
import CommonButton from "../Buttons";
import React from "react";
import { TableHeadProps } from "@/utils";

const TableHead: React.FC<TableHeadProps> = ({
  title,
  onSearch,
  filterComponent,
  onAdd,
  addName,
}) => {
  return (
    <>
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
    </>
  );
};
export default TableHead;
