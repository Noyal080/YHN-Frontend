import { Column } from "@/utils";
import AdminLayout from "../Layout";
import { PaginationProps, ServicesType } from "@/utils/types";
import EditorTextView from "@/common/EditorTextView";
import { useEffect, useState } from "react";
import useCommonToast from "@/common/CommonToast";
import useDebounce from "@/helper/debounce";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/api/axios";
import CommonTable from "@/common/Table/CommonTable";
import CommonModal from "@/common/CommonModal";
import { Text } from "@chakra-ui/react";
import { Switch } from "@/components/ui/switch";

const Services = () => {
  const [selectedRow, setSelectedRow] = useState<ServicesType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<ServicesType[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const { showToast } = useCommonToast();

  const columns: Column<ServicesType>[] = [
    { key: "id", label: "Id", visible: true },
    { key: "title", label: "Title", visible: true },
    {
      key: "description",
      label: "Description",
      visible: true,
      render: (row) => <EditorTextView message={row.description} />,
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
        />
      ),
    },
  ];

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const navigate = useNavigate();

  const handleEdit = (row: ServicesType) => {
    navigate(`/admin/services/edit/${row.id}`);
  };

  const handleDelete = async (row: ServicesType) => {
    try {
      await axiosInstance.delete(`/service/${row.id}`);
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
        const res = await axiosInstance.get("/service", {
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
      await axiosInstance.post(`/service/${id}`, {
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
        { label: "Services" },
      ]}
      title={`Our Services`}
      activeSidebarItem="Services"
    >
      <CommonTable
        title="Service List"
        columns={columns}
        rows={rows}
        onEdit={handleEdit}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        loading={loading}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/services/add")}
        // filterComponent={<SliderFilter />}
        count={paginationData?.total_records}
        pageSize={paginationData?.per_page}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
        addName="Add Services"
      />
      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove Event Data"}
        onButtonClick={() => handleDelete(selectedRow as ServicesType)}
      >
        <Text>
          {" "}
          Are you sure you want to remove{" "}
          <strong> {selectedRow?.title} </strong> ? This will permanently remove
          all the data regarding the services{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default Services;
