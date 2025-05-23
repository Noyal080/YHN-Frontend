import { useNavigate } from "react-router-dom";
import AdminLayout from "../Layout";
import { Column } from "@/utils";
import { EventType, PaginationProps } from "@/utils/types";
import { useEffect, useState } from "react";
import CommonTable from "@/common/Table/CommonTable";
import useDebounce from "@/helper/debounce";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import { Image, Text } from "@chakra-ui/react";
import useCommonToast from "@/common/CommonToast";
import { Switch } from "@/components/ui/switch";
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
    { key: "title", label: "Title", visible: true },
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
    { key: "banner_start_date", label: "Start Date", visible: false },
    { key: "banner_end_date", label: "End Date", visible: false },

    {
      key: "status",
      label: "Show/Hide",
      visible: true,
      render: (row) => {
        return (
          <Switch
            checked={row.status.toString() === "1"}
            onCheckedChange={() =>
              handleStatusChange(String(row.id), row.status)
            }
            colorPalette={"green"}
          />
        );
      },
    },
  ];

  const handleEdit = (row: EventType) => {
    navigate(`/admin/events/edit/${row.id}`);
  };

  const handleDelete = async (row: EventType) => {
    try {
      await axiosInstance.delete(`/events/${row.id}`);
      showToast({
        description: `${row.title} deleted succesfully`,
        type: "success",
      });
      setModalOpen(false);
      setLoading(true);
      setTriggerFetch(true);
    } catch (e) {
      console.log(e);
      // showToast({
      //   description: "Error while removing events data",
      //   type: "error",
      // });
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchVolunteerData = async () => {
      try {
        const res = await axiosInstance.get("/events", {
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

  const handleStatusChange = async (id: string, status: string) => {
    const newStatus = status === "1" ? "0" : "1";
    try {
      await axiosInstance.patch(`/events/${id}/status`, {
        status: newStatus,
      });
      setTriggerFetch((prev) => !prev);
    } catch (error) {
      console.error("Error changing status:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Events" },
      ]}
      title={`Events Section`}
      activeSidebarItem="Events"
    >
      <CommonTable
        title="Event List"
        columns={columns}
        rows={rows}
        onView={(row) => navigate(`/admin/events/view/${row.id}`)}
        onEdit={handleEdit}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        loading={loading}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/events/add")}
        // filterComponent={<SliderFilter />}
        count={paginationData?.total_records}
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
          all the data regarding the events{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default EventSection;
