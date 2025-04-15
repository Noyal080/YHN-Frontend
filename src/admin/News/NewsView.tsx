import { axiosInstance } from "@/api/axios";
import AdminLayout from "../Layout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Heading, Image, Text } from "@chakra-ui/react";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsType } from "@/utils/types";

const ViewNews = () => {
  const { id } = useParams();
  const [pageData, setPageData] = useState<NewsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/news/${id}`);
        const result = res.data.data.news;
        setPageData(result);
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
        { label: "News", link: "/admin/news" },
        { label: `View News` },
      ]}
      title={`View News`}
      activeSidebarItem="News"
    >
      {isLoading ? (
        <Box>
          <Skeleton height="400px" mb={4} />
          <Skeleton height="30px" width="60%" mb={2} />
          <Skeleton height="20px" width="40%" mb={6} />
          <Skeleton height="200px" />
        </Box>
      ) : (
        pageData && (
          <>
            <Box
              position="relative"
              width="full"
              height={{ base: "250px", md: "400px" }}
              overflow="hidden"
              borderRadius="lg"
            >
              <Image
                src={pageData.image}
                alt={pageData.title}
                objectFit="cover"
                width="full"
                height="full"
              />
              {/* Event Date and Location Inside Image */}
              <Box
                position="absolute"
                bottom={0}
                left={0}
                bg="white"
                color="black"
                px={3}
                py={1}
              >
                <Text fontSize="lg">📅 {pageData.publish_date}</Text>
              </Box>
            </Box>
            <Box textAlign="left" mt={6}>
              <Heading as="h2" size="2xl" fontWeight="bold">
                {pageData.title}
              </Heading>
              <div
                dangerouslySetInnerHTML={{
                  __html: pageData.description,
                }}
              />
            </Box>
          </>
        )
      )}
    </AdminLayout>
  );
};

export default ViewNews;
