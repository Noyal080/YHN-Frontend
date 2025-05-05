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
  FiSettings,
} from "react-icons/fi";
import { RiTeamFill } from "react-icons/ri";
import { GiNewspaper, GiPublicSpeaker } from "react-icons/gi";
import { MdGroups, MdOutlineEventAvailable } from "react-icons/md";
import { PiChartLineUp } from "react-icons/pi";
import { GoOrganization } from "react-icons/go";
import {
  LuContactRound,
  LuImagePlay,
  LuLayoutDashboard,
  LuQuote,
} from "react-icons/lu";
import { SidebarProps } from "@/utils";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleDropdown, toggleSidebar } from "@/redux/sidebarSlice";
import { RootState } from "@/redux/store";
import Logo from "../../assets/YHN_Logo.jpg";
import SmallLogo from "../../assets/LogoSmall.png";
import {
  FaHandsHelping,
  FaTools,
  FaUserGraduate,
  FaUserNinja,
  FaUserTie,
} from "react-icons/fa";

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

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleSidebarDropdown = (id: number) => {
    dispatch(toggleDropdown(id));
  };

  const menuItems = [
    {
      id: 1, // Dashboard
      label: "Dashboard",
      icon: LuLayoutDashboard,
      link: "/admin",
    },
    {
      id: 2, // Messages
      label: "Messages",
      icon: FiMail,
      link: "/admin/messages",
    },
    {
      id: 3, // Donation
      label: "Donation",
      icon: FiDollarSign,
      link: "/admin/donation",
    },
    {
      id: 4, // Home Section (Parent)
      label: "Home Section",
      icon: FiHome,
      children: [
        {
          id: 401,
          label: "Sliders",
          icon: LuImagePlay,
          link: "/admin/sliders",
        },
        {
          id: 402,
          label: "Partner Slider",
          icon: FiUsers,
          link: "/admin/partners",
        },
        {
          id: 403,
          label: "Chairperson Message",
          icon: GiPublicSpeaker,
          link: "/admin/chairperson-message",
        },
        {
          id: 404,
          label: "Our Impact",
          icon: PiChartLineUp,
          link: "/admin/our-impact",
        },
      ],
    },
    {
      id: 5, // About Us (Parent)
      label: "About Us",
      icon: FiInfo,
      children: [
        { id: 501, label: "Who we are", icon: FiUser, link: "/admin/about" },
        {
          id: 502,
          label: "Testimonial",
          icon: LuQuote,
          link: "/admin/testimonials",
        },
      ],
    },
    {
      id: 6, // Our Team (Parent)
      label: "Our Team",
      icon: MdGroups,
      children: [
        { id: 601, label: "Core Team", icon: RiTeamFill, link: "/admin/teams" },
        {
          id: 602,
          label: "Board of Directors",
          icon: FaUserTie,
          link: "/admin/bod",
        },
        {
          id: 603,
          label: "Interns",
          icon: FaUserGraduate,
          link: "/admin/interns",
        },
        {
          id: 604,
          label: "Fellows",
          icon: FaUserNinja,
          link: "/admin/fellows",
        },
      ],
    },
    {
      id: 7, // What we do (Parent)
      label: "What we do",
      icon: FaHandsHelping,
      children: [
        {
          id: 701,
          label: "Our Works",
          icon: FiFolder,
          link: "/admin/our-works",
        },
        { id: 702, label: "Sectors", icon: FaTools, link: "/admin/sectors" },
      ],
    },
    {
      id: 8, // News & Events (Parent)
      label: "News & Events",
      icon: FiCalendar,
      children: [
        {
          id: 801,
          label: "Events",
          icon: MdOutlineEventAvailable,
          link: "/admin/events",
        },
        { id: 802, label: "News", icon: GiNewspaper, link: "/admin/news" },
      ],
    },
    {
      id: 9, // Gallery (Parent)
      label: "Gallery",
      icon: FiImage,
      children: [
        {
          id: 901,
          label: "Image",
          icon: FiCamera,
          link: "/admin/gallery/images",
        },
        {
          id: 902,
          label: "Video",
          icon: FiVideo,
          link: "/admin/gallery/videos",
        },
      ],
    },
    {
      id: 10, // Join Us (Parent)
      label: "Join Us",
      icon: FiUserPlus,
      link: "/admin/join-us",
    },
    {
      id: 11, // Settings (Parent)
      label: "Settings",
      icon: FiSettings,
      children: [
        {
          id: 1101,
          label: "Contact Information",
          icon: LuContactRound,
          link: "/admin/contact-us",
        },
        {
          id: 1102,
          label: "Organisation Information",
          icon: GoOrganization,
          link: "/admin/organization-details",
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
        {item.link ? (
          <Link to={item?.link}>
            <Flex
              alignContent="center"
              justifyContent="space-between"
              _hover={{ color: "teal.600" }}
              p={2}
              borderRadius="md"
              transition="background 0.2s"
              cursor="pointer"
              color={
                item.label === activeSidebarItem ? "teal.500" : "black.300"
              }
            >
              {menuItemContent}
            </Flex>
          </Link>
        ) : (
          <Flex
            alignContent="center"
            justifyContent="space-between"
            // onClick={() => item?.link && handleLinkClick(item.link)}
            _hover={{ color: "teal.600" }}
            p={2}
            borderRadius="md"
            transition="background 0.2s"
            cursor="pointer"
            color={item.label === activeSidebarItem ? "teal.500" : "black.300"}
          >
            {menuItemContent}
          </Flex>
        )}
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
          @ 2025 Yours Humanly Nepal All Rights Reserved
        </Text>
      )}
    </Box>
  );
};

export default Sidebar;
