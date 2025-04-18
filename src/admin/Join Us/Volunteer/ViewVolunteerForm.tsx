import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import { InternshipType } from "@/utils/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Skeleton,
  VStack,
  HStack,
  Separator,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { Card, CardContent } from "@/components/ui/card";
import { FiCalendar, FiClock } from "react-icons/fi";

const ViewVolunteer = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const [internshipData, setInternshipData] = useState<InternshipType>({
    title: "",
    description: "",
    apply_link: "",
    status: 0,
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/volunteers/${id}`);
        setInternshipData(res.data.data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <Badge colorPalette="red" size={"lg"}>
            Inactive
          </Badge>
        );
      case 1:
        return (
          <Badge colorPalette="green" size={"lg"}>
            Active
          </Badge>
        );
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Volunteer", link: "/admin/volunteer" },
        { label: `View Volunteer Application` },
      ]}
      activeSidebarItem="Volunteer"
      title={`View Volunteer Application`}
    >
      <Card>
        <CardContent>
          {isLoading ? (
            <VStack gap={4} align="stretch">
              <Skeleton height="40px" />
              <Skeleton height="20px" />
              <Skeleton height="100px" />
              <Skeleton height="20px" />
            </VStack>
          ) : (
            <VStack gap={6} align="stretch">
              <Flex justify="space-between" align="flex-start">
                <Box>
                  <Heading size="2xl" mb={2}>
                    {internshipData.title}
                  </Heading>
                </Box>

                {getStatusBadge(internshipData.status)}
              </Flex>

              <Box bg="gray.50" p={4} borderRadius="md">
                <HStack gap={8} flexWrap="wrap">
                  <Box>
                    <HStack color="gray.600" mb={1}>
                      <Icon as={FiCalendar} />
                      <Text fontWeight="bold">Posted on</Text>
                    </HStack>
                    <Text fontSize="lg">
                      {formatDate(internshipData.start_date)}
                    </Text>
                  </Box>
                  <Box>
                    <HStack color="gray.600" mb={1}>
                      <Icon as={FiClock} />
                      <Text fontWeight="bold">Deadline</Text>
                    </HStack>
                    <Text fontSize="lg">
                      {formatDate(internshipData.end_date)}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              <Separator />

              <Box>
                <Heading size="md" mb={4}>
                  Description
                </Heading>
                <Box
                  dangerouslySetInnerHTML={{
                    __html: internshipData.description,
                  }}
                  className="prose" // If you're using Tailwind CSS, this will style HTML content
                  maxW="100%"
                />
              </Box>
            </VStack>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default ViewVolunteer;
