import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { DonationsType } from "@/utils/types";
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DonationView = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [donationData, setDonationData] = useState<DonationsType>();

  useEffect(() => {
    setIsLoading(true);
    const fetchDonation = async () => {
      try {
        const res = await axiosInstance.get(`/donationform/${id}`);
        const data = res.data.data;
        setDonationData(data.data);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    };
    if (id) {
      fetchDonation();
    }
  }, [id]);

  const donationFields = [
    { key: "donorName", label: "Donor Name" },
    { key: "contactNumber", label: "Contact Number" },
    { key: "email", label: "Email" },
    { key: "description", label: "Description" },
    { key: "country", label: "Country" },
    { key: "contributionType", label: "Contribution Type" },
    { key: "contributionAmount", label: "Contribution Amount" },
  ];

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Donation", link: "/admin/donation" },
        { label: "Donation View" },
      ]}
      title={`Donation View`}
      activeSidebarItem="Donation"
    >
      <Box bg="teal.600" px={6} py={4}>
        <Heading size="lg" color="white">
          Donation Details
        </Heading>
      </Box>
      <Box bg="white" p={6} rounded="md" shadow="sm">
        {isLoading ? (
          <Box>
            {[...Array(7)].map((_, i) => (
              <Flex key={i} mb={4}>
                <Skeleton width="150px" height="20px" mr={4} />
                <SkeletonText flex={1} noOfLines={1} />
              </Flex>
            ))}
          </Box>
        ) : (
          donationData && (
            <VStack align="stretch" gap={4}>
              {donationFields.map((field) => (
                <Flex key={field.key}>
                  <Box width="350px" fontWeight="medium">
                    <Text>{field.label}</Text>
                  </Box>
                  <Box flex={1}>
                    {field.key === "contributionAmount"
                      ? `${donationData[field.key as keyof DonationsType]}`
                      : donationData[field.key as keyof DonationsType] || "-"}
                  </Box>
                </Flex>
              ))}
            </VStack>
          )
        )}
      </Box>
    </AdminLayout>
  );
};

export default DonationView;
