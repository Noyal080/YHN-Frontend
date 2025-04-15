import { axiosInstance } from "@/api/axios";
import EventDetails from "@/common/ViewEventandWork";
import AdminLayout from "../Layout";
import { ViewWorkandEventType } from "@/utils/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Skeleton } from "@/components/ui/skeleton";

const ViewEvents = () => {
  //Change the view
  const { id } = useParams();
  const [pageData, setPageData] = useState<ViewWorkandEventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/events/${id}`);
        const result = res.data.data;
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
        { label: "Events", link: "/admin/events" },
        { label: `View Events` },
      ]}
      title={`View Events`}
      activeSidebarItem="Events"
    >
      {isLoading ? (
        <Box>
          <Skeleton height="400px" mb={4} />
          <Skeleton height="30px" width="60%" mb={2} />
          <Skeleton height="20px" width="40%" mb={6} />
          <Skeleton height="200px" />
        </Box>
      ) : (
        pageData && <EventDetails event={pageData} />
      )}
    </AdminLayout>
  );
};

export default ViewEvents;
