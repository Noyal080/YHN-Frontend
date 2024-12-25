import React, { useState } from "react";
import { Box, BreadcrumbItem, Flex, Text } from "@chakra-ui/react";

import Sidebar from "../Sidebar";
import { BreadcrumbLink, BreadcrumbRoot } from "@/components/ui/breadcrumb";
import { AdminLayoutProps } from "@/utils";
import { Avatar } from "@/components/ui/avatar";

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  breadcrumbItems,
  title,
}) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);

  // Example breadcrumb and header (Replace with your own dynamic logic)

  const handleSidebarToggle = (expanded: boolean) => {
    setIsSidebarExpanded(expanded);
  };

  return (
    <Flex flexDirection="column" h="screen" overflow="hidden">
      {/* Top Bar */}

      <Sidebar onToggle={handleSidebarToggle} />
      {/* Sidebar */}
      <Flex>
        <Flex
          as="header"
          bg="gray.100"
          p={4}
          // alignItems="center"
          // justifyContent="space-between"
          boxShadow="sm"
          zIndex={10}
          w="100%"
          position="fixed"
          top={0}
          right={0}
          left={isSidebarExpanded ? "300px" : "80px"}
          transition="left 0.3s ease"
        >
          <Flex
            alignItems="center"
            justifyContent={"space-between"}
            w={isSidebarExpanded ? "80%" : "92%"}
          >
            <Box>
              <Text fontSize={"xl"} fontWeight="bold" mb={0}>
                {title}
              </Text>
              <BreadcrumbRoot variant="underline">
                {breadcrumbItems.map((item, index) => (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink href={item.link}>
                      {item.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ))}
              </BreadcrumbRoot>
            </Box>
          </Flex>
          <Flex justifyContent="flex-end" width="80px">
            <Avatar
              name="Segun Adebayo"
              src="https://bit.ly/sage-adebayo"
              variant={"outline"}
              // marginRight={isSidebarExpanded ? "150px" : "50px"}
            />
          </Flex>
          {/* Avatar */}
          {/* Profile Dropdown */}
        </Flex>
        {/* Main Content */}
        <Box
          flex={1}
          ml={isSidebarExpanded ? "300px" : "80px"}
          mt="64px"
          transition="margin-left 0.3s ease"
          px={6}
          py={7}
          overflow={"auto"}
          h={"full"}
          w={"full"}
        >
          {/* Page Content */}
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default AdminLayout;
