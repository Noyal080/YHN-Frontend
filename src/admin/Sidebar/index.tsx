import React from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { toggleDropdown, toggleSidebar } from "@/redux/sidebarSlice";
import { RootState } from "@/redux/store";

const Sidebar: React.FC<SidebarProps> = ({ activeSidebarItem }) => {
  const dispatch = useDispatch();
  const { isExpanded, openDropdowns } = useSelector(
    (state: RootState) => state.sidebar
  );

  const navigate = useNavigate();
  const handleLinkClick = (link: string) => {
    navigate(link);
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleSidebarDropdown = (id: number) => {
    dispatch(toggleDropdown(id));
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
      label: "Home Section",
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
    const isOpen = openDropdowns.includes(item.id);

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
                  ? handleSidebarDropdown(item.id)
                  : handleLinkClick(item.link)
              }
              _hover={{ color: "teal.300" }}
              p={2}
              borderRadius="md"
              transition="background 0.2s"
              cursor="pointer"
              color={item.label === activeSidebarItem ? "teal.400" : "gray.300"}
              fontWeight={item.label === activeSidebarItem ? "bold" : "normal"}
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
                        child.label === activeSidebarItem
                          ? "teal.400"
                          : "gray.300"
                      }
                      fontWeight={
                        child.label === activeSidebarItem ? "bold" : "normal"
                      }
                      onClick={() => handleLinkClick(child.link)}
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
        onClick={handleSidebarToggle}
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
