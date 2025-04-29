import React, { memo } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../Sidebar";
import AdminNavbar from "../Navbar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const MemoizedSidebar = memo(Sidebar);
const MemoizedNavbar = memo(AdminNavbar);

interface BreadcrumbItem {
  label: string;
  link?: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
  title?: string;
  activeSidebarItem?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  breadcrumbItems = [],
  title = "",
  activeSidebarItem = "",
}) => {
  const isExpanded = useSelector(
    (state: RootState) => state.sidebar.isExpanded
  );

  const sidebarWidth = isExpanded ? "300px" : "80px";

  return (
    <Flex h="100vh">
      <Box width={sidebarWidth} transition="width 0.3s ease" flexShrink={0}>
        <MemoizedSidebar activeSidebarItem={activeSidebarItem} />
      </Box>

      <Flex flex={1} flexDirection="column" overflow="hidden">
        <MemoizedNavbar title={title} breadcrumbItems={breadcrumbItems} />
        <Box flex={1} px={4} py={4} overflow="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default memo(AdminLayout);
