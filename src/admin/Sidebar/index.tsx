import React from "react";
import {
  Box,
  VStack,
  Text,
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
  FiChevronLeft,
  FiHome,
  FiMail,
  FiInfo,
  FiUser,
  FiDollarSign,
  FiFolder,
  FiCalendar,
  FiImage,
  FiCamera,
  FiVideo,
  FiUserPlus,
  FiUserCheck,
  FiBookOpen,
  FiSettings,
} from "react-icons/fi";
import {
  LuBell,
  LuContactRound,
  LuImagePlay,
  LuLayoutDashboard,
  LuQuote,
} from "react-icons/lu";
import { SidebarProps } from "@/utils";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleDropdown, toggleSidebar } from "@/redux/sidebarSlice";
import { RootState } from "@/redux/store";
import Logo from "../../assets/YHN_Logo.jpg";
import SmallLogo from "../../assets/LogoSmall.png";

interface MenuItem {
  id: number;
  label: string;
  icon: React.ElementType;
  link?: string;
  children?: MenuItem[];
}

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
      id: 8,
      label: "Notification",
      icon: LuBell,
      children: [
        {
          id: 22,
          label: "Messages",
          icon: FiMail,
          link: "/admin/messages",
        },
      ],
    },
    {
      id: 2,
      label: "Home Section",
      icon: FiHome,
      children: [
        { id: 21, label: "Sliders", icon: LuImagePlay, link: "/admin/sliders" },
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
        // {
        //   id: 32,
        //   label: "Board of Directors",
        //   icon: FiSettings,
        //   link: "/admin/founder",
        // },
        { id: 33, label: "Our Team", icon: FiUsers, link: "/admin/teams" },
        {
          id: 34,
          label: "Company Profile",
          icon: LuContactRound,
          link: "/admin/company-profile",
        },
      ],
    },

    {
      id: 9,
      label: "Join Us",
      icon: FiUserPlus,
      children: [
        {
          id: 91,
          label: "Volunteer",
          icon: FiUserCheck,
          link: "/admin/volunteer",
        },
        {
          id: 92,
          label: "Internship",
          icon: FiBookOpen,
          link: "/admin/internship",
        },
        {
          id: 94,
          label: "Testimonial",
          icon: LuQuote,
          link: "/admin/testimonials",
        },
        {
          id: 95,
          label: "Donation",
          icon: FiDollarSign,
          link: "/admin/donation",
        },
      ],
    },
    { id: 4, label: "Our Works", icon: FiFolder, link: "/admin/our-works" },
    { id: 5, label: "News & Events", icon: FiCalendar, link: "/admin/events" },
    { id: 6, label: "Services", icon: FiSettings, link: "/admin/services" },
    {
      id: 7,
      label: "Gallery",
      icon: FiImage,
      children: [
        {
          id: 71,
          label: "Image",
          icon: FiCamera,
          link: "/admin/gallery/images",
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

  const renderMenuItem = (item: MenuItem) => {
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
      <Box key={item.id} w="100%">
        <Flex
          alignContent="center"
          justifyContent="space-between"
          onClick={() => item?.link && handleLinkClick(item.link)}
          _hover={{ color: "teal.600" }}
          p={2}
          borderRadius="md"
          transition="background 0.2s"
          cursor="pointer"
          color={item.label === activeSidebarItem ? "teal.500" : "black.300"}
        >
          {menuItemContent}
        </Flex>
      </Box>
    );
  };

  const renderParentMenuItem = (item: MenuItem) => {
    const isOpen = openDropdowns.includes(item.id);

    return (
      <Box key={item.id} w="100%">
        <CollapsibleRoot defaultOpen={isOpen}>
          <CollapsibleTrigger
            as={Flex}
            alignContent="center"
            justifyContent="space-between"
            onClick={() => handleSidebarDropdown(item.id)}
            _hover={{ color: "teal.600" }}
            p={2}
            borderRadius="md"
            transition="background 0.2s"
            cursor="pointer"
            color={item.label === activeSidebarItem ? "teal.500" : "black.300"}
          >
            <Flex align="center">
              <item.icon size={20} style={{ marginRight: "12px" }} />
              {item.label}
            </Flex>
            <Flex
              transform={isOpen ? "rotate(-90deg)" : "rotate(0)"}
              transition="transform 0.2s"
            >
              <FiChevronLeft size={16} />
            </Flex>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <VStack align="start" pl={6} mt={2}>
              {item.children?.map((child) => renderMenuItem(child))}
            </VStack>
          </CollapsibleContent>
        </CollapsibleRoot>
      </Box>
    );
  };

  const renderMenuContent = () => {
    if (isExpanded) {
      return menuItems.map((item) =>
        item.children ? renderParentMenuItem(item) : renderMenuItem(item)
      );
    } else {
      return menuItems.flatMap((item) =>
        item.children
          ? item.children.map((child) => renderMenuItem(child))
          : [renderMenuItem(item)]
      );
    }
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
          {renderMenuContent()}
          {/* {menuItems.map((item) => renderMenuItem(item))} */}
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
          © 2024 Yours Humanly Nepal
        </Text>
      )}
    </Box>
  );
};

export default Sidebar;
