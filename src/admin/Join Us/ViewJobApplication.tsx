import AdminLayout from "@/admin/Layout";

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
import { FiBriefcase, FiCalendar, FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";

type JobApplicationType = {
  id?: number;
  title: string;
  description: string;
  apply_link: string;
  job_position: string;
  start_date: string;
  end_date: string;
  status: "active" | "inactive"; // Changed to string literal type
};

const statusMap = {
  active: { label: "Active", color: "green" },
  inactive: { label: "Inactive", color: "red" },
};

const sampleApplication: JobApplicationType = {
  id: 1,
  title: "Senior Frontend Developer",
  description: "We are looking for an experienced frontend developer...",
  apply_link: "https://example.com/apply",
  job_position: "Senior Developer",
  start_date: "2023-06-01",
  end_date: "2023-07-15",
  status: "active", // or 'inactive'
};

const JobApplicationView = () => {
  const application = sampleApplication;
  const statusInfo = statusMap[application.status];

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
        <Flex justify="space-between" align="flex-start" mb={6}>
          <Box>
            <Heading as="h1" size="xl" mb={2}>
              {application.title}
            </Heading>
            <Text fontSize="lg" color="gray.500" mb={4}>
              {application.job_position}
            </Text>
          </Box>
          <Badge colorScheme={statusInfo.color} px={3} py={1} fontSize="md">
            {statusInfo.label}
          </Badge>
        </Flex>

        <Separator my={4} />

        <Stack gap={6}>
          <Box>
            <Heading as="h2" size="md" mb={3}>
              Job Description
            </Heading>
            <Text whiteSpace="pre-line">{application.description}</Text>
          </Box>

          <Box>
            <Heading as="h2" size="md" mb={3}>
              Application Details
            </Heading>
            <Stack gap={4}>
              <Flex align="center">
                <Icon as={FiCalendar} mr={3} boxSize={5} />
                <Text>
                  <Text as="span" fontWeight="semibold">
                    Start Date:{" "}
                  </Text>
                  {new Date(application.start_date).toLocaleDateString()}
                </Text>
              </Flex>
              <Flex align="center">
                <Icon as={FiCalendar} mr={3} boxSize={5} />
                <Text>
                  <Text as="span" fontWeight="semibold">
                    End Date:{" "}
                  </Text>
                  {new Date(application.end_date).toLocaleDateString()}
                </Text>
              </Flex>
              <Flex align="center">
                <Icon as={FiBriefcase} mr={3} boxSize={5} />
                <Text>
                  <Text as="span" fontWeight="semibold">
                    Position:{" "}
                  </Text>
                  {application.job_position}
                </Text>
              </Flex>
              <Flex align="center">
                <Icon as={FiExternalLink} mr={3} boxSize={5} />
                <Text>
                  <Text as="span" fontWeight="semibold">
                    Apply Link:{" "}
                  </Text>
                  <Link to={application.apply_link} color="blue.500">
                    {application.apply_link}
                  </Link>
                </Text>
              </Flex>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </AdminLayout>
  );
};

export default JobApplicationView;
