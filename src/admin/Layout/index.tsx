import React from "react";
import { Box, Flex } from "@chakra-ui/react";

import Sidebar from "../Sidebar";
import { AdminLayoutProps } from "@/utils";
import AdminNavbar from "../Navbar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  breadcrumbItems,
  title,
  activeSidebarItem,
}) => {
  const { isExpanded } = useSelector((state: RootState) => state.sidebar);
  const sidebarWidth = isExpanded ? "300px" : "80px";

  return (
    <Flex h="100vh">
      <Box width={sidebarWidth} transition="width 0.3s ease" flexShrink={0}>
        <Sidebar activeSidebarItem={activeSidebarItem} />
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
