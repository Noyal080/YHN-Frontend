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

const BodSection = () => {
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
    { key: "priority_order", label: "Priority Order", visible: true },
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
    {
      key: "status",
      label: "Show/Hide",
      visible: true,
      render: (row) => (
        <Switch
          colorPalette={"green"}
          checked={row.status.toString() === "1"}
          onCheckedChange={() => {
            handleStatusChange(String(row.id), row.status);
          }}
        />
      ),
    },
  ];

  const handleEdit = (row: TeamsData) => {
    navigate(`/admin/bod/edit/${row.id}`);
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
      setTriggerFetch((prev) => !prev);
    } catch (e) {
      console.log(e);
      // showToast({
      //   description: "Error while removing team data",
      //   type: "error",
      // });
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
          params: { page, name: debouncedSearch, role: "BOD" },
        });
        const data = res.data.data;
        setRows(data.data);
        setPaginationData(data.pagination);
        setLoading(false);
        setTriggerFetch(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    fetchTeams();
  }, [triggerFetch, page, debouncedSearch]);

  const handleStatusChange = async (id: string, status: string) => {
    const newStatus = status === "1" ? "0" : "1";
    try {
      await axiosInstance.patch(`/teams/${id}/status`, {
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
        { label: "Board of Directors" },
      ]}
      title={`Board of Directors`}
      activeSidebarItem="Board of Directors"
    >
      <CommonTable
        loading={loading}
        title="BOD List"
        columns={columns}
        rows={rows}
        onEdit={handleEdit}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/bod/add")}
        addName="Add BOD"
        count={paginationData?.total_records}
        pageSize={paginationData?.per_page}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
      />

      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove BOD"}
        onButtonClick={() => handleDelete(selectedRow as TeamsData)}
      >
        <Text>
          {" "}
          Are you sure you want to remove <strong>
            {" "}
            {selectedRow?.name}{" "}
          </strong>{" "}
          ? This will permanently remove all the data regarding this BOD member{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default BodSection;
