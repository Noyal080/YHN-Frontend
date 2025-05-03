import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import useCommonToast from "@/common/CommonToast";
import CommonTable from "@/common/Table/CommonTable";
import { Switch } from "@/components/ui/switch";
import useDebounce from "@/helper/debounce";
import { Column } from "@/utils";
import { JobApplicationType, PaginationProps } from "@/utils/types";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const JobApplication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<JobApplicationType[]>([]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<JobApplicationType | null>(
    null
  );
  const [triggerFetch, setTriggerFetch] = useState(false);
  const { showToast } = useCommonToast();

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const columns: Column<JobApplicationType>[] = [
    { key: "id", label: "Id", visible: true },
    { key: "title", label: "Title", visible: true },
    { key: "end_date", label: "Deadline", visible: true },
    // { key: "apply_link", label: "Application Link", visible: true },
    { key: "job_open_position", label: "Open Position", visible: true , render :(row) => <Text> {row.job_open_position.name} </Text>},
    {
      key: "status",
      label: "Status",
      visible: true,
      render: (row) => (
        <Switch
          checked={row.status === 1}
          onCheckedChange={() => handleStatusChange(String(row.id), row.status)}
          colorPalette={"green"}
        />
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    const fetchVolunteerData = async () => {
      try {
        const res = await axiosInstance.get("/JobApplications", {
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

  const handleDelete = async (row: JobApplicationType) => {
    try {
      await axiosInstance.delete(`/JobApplications/${row.id}`);
      showToast({
        description: `${row.title} deleted succesfully`,
        type: "success",
      });
      setModalOpen(false);
      setLoading(true);
      setTriggerFetch((prev) => !prev);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: number) => {
    //Change this
    const newStatus = status === 1 ? 0 : 1;
    try {
      await axiosInstance.patch(`/JobApplications/${id}/status`, {
        status: newStatus,
      });
      setTriggerFetch((prev) => !prev);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Join Us" },
      ]}
      activeSidebarItem="Join Us"
      title={`Join Us`}
    >
      <CommonTable
        title="Job Application List"
        columns={columns}
        rows={rows}
        onView={(row) => navigate(`/admin/join-us/view/${row.id}`)}
        onEdit={(row) => navigate(`/admin/join-us/edit/${row.id}`)}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        loading={loading}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/join-us/add")}
        // filterComponent={<SliderFilter />}
        count={paginationData?.total_records}
        pageSize={paginationData?.per_page}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
        addName="Add Job Application"
      />

      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove Job Application Data"}
        onButtonClick={() => handleDelete(selectedRow as JobApplicationType)}
      >
        <Text>
          {" "}
          Are you sure you want to remove{" "}
          <strong> {selectedRow?.title} </strong> ? This will permanently remove
          all the data regarding the job application{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default JobApplication;
