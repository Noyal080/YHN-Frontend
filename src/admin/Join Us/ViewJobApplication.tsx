import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { JobApplicationType } from "@/utils/types";

import {
  Badge,
  Box,
  Flex,
  Heading,
  Icon,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiBriefcase, FiCalendar, FiExternalLink } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

const JobApplicationView = () => {
  const [jobApplicationData, setJobApplicationData] =
    useState<JobApplicationType>();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/JobApplications/${id}`);
        setJobApplicationData(res.data.data);
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

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Join Us", link: "/admin/join-us" },
        { label: `View Job Application` },
      ]}
      activeSidebarItem="Join Us"
      title={`View Job Application`}
    >
      <Box mx="auto" p={4} bg={"white"}>
        {isLoading ? (
          <>
            <Skeleton height="40px" mb={4} />
            <SkeletonText mt="4" noOfLines={2} gap="4" />
            <Separator my={6} />
            <Stack gap={6}>
              <Box>
                <Skeleton height="25px" width="150px" mb={3} />
                <SkeletonText noOfLines={4} gap="3" />
              </Box>
              <Box>
                <Skeleton height="25px" width="200px" mb={3} />
                <Stack gap={4}>
                  {Array(4)
                    .fill(null)
                    .map((_, idx) => (
                      <Flex align="center" key={idx}>
                        <Skeleton boxSize={5} mr={3} />
                        <Skeleton height="16px" width="80%" />
                      </Flex>
                    ))}
                </Stack>
              </Box>
            </Stack>
          </>
        ) : (
          <>
            <Flex justify="space-between" align="flex-start" mb={6}>
              <Box>
                <Heading as="h1" size="xl" mb={2}>
                  {jobApplicationData?.title}
                </Heading>
                <Text fontSize="lg" color="gray.500" mb={4}>
                  {jobApplicationData?.job_open_position?.name}
                </Text>
              </Box>
              <Badge
                colorPalette={
                  jobApplicationData?.status === "1" ? "green" : "red"
                }
                px={3}
                py={1}
                fontSize="md"
              >
                {jobApplicationData?.status === "1" ? "Show" : "Hide"}
              </Badge>
            </Flex>

            <Separator my={4} />

            <Stack gap={6}>
              <Box>
                <Heading as="h2" size="md" mb={3}>
                  Job Description
                </Heading>
                <Text
                  whiteSpace="pre-line"
                  dangerouslySetInnerHTML={{
                    __html: jobApplicationData?.description ?? "",
                  }}
                />
              </Box>

              <Box>
                <Heading as="h2" size="md" mb={3}>
                  Job Application Details
                </Heading>
                <Stack gap={4}>
                  <Flex align="center">
                    <Icon as={FiCalendar} mr={3} boxSize={5} />
                    <Text>
                      <Text as="span" fontWeight="semibold">
                        Start Date:{" "}
                      </Text>
                      {jobApplicationData?.start_date}
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <Icon as={FiCalendar} mr={3} boxSize={5} />
                    <Text>
                      <Text as="span" fontWeight="semibold">
                        End Date:{" "}
                      </Text>
                      {jobApplicationData?.end_date}
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <Icon as={FiBriefcase} mr={3} boxSize={5} />
                    <Text>
                      <Text as="span" fontWeight="semibold">
                        Position:{" "}
                      </Text>
                      {jobApplicationData?.job_open_position?.name}
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <Icon as={FiExternalLink} mr={3} boxSize={5} />
                    <Text>
                      <Text as="span" fontWeight="semibold">
                        Apply Link:{" "}
                      </Text>
                      <Link
                        to={jobApplicationData?.apply_link ?? ""}
                        color="blue"
                      >
                        {jobApplicationData?.apply_link}
                      </Link>
                    </Text>
                  </Flex>
                </Stack>
              </Box>
            </Stack>
          </>
        )}
      </Box>
    </AdminLayout>
  );
};

export default JobApplicationView;
