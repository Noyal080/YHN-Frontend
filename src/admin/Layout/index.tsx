import React, { useMemo } from "react";
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
  const isExpanded = useSelector(
    (state: RootState) => state.sidebar.isExpanded
  );

  // Memoize the sidebar width calculation
  const sidebarWidth = useMemo(
    () => (isExpanded ? "300px" : "80px"),
    [isExpanded]
  );

  // Memoize the sidebar component to prevent unnecessary re-renders
  const memoizedSidebar = useMemo(
    () => <Sidebar activeSidebarItem={activeSidebarItem} />,
    [activeSidebarItem]
  );

  // Memoize the navbar component since breadcrumbItems might be a new array each render
  const memoizedNavbar = useMemo(
    () => <AdminNavbar title={title} breadcrumbItems={breadcrumbItems} />,
    [title, breadcrumbItems]
  );

  return (
    <Flex h="100vh">
      <Box width={sidebarWidth} transition="width 0.3s ease" flexShrink={0}>
        {memoizedSidebar}
      </Box>

      <Flex flex={1} flexDirection="column" overflow="hidden">
        {memoizedNavbar}
        <Box flex={1} px={4} py={4} overflow="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default React.memo(AdminLayout);
