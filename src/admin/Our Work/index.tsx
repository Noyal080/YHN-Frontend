import { Column } from "@/utils";
import AdminLayout from "../Layout";
import { OurWorks, PaginationProps } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonTable from "@/common/Table/CommonTable";
import useDebounce from "@/helper/debounce";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import CommonModal from "@/common/CommonModal";
import { Image, Text } from "@chakra-ui/react";
import { Switch } from "@/components/ui/switch";

const ProjectSection = () => {
  const navigate = useNavigate();
  const columns: Column<OurWorks>[] = [
    { key: "id", label: "Id", visible: true },
    { key: "title", label: "Title", visible: true },
    {
      key: "service",
      label: "Sector",
      visible: true,
      render: (row) => <Text> {row.service?.title ?? "N/A"} </Text>,
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
          src={
            typeof row["banner_image"] === "string"
              ? row["banner_image"]
              : URL.createObjectURL(row["banner_image"])
          }
        />
      ),
    },
    {
      key: "status",
      label: "Status",
      visible: true,
      render: (row) => {
        return (
          <Switch
            checked={row.status === 1}
            onCheckedChange={() =>
              handleStatusChange(String(row.id), row.status)
            }
            colorPalette={"green"}
          />
        );
      },
    },
  ];
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<OurWorks[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<OurWorks | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const { showToast } = useCommonToast();

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const handleEdit = (row: OurWorks) => {
    navigate(`/admin/our-works/edit/${row.id}`);
  };

  const handleDelete = async (row: OurWorks) => {
    try {
      await axiosInstance.delete(`/ourwork/${row.id}`);
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
    const fetchWorkData = async () => {
      try {
        const res = await axiosInstance.get("/ourwork/", {
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

    fetchWorkData();
  }, [triggerFetch, page, debouncedSearch]);

  const handleStatusChange = async (id: string, status: number) => {
    const newStatus = status === 1 ? 0 : 1;
    try {
      await axiosInstance.patch(`/ourwork/${id}/status`, {
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
        { label: "Our Works" },
      ]}
      title={`Our Works`}
      activeSidebarItem="Our Works"
    >
      <CommonTable
        title="Work List"
        columns={columns}
        rows={rows}
        onView={(row) => {
          navigate(`/admin/our-works/view/${row.id}`);
        }}
        onEdit={handleEdit}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        loading={loading}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/our-works/add")}
        // filterComponent={<SliderFilter />}
        count={paginationData?.total_records}
        pageSize={paginationData?.per_page}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
        addName="Add Works"
      />

      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove Work Data"}
        onButtonClick={() => handleDelete(selectedRow as OurWorks)}
      >
        <Text>
          {" "}
          Are you sure you want to remove{" "}
          <strong> {selectedRow?.title} </strong> ? This will permanently remove
          all the data regarding the work{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default ProjectSection;
