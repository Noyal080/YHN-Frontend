import {
  Box,
  CheckboxGroup,
  FieldsetContent,
  FieldsetLegend,
  FieldsetRoot,
  Flex,
  Heading,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { FiPlus, FiSettings } from "react-icons/fi";
import CommonButton from "../Buttons";
import { TableHeadProps } from "@/utils";
import { useState } from "react";
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

const TableHead = <T,>({
  columns,
  handleColumnVisibilityChange,
  title,
  onSearch,
  filterComponent,
  onAdd,
  addName,
}: TableHeadProps<T>) => {
  const [open, setOpen] = useState<boolean>(false);

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
        <PopoverRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
          <PopoverTrigger>
            <IconButton
              aria-label="Delete"
              size="sm"
              colorPalette={"black"}
              variant="surface"
            >
              <FiSettings />
            </IconButton>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody>
              <FieldsetRoot>
                <CheckboxGroup>
                  <FieldsetLegend> Select Columns </FieldsetLegend>
                  <FieldsetContent>
                    {columns.map((column) => (
                      <Checkbox
                        variant={"subtle"}
                        checked={column.visible}
                        onCheckedChange={() =>
                          handleColumnVisibilityChange(
                            column.key,
                            !column.visible
                          )
                        }
                      >
                        {column.label}
                      </Checkbox>
                    ))}
                  </FieldsetContent>
                </CheckboxGroup>
              </FieldsetRoot>
            </PopoverBody>
          </PopoverContent>
        </PopoverRoot>
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
