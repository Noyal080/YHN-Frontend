import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Layout";
import CommonTable from "@/common/Table/CommonTable";
import { useEffect, useState } from "react";
import { Column } from "@/utils";
import { Switch } from "@/components/ui/switch";
import { Image, Text } from "@chakra-ui/react";
import { PaginationProps, TeamsData } from "@/utils/types";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import useCommonToast from "@/common/CommonToast";
import useDebounce from "@/helper/debounce";

const TeamSection = () => {
  const navigate = useNavigate();
  // const token = localStorage.getItem("accessToken");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<TeamsData | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const { showToast } = useCommonToast();

  //Pagination
  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const columns: Column<TeamsData>[] = [
    { key: "id", label: "#", visible: true },
    { key: "name", label: "Name", visible: true },
    {
      key: "image_url",
      label: "Image",
      visible: true,
      render: (row) => (
        <Image
          rounded="md"
          h="200px"
          w="300px"
          fit="contain"
          src={row["image_url"]}
        />
      ),
    },
    {
      key: "position",
      label: "Position",
      visible: true,
      render: (row) => <Text>{row.position.Name}</Text>,
    },
    { key: "role", label: "Role", visible: true },
    {
      key: "status",
      label: "Status",
      visible: true,
      render: (row) => (
        <Switch
          checked={row.status === 1}
          onCheckedChange={() => {
            handleStatusChange(String(row.id), row.status);
          }}
        />
      ),
    },
  ];

  const handleEdit = (row: TeamsData) => {
    navigate(`/admin/teams/edit/${row.id}`);
  };

  const handleDelete = async (row: TeamsData) => {
    try {
      await axiosInstance.delete(`/teams/${row.id}`);
      showToast({
        description: `${row.name} deleted succesfully`,
        type: "success",
      });
      setModalOpen(false);
      setLoading(true);
      setTriggerFetch(true);
    } catch (e) {
      console.log(e);
      showToast({
        description: "Error while removing team data",
        type: "error",
      });
      setLoading(false);
    }
  };

  const [rows, setRows] = useState<TeamsData[]>([]);
  // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/teams", {
          params: { page, search: debouncedSearch },
        });
        const data = res.data.data;
        setRows(data.data);
        setPaginationData(data.pagination);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    fetchTeams();
  }, [triggerFetch, page, debouncedSearch]);

  const handleStatusChange = async (id: string, status: number) => {
    const newStatus = status === 1 ? 0 : 1;
    try {
      await axiosInstance.post(`/teams/${id}`, {
        status: newStatus,
      });
      setTriggerFetch(true);
    } catch (error) {
      console.error("Error changing status:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Our Team" },
      ]}
      title={`Our Team`}
      activeSidebarItem="Our Team"
    >
      <CommonTable
        loading={loading}
        title="Teams List"
        columns={columns}
        rows={rows}
        onEdit={handleEdit}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/teams/add")}
        // filterComponent={<SliderFilter />}
        isDraggable
        addName="Add Teams"
        count={paginationData?.total_pages}
        pageSize={paginationData?.per_page}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
      />

      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove Team"}
        onButtonClick={() => handleDelete(selectedRow as TeamsData)}
      >
        <Text>
          {" "}
          Are you sure you want to remove <strong>
            {" "}
            {selectedRow?.name}{" "}
          </strong>{" "}
          ? This will permanently remove all the data regarding the team{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default TeamSection;
