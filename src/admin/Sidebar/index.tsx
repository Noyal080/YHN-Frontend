import React, { useState } from "react";
import {
  Box,
  VStack,
  Text,
  Link,
  IconButton,
  Flex,
  CollapsibleRoot,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiSettings,
  FiChevronLeft,
  FiHome,
  FiMail,
  FiInfo,
  FiUser,
  FiDollarSign,
  FiBriefcase,
  FiFolder,
  FiCalendar,
  FiImage,
  FiCamera,
  FiVideo,
} from "react-icons/fi";
import { LuImagePlay, LuLayoutDashboard, LuQuote } from "react-icons/lu";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { SidebarProps } from "@/utils";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeLink, setActiveLink] = useState<string>("Dashboard");
  const [openDropdown, setOpenDropdown] = useState<number[]>([]);
  const navigate = useNavigate();
  const handleLinkClick = (label: string, link: string) => {
    setActiveLink(label);
    navigate(link);
  };

  const toggleSidebar = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onToggle(newExpandedState);
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdown((prevState) =>
      prevState.includes(id)
        ? prevState.filter((item) => item !== id)
        : [...prevState, id]
    );
  };

  const menuItems = [
    {
      id: 1,
      label: "Dashboard",
      icon: LuLayoutDashboard,
      link: "/admin/dashboard",
    },
    {
      id: 2,
      label: "Home",
      icon: FiHome,
      children: [
        { label: "Slider", icon: LuImagePlay, link: "/admin/slider" },
        { label: "Message Request", icon: FiMail, link: "/admin/messages" },
        { label: "Partner Slider", icon: FiUsers, link: "/admin/partners" },
      ],
    },
    {
      id: 3,
      label: "About Us",
      icon: FiInfo,
      children: [
        { label: "Who are we", icon: FiUser, link: "/admin/about" },
        {
          label: "Board of Directors",
          icon: FiSettings,
          link: "/admin/founder",
        },
        { label: "Our Team", icon: FiUsers, link: "/admin/team" },
        {
          label: "Testimonial",
          icon: LuQuote,
          link: "/admin/testimonials",
        },
        {
          label: "Donation",
          icon: FiDollarSign,
          link: "/admin/donation",
        },
        {
          label: "Volunteer / Careers",
          icon: FiBriefcase,
          link: "/admin/careers",
        },
      ],
    },
    { id: 4, label: "Projects", icon: FiFolder, link: "/admin/projects" },
    { id: 5, label: "Events", icon: FiCalendar, link: "/admin/events" },
    { id: 6, label: "Services", icon: FiSettings, link: "/admin/services" },
    {
      id: 7,
      label: "Gallery",
      icon: FiImage,
      children: [
        { label: "Photo", icon: FiCamera, link: "/admin/gallery/photos" },
        { label: "Video", icon: FiVideo, link: "/admin/gallery/videos" },
      ],
    },
  ];

  const renderMenuItem = (item: any) => {
    const isOpen = openDropdown.includes(item.id);

    const menuItemContent = (
      <Flex align="center">
        <item.icon
          size={20}
          style={{ marginRight: isExpanded ? "12px" : "0" }}
        />
        {isExpanded && item.label}
      </Flex>
    );

    return (
      <Box key={item.label} w="100%">
        <CollapsibleRoot defaultOpen={isOpen}>
          <Tooltip
            content={item.label}
            disabled={isExpanded}
            positioning={{ placement: "right" }}
          >
            <CollapsibleTrigger
              as={Flex}
              alignContent={"center"}
              justifyContent="space-between"
              onClick={() =>
                item.children
                  ? toggleDropdown(item.id)
                  : handleLinkClick(item.label, item.link)
              }
              _hover={{ color: "teal.300" }}
              p={2}
              borderRadius="md"
              transition="background 0.2s"
              cursor="pointer"
              color={activeLink === item.label ? "teal.400" : "gray.300"}
              fontWeight={activeLink === item.label ? "bold" : "normal"}
            >
              {menuItemContent}
              {item.children && isExpanded && (
                <Flex
                  transform={isOpen ? "rotate(-90deg)" : "rotate(0)"}
                  transition="transform 0.2s"
                >
                  <FiChevronLeft size={16} />
                </Flex>
              )}
            </CollapsibleTrigger>
          </Tooltip>

          {/* Collapsible Content */}
          {item.children && (
            <CollapsibleContent>
              <VStack align="start" pl={isExpanded ? 6 : 0} mt={2}>
                {item.children.map((child: any) => (
                  <Tooltip
                    key={child.label}
                    content={child.label}
                    disabled={isExpanded}
                    positioning={{ placement: "right" }}
                  >
                    <Link
                      color={
                        activeLink === child.label ? "teal.400" : "gray.300"
                      }
                      fontWeight={
                        activeLink === child.label ? "bold" : "normal"
                      }
                      onClick={() => handleLinkClick(child.label, child.link)}
                      _hover={{ color: "teal.300" }}
                      p={2}
                      borderRadius="md"
                      transition="background 0.2s"
                      w="100%"
                    >
                      <Flex align="center">
                        <child.icon
                          size={20}
                          style={{ marginRight: isExpanded ? "12px" : "0" }}
                        />
                        {isExpanded && child.label}
                      </Flex>
                    </Link>
                  </Tooltip>
                ))}
              </VStack>
            </CollapsibleContent>
          )}
        </CollapsibleRoot>
      </Box>
    );
  };

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
        {menuItems.map((item) => renderMenuItem(item))}
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
