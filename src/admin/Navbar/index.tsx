import { Box, BreadcrumbItem, Flex, Text } from "@chakra-ui/react";
import { BreadcrumbLink, BreadcrumbRoot } from "@/components/ui/breadcrumb";
import { Avatar } from "@/components/ui/avatar";
import { NavbarProps } from "@/utils";

import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { useNavigate } from "react-router-dom";
import useCommonToast from "@/common/CommonToast";
import { useSelector } from "react-redux";
import { persistor, RootState } from "@/redux/store";

const AdminNavbar: React.FC<NavbarProps> = ({ title, breadcrumbItems }) => {
  const navigate = useNavigate();
  const { image, name } = useSelector((state: RootState) => state.auth.user);

  const { showToast } = useCommonToast();
  const logout = async () => {
    try {
      // await axiosInstance.post("/logout");
      persistor.purge();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userData");
      showToast({
        description: "Logged out successfully",
        type: "success",
      });
      navigate("/login");
    } catch (e) {
      console.error(e);
      showToast({
        description: "Error while logging out",
        type: "error",
      });
    }
  };
  return (
    <Flex
      as="header"
      justifyContent="space-between"
      bg="gray.100"
      p={4}
      boxShadow="sm"
      width="full"
    >
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          {title}
        </Text>
        <BreadcrumbRoot variant="underline">
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItem key={index}>
              {item.link ? (
                <BreadcrumbLink
                  cursor="pointer"
                  onClick={() => navigate(`${item.link}`)}
                >
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <span>{item.label}</span>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbRoot>
      </Box>
      <Flex alignItems="center" mr={10}>
        <MenuRoot size={"md"} positioning={{ placement: "bottom" }}>
          <MenuTrigger>
            <Avatar
              name={name}
              src={image}
              variant="outline"
              cursor={"pointer"}
            />
          </MenuTrigger>
          <MenuContent>
            <MenuItem value="prof" onClick={() => navigate("/admin/profile")}>
              {" "}
              My Profile{" "}
            </MenuItem>
            <MenuItem value="prog" onClick={() => logout()}>
              {" "}
              Logout
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </Flex>
    </Flex>
  );
};

export default AdminNavbar;
