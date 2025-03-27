import { useEffect, useState } from "react";
import AdminLayout from "../Layout";
import { axiosInstance } from "@/api/axios";
import {
  Box,
  CardBody,
  CardRoot,
  Flex,
  Heading,
  IconButton,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { HiPencil } from "react-icons/hi2";
import { User } from "@/utils";
import ProfileEditModal from "./ProfileEditModal";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [refetchData, setRefetchData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/profile");
        setProfileData(res.data.data.user);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
        setRefetchData(false);
      }
    };
    fetchData();
  }, [refetchData]);

  return (
    <AdminLayout
      title="Profile Section"
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        {
          label: "My Profile",
        },
      ]}
      activeSidebarItem="Profile"
    >
      <Box maxW={"50%"}>
        <Heading size="xl" fontWeight={"semibold"} mb={4} pl={5}>
          My Profile
        </Heading>
        {loading ? (
          <Box p={5}>
            <VStack align="start" gap={5}>
              <SkeletonCircle size="100px" />
              <SkeletonText noOfLines={4} gap={4} height="20px" width="300px" />
            </VStack>
          </Box>
        ) : (
          profileData && (
            <Box p={5}>
              <CardRoot size={"sm"}>
                <CardBody>
                  <Flex gap={8}>
                    {/* Left Side: Avatar */}
                    <Box>
                      {imageError ? (
                        <Box
                          height="100px"
                          width="100px"
                          borderRadius="full"
                          backgroundColor="gray.200"
                          display="flex"
                          alignItems="center"
                          boxSize="150px"
                          justifyContent="center"
                        >
                          <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color="gray.600"
                          >
                            {profileData.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")}
                          </Text>
                        </Box>
                      ) : (
                        <Image
                          height="100px"
                          src={profileData.image}
                          boxSize="150px"
                          borderRadius="full"
                          fit="cover"
                          onError={() => setImageError(true)}
                          alt="Profile Image"
                        />
                      )}
                    </Box>

                    {/* Right Side: User Information */}
                    <Box flex={1} mt={4}>
                      <Heading size="md" mb={4}>
                        {profileData.name}
                      </Heading>
                      <Heading size="md">Admin</Heading>
                    </Box>

                    <IconButton
                      aria-label="Edit Profile"
                      size="sm"
                      position="absolute"
                      variant={"outline"}
                      top={2}
                      right={2}
                      onClick={() => {
                        setEditModal(true);
                      }}
                    >
                      <HiPencil />
                    </IconButton>
                  </Flex>
                </CardBody>
              </CardRoot>
              <CardRoot mt={5}>
                <CardBody>
                  <Heading size="md" mb={4}>
                    Personal Information
                  </Heading>

                  {/* SimpleGrid for organizing fields */}
                  <SimpleGrid columns={2} gap={4}>
                    {/* Name and Email */}
                    <Box>
                      <Text
                        fontSize={"sm"}
                        fontWeight={"semibold"}
                        color={"gray.500"}
                      >
                        Name
                      </Text>
                      <Text fontSize={"sm"}>
                        {profileData.name || "Not provided"}
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        fontSize={"sm"}
                        color={"gray.500"}
                        fontWeight={"semibold"}
                      >
                        Email
                      </Text>
                      <Text fontSize={"sm"}>
                        {" "}
                        {profileData.email || "Not provided"}
                      </Text>
                    </Box>

                    {/* Phone and Address */}
                    <Box>
                      <Text
                        fontSize={"sm"}
                        color={"gray.500"}
                        fontWeight={"semibold"}
                      >
                        Phone
                      </Text>
                      <Text fontSize={"sm"}>
                        {profileData.phone || "Not provided"}
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        fontSize={"sm"}
                        color={"gray.500"}
                        fontWeight={"semibold"}
                      >
                        Address
                      </Text>
                      <Text fontSize={"sm"}>
                        {profileData.address || "Not provided"}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </CardBody>
              </CardRoot>
            </Box>
          )
        )}
      </Box>
      {profileData && (
        <ProfileEditModal
          isOpen={editModal}
          onClose={() => {
            setEditModal(false);
            setRefetchData(true);
          }}
          profileData={profileData}
        />
      )}
    </AdminLayout>
  );
};

export default ProfilePage;
