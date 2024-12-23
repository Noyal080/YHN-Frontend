import React, { useState } from "react";
import { Box, VStack, Text, Link, IconButton, Flex } from "@chakra-ui/react";
import {
  FiGrid,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiLogOut,
  FiChevronLeft,
} from "react-icons/fi";
import { Avatar } from "@/components/ui/avatar";

interface SidebarProps {
  onToggle: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeLink, setActiveLink] = useState<string>("Dashboard");

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  const toggleSidebar = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onToggle(newExpandedState);
  };

  const menuItems = [
    { label: "Dashboard", icon: FiGrid },
    { label: "Users", icon: FiUsers },
    { label: "Settings", icon: FiSettings },
    { label: "Reports", icon: FiBarChart2 },
    { label: "Logout", icon: FiLogOut },
  ];

  return (
    <Box
      w={isExpanded ? "300px" : "80px"}
      h="100vh"
      bg="gray.800"
      color="white"
      p={4}
      position="fixed"
      boxShadow="lg"
      borderRadius="md"
      transition="width 0.3s ease"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      zIndex={1000}
    >
      {/* Top Section */}
      <VStack align="start">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          display="flex"
          alignItems="center"
          className="space-y-4"
          mb={5}
        >
          {isExpanded ? (
            "Yours Humanly Nepal"
          ) : (
            <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
          )}
        </Text>

        {/* Menu Items */}
        {menuItems.map(({ label, icon: Icon }) => (
          <Link
            key={label}
            href="#"
            color={activeLink === label ? "teal.400" : "gray.300"}
            fontWeight={activeLink === label ? "bold" : "normal"}
            onClick={() => handleLinkClick(label)}
            _hover={{ color: "teal.300" }}
            p={2}
            borderRadius="md"
            transition="background 0.2s"
            w="100%"
          >
            <Flex align="center">
              <Icon
                size={20}
                style={{ marginRight: isExpanded ? "12px" : "0" }}
              />
              {isExpanded && label}
            </Flex>
          </Link>
        ))}
      </VStack>

      {/* Expand/Collapse Button */}
      <IconButton
        aria-label="Toggle Sidebar"
        onClick={toggleSidebar}
        size="sm"
        variant="ghost"
        color="gray.300"
        _hover={{ color: "white" }}
        position="absolute"
        top="9%"
        right={isExpanded ? "-12px" : "-16px"}
        transform={`translateY(-50%) rotate(${isExpanded ? "0deg" : "180deg"})`}
        transition="all 0.3s ease"
        bg="gray.700"
        borderRadius="full"
        boxShadow="md"
      >
        <FiChevronLeft />
      </IconButton>

      {/* Bottom Section */}
      {isExpanded && (
        <Text fontSize="sm" color="gray.500" mt="auto">
          © 2024 Admin Dashboard
        </Text>
      )}
    </Box>
  );
};

export default Sidebar;
