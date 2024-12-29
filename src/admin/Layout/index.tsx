import React, { useState } from "react";
import { Box, BreadcrumbItem, Flex, Text } from "@chakra-ui/react";

import Sidebar from "../Sidebar";
import { AdminLayoutProps } from "@/utils";
import AdminNavbar from "../Navbar";

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  breadcrumbItems,
  title,
}) => {
  const [sidebarWidth, setSidebarWidth] = useState<string>("300px");

  const handleSidebarToggle = (expanded: boolean) => {
    setSidebarWidth(expanded ? "300px" : "80px");
  };

  return (
    <Flex h="100vh">
      <Box width={sidebarWidth} transition="width 0.3s ease" flexShrink={0}>
        <Sidebar onToggle={handleSidebarToggle} />
      </Box>

      {/* Main Content Area */}
      <Flex flex={1} flexDirection="column" overflow="hidden">
        {/* Navbar */}
        <AdminNavbar title={title} breadcrumbItems={breadcrumbItems} />
        <Box flex={1} px={4} py={4} overflow="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default AdminLayout;
