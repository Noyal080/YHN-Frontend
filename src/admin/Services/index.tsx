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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Services = () => {
  const [selectedRow, setSelectedRow] = useState<ServicesType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<ServicesType[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const { showToast } = useCommonToast();

  const columns: Column<ServicesType>[] = [
    { key: "id", label: "#", visible: true },
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
      render: (row) => <FontAwesomeIcon icon={row.icon} size="2x" />,
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
      await axiosInstance.delete(`/services/${row.id}`);
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
        const res = await axiosInstance.get("/services", {
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
        count={paginationData?.total_pages}
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
