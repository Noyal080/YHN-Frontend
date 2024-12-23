import React, { useState } from "react";
import { Box, BreadcrumbItem, Flex, Text } from "@chakra-ui/react";

import Sidebar from "../Sidebar";
import { BreadcrumbLink, BreadcrumbRoot } from "@/components/ui/breadcrumb";
import { AdminLayoutProps } from "@/utils";

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  breadcrumbItems,
  dynamicHeader,
}) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);

  // Example breadcrumb and header (Replace with your own dynamic logic)

  const handleSidebarToggle = (expanded: boolean) => {
    setIsSidebarExpanded(expanded);
  };

  return (
    <Flex flexDirection="column" h="100vh">
      {/* Top Bar */}
      <Flex
        as="header"
        bg="gray.100"
        p={4}
        alignItems="center"
        justifyContent="space-between"
        boxShadow="sm"
        zIndex={10}
        w="100%"
        position="fixed"
        top={0}
        left={isSidebarExpanded ? "300px" : "80px"}
        transition="left 0.3s ease"
      >
        <Box>
          <Text fontSize={"xl"} fontWeight="bold" mb={2}>
            {dynamicHeader}
          </Text>
          <BreadcrumbRoot variant="underline">
            {breadcrumbItems.map((item, index) => (
              <BreadcrumbItem key={index}>
                <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </BreadcrumbRoot>
        </Box>

        {/* Profile Dropdown */}
      </Flex>

      {/* Sidebar */}
      <Flex>
        <Sidebar onToggle={handleSidebarToggle} />

        {/* Main Content */}
        <Box
          flex={1}
          ml={isSidebarExpanded ? "300px" : "80px"}
          mt="64px" // To offset the height of the fixed top bar
          transition="margin-left 0.3s ease"
          px={6}
          py={7}
        >
          {/* Page Content */}
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default AdminLayout;
