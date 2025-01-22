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
  Container,
  Image,
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
import { Tooltip } from "@/components/ui/tooltip";
import { SidebarProps } from "@/utils";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleDropdown, toggleSidebar } from "@/redux/sidebarSlice";
import { RootState } from "@/redux/store";
import Logo from "../../assets/YHN_Logo.jpg";
import SmallLogo from "../../assets/LogoSmall.png";
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
      link: "/admin",
    },
    {
      id: 2,
      label: "Home Section",
      icon: FiHome,
      children: [
        { id: 21, label: "Slider", icon: LuImagePlay, link: "/admin/slider" },
        {
          id: 22,
          label: "Message Request",
          icon: FiMail,
          link: "/admin/messages",
        },
        {
          id: 23,
          label: "Partner Slider",
          icon: FiUsers,
          link: "/admin/partners",
        },
      ],
    },
    {
      id: 3,
      label: "About Us",
      icon: FiInfo,
      children: [
        { id: 31, label: "Who are we", icon: FiUser, link: "/admin/about" },
        {
          id: 32,
          label: "Board of Directors",
          icon: FiSettings,
          link: "/admin/founder",
        },
        { id: 33, label: "Our Team", icon: FiUsers, link: "/admin/team" },
        {
          id: 34,
          label: "Testimonial",
          icon: LuQuote,
          link: "/admin/testimonials",
        },
        {
          id: 35,
          label: "Donation",
          icon: FiDollarSign,
          link: "/admin/donation",
        },
        {
          id: 36,
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
        {
          id: 71,
          label: "Photo",
          icon: FiCamera,
          link: "/admin/gallery/photos",
        },
        {
          id: 72,
          label: "Video",
          icon: FiVideo,
          link: "/admin/gallery/videos",
        },
      ],
    },
  ];

  interface MenuItem {
    id: number;
    label: string;
    icon: React.ElementType;
    link?: string;
    children?: MenuItem[];
  }

  const renderMenuItem = (item: MenuItem) => {
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
                  : item?.link
                  ? handleLinkClick(item?.link)
                  : null
              }
              _hover={{ color: "teal.600" }}
              p={2}
              borderRadius="md"
              transition="background 0.2s"
              cursor="pointer"
              color={
                item.label === activeSidebarItem ? "teal.500" : "black.300"
              }
              // fontWeight={item.label === activeSidebarItem ? "bold" : "normal"}
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
                {item.children.map(
                  (child: {
                    label: string;
                    icon: React.ElementType;
                    link?: string;
                  }) => (
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
                            : "black.300"
                        }
                        // fontWeight={
                        //   child.label === activeSidebarItem ? "bold" : "normal"
                        // }
                        onClick={() =>
                          child?.link ? handleLinkClick(child?.link) : null
                        }
                        _hover={{ color: "teal.600" }}
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
                  )
                )}
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
      bg="white.200"
      color="black.400"
      position="fixed"
      boxShadow="lg"
      borderRadius="md"
      transition="width 0.3s ease"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      zIndex={1000}
    >
      <Container
        maxH="100%"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "0px",
          },
          "&::-webkit-scrollbar-track": {
            width: "0px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
            borderRadius: "24px",
          },
        }}
        p={4}
      >
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
              <Image
                src={Logo}
                alt="Logo Image"
                objectFit="cover"
                width="100%"
                height="100%"
              />
            ) : (
              <Image
                src={SmallLogo}
                alt="Logo Image"
                borderRadius="full"
                fit="cover"
                width="100%"
                height="100%"
              />
            )}
          </Text>

          {/* Menu Items */}
          {menuItems.map((item) => renderMenuItem(item))}
        </VStack>
      </Container>
      {/* Top Section */}

      {/* Expand/Collapse Button */}
      <IconButton
        aria-label="Toggle Sidebar"
        onClick={handleSidebarToggle}
        size="sm"
        variant="ghost"
        color="black.500"
        _hover={{ color: "teal.500" }}
        position="absolute"
        top="9%"
        right={isExpanded ? "-12px" : "-16px"}
        transform={`translateY(-50%) rotate(${isExpanded ? "0deg" : "180deg"})`}
        transition="all 0.3s ease"
        bg="gray.100"
        borderRadius="full"
        boxShadow="md"
      >
        <FiChevronLeft />
      </IconButton>

      {/* Bottom Section */}
      {isExpanded && (
        <Text fontSize="sm" color="gray.500" mt="auto" p={"4"}>
          © 2024 Admin Dashboard
        </Text>
      )}
    </Box>
  );
};

export default Sidebar;
