import { useNavigate } from "react-router-dom";
import AdminLayout from "../Layout";
import { Column } from "@/utils";
import { EventType, PaginationProps } from "@/utils/types";
import { useEffect, useState } from "react";
import CommonTable from "@/common/Table/CommonTable";
import useDebounce from "@/helper/debounce";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import { Box, Image, Text } from "@chakra-ui/react";
import useCommonToast from "@/common/CommonToast";
import { Switch } from "@/components/ui/switch";
import ImageSlider from "../Gallery/Image/ImageSllider";

const EventSection = () => {
  const [selectedRow, setSelectedRow] = useState<EventType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<EventType[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const { showToast } = useCommonToast();

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const navigate = useNavigate();

  const columns: Column<EventType>[] = [
    { key: "id", label: "#", visible: true },
    { key: "title", label: "Title", visible: true },
    {
      key: "description",
      label: "Description",
      visible: false,
      render: (row) => {
        return (
          <Box
            whiteSpace="normal" // Allow text wrapping
            wordBreak="break-word" // Break long words
            maxW={"400px"}
          >
            <Text
              truncate
              dangerouslySetInnerHTML={{ __html: row.description }}
              lineClamp={2}
            />
          </Box>
        );
      },
    },
    {
      key: "banner_image",
      label: "Banner",
      visible: true,
      render: (row) => (
        <Image
          rounded="md"
          h="200px"
          w="300px"
          fit="contain"
          src={row["banner_image"]}
        />
      ),
    },
    { key: "banner_date", label: "Date", visible: false },
    { key: "banner_location_country", label: "Country", visible: false },
    {
      key: "banner_location_stateorprovince",
      label: "Province",
      visible: false,
    },
    { key: "banner_location_cityordistrict", label: "City", visible: false },
    {
      key: "gallery",
      label: "Gallery",
      visible: false,
      render: (row) => <ImageSlider images={row.gallery.gallery_images} />,
    },
    {
      key: "status",
      label: "Status",
      visible: true,
      render: (row) => {
        return <Switch checked={row.status === 1} />;
      },
    },
  ];

  const handleEdit = (row: EventType) => {
    navigate(`/admin/events/edit/${row.id}`);
  };

  const handleDelete = async (row: EventType) => {
    try {
      await axiosInstance.delete(`/newsandevents/${row.id}`);
      showToast({
        description: `${row.title} deleted succesfully`,
        type: "success",
      });
      setModalOpen(false);
      setLoading(true);
      setTriggerFetch(true);
    } catch (e) {
      console.log(e);
      showToast({
        description: "Error while removing events data",
        type: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchVolunteerData = async () => {
      try {
        const res = await axiosInstance.get("/newsandevents", {
          params: { page, search: debouncedSearch },
        });
        const data = res.data.data;
        setRows(data.data);
        setPaginationData(data.pagination);
        setLoading(false);
        setTriggerFetch(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
        setTriggerFetch(false);
      }
    };

    fetchVolunteerData();
  }, [triggerFetch, page, debouncedSearch]);

  useEffect(() => {
    setRows([]);
  }, []);

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "News & Events" },
      ]}
      title={`News & Events Section`}
      activeSidebarItem="News & Events"
    >
      <CommonTable
        title="Event List"
        columns={columns}
        rows={rows}
        onEdit={handleEdit}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        loading={loading}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/events/add")}
        // filterComponent={<SliderFilter />}
        isDraggable
        count={paginationData?.total_pages}
        pageSize={paginationData?.per_page}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
        addName="Add Events"
      />

      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove Event Data"}
        onButtonClick={() => handleDelete(selectedRow as EventType)}
      >
        <Text>
          {" "}
          Are you sure you want to remove{" "}
          <strong> {selectedRow?.title} </strong> ? This will permanently remove
          all the data regarding the news and events{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default EventSection;
