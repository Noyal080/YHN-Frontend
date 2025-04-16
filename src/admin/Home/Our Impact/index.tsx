import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import useCommonToast from "@/common/CommonToast";
import CommonTable from "@/common/Table/CommonTable";
import { Switch } from "@/components/ui/switch";
import useDebounce from "@/helper/debounce";
import { Column } from "@/utils";
import { OurImpactType, PaginationProps } from "@/utils/types";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OurImpact = () => {
  const [selectedRow, setSelectedRow] = useState<OurImpactType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<OurImpactType[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const { showToast } = useCommonToast();
  const navigate = useNavigate();

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const columns: Column<OurImpactType>[] = [
    {
      key: "id",
      label: "Id",
      visible: true,
    },
    {
      key: "name",
      label: "Impact Name",
      visible: true,
    },
    {
      key: "number",
      label: "Impact Number",
      visible: true,
    },
    {
      key: "icon",
      label: "Icon",
      visible: true,
    },
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

  const handleDelete = async (row: OurImpactType) => {
    try {
      await axiosInstance.delete(`/ourimpact/${row.id}`);
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
        description: "Error while removing message request data",
        type: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchVolunteerData = async () => {
      try {
        const res = await axiosInstance.get("/ourimpact", {
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

  const handleStatusChange = async (id: string, status: number) => {
    const newStatus = status === 1 ? 0 : 1;
    try {
      await axiosInstance.post(`/ourimpact/${id}`, {
        status: newStatus,
      });
      setTriggerFetch(true);
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Our Impact" },
      ]}
      title={`Our Impact`}
      activeSidebarItem="Our Impact"
    >
      <CommonTable
        title="Our Impact"
        columns={columns}
        rows={rows}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        onEdit={(row) => navigate(`/admin/our-impact/edit/${row.id}`)}
        addName="Add Impact"
        // onView={(row) => navigate(`/admin/messages/view/${row.id}`)}
        onAdd={() => navigate("/admin/our-impact/add")}
        loading={loading}
        onSearch={(query) => setSearchQuery(query)}
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
        title={"Remove Message Request Data"}
        onButtonClick={() => handleDelete(selectedRow as OurImpactType)}
      >
        <Text>
          {" "}
          Are you sure you want to remove <strong>
            {" "}
            {selectedRow?.name}{" "}
          </strong>{" "}
          ? This will permanently remove all the data regarding the impact.
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default OurImpact;
