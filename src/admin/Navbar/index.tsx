import { Box, BreadcrumbItem, Flex, Text } from "@chakra-ui/react";
import { BreadcrumbLink, BreadcrumbRoot } from "@/components/ui/breadcrumb";
import { Avatar } from "@/components/ui/avatar";
import { NavbarProps } from "@/utils";

const AdminNavbar: React.FC<NavbarProps> = ({ title, breadcrumbItems }) => {
  return (
    <Flex
      as="header"
      justifyContent="space-between"
      bg="gray.100"
      p={4}
      boxShadow="sm"
      width="full"
    >
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          {title}
        </Text>
        <BreadcrumbRoot variant="underline">
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItem key={index}>
              <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </BreadcrumbRoot>
      </Box>
      <Flex alignItems="center">
        <Avatar
          name="Segun Adebayo"
          src="https://bit.ly/sage-adebayo"
          variant="outline"
        />
      </Flex>
    </Flex>
  );
};

export default AdminNavbar;
