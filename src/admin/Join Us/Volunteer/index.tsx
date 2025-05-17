import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import useCommonToast from "@/common/CommonToast";
import CommonTable from "@/common/Table/CommonTable";
import { Switch } from "@/components/ui/switch";
import useDebounce from "@/helper/debounce";
import { Column } from "@/utils";
import { InternshipType, PaginationProps } from "@/utils/types";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VolunteerSection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<InternshipType[]>([]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<InternshipType | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const { showToast } = useCommonToast();

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const columns: Column<InternshipType>[] = [
    { key: "title", label: "Title", visible: true },
    { key: "end_date", label: "Deadline", visible: true },
    { key: "apply_link", label: "Application Link", visible: true },
    {
      key: "status",
      label: "Show/Hide",
      visible: true,
      render: (row) => (
        <Switch
          checked={row.status.toString() === "1"}
          onCheckedChange={() => handleStatusChange(String(row.id), row.status)}
          colorPalette={"green"}
        />
      ),
    },
  ];

  const handleEdit = (row: InternshipType) => {
    navigate(`/admin/volunteer/edit/${row.id}`);
  };

  const handleDelete = async (row: InternshipType) => {
    try {
      await axiosInstance.delete(`/volunteers/${row.id}`);
      showToast({
        description: `${row.title} deleted succesfully`,
        type: "success",
      });
      setModalOpen(false);
      setLoading(true);
      setTriggerFetch((prev) => !prev);
    } catch (e) {
      console.log(e);
      // showToast({
      //   description: "Error while removing internship data",
      //   type: "error",
      // });
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchVolunteerData = async () => {
      try {
        const res = await axiosInstance.get("/volunteers", {
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
    //Change this
    const newStatus = status === "1" ? "0" : "1";
    try {
      await axiosInstance.patch(`/volunteers/${id}/status`, {
        status: newStatus,
      });
      setTriggerFetch((prev) => !prev);
    } catch (error) {
      console.error(error);

      // let errorMessage = "Failed to update volunteer status";
      // if (axios.isAxiosError(error)) {
      //   // Try to get the error message from response data first
      //   errorMessage = error.response?.data?.message;
      // } else if (error instanceof Error) {
      //   errorMessage = error.message;
      // }
      // showToast({
      //   description: errorMessage,
      //   type: "error",
      // });
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Volunteer" },
      ]}
      activeSidebarItem="Volunteer"
      title={`Volunteer`}
    >
      <CommonTable
        title="Volunteer List"
        columns={columns}
        rows={rows}
        onView={(row) => navigate(`/admin/volunteer/view/${row.id}`)}
        onEdit={handleEdit}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        loading={loading}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/volunteer/add")}
        // filterComponent={<SliderFilter />}
        count={paginationData?.total_records}
        pageSize={paginationData?.per_page}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
        addName="Add Volunteer Details"
      />

      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove Volunteer Data"}
        onButtonClick={() => handleDelete(selectedRow as InternshipType)}
      >
        <Text>
          {" "}
          Are you sure you want to remove{" "}
          <strong> {selectedRow?.title} </strong> ? This will permanently remove
          all the data regarding the volunteer{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};
export default VolunteerSection;
