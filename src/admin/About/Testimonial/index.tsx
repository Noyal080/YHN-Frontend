import CommonTable from "@/common/Table/CommonTable";
import { Column } from "@/utils";
import { PaginationProps, TestimonialData } from "@/utils/types";
import { Image, Text } from "@chakra-ui/react";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import useDebounce from "@/helper/debounce";
import CommonModal from "@/common/CommonModal";
import useCommonToast from "@/common/CommonToast";
import EditorTextView from "@/common/EditorTextView";

const Testimonial = () => {
  const columns: Column<TestimonialData>[] = [
    {
      key: "id",
      label: "Id",
      visible: true,
    },
    {
      key: "name",
      label: "Name",
      visible: true,
    },
    {
      key: "description",
      label: "Description",
      visible: false,
      render: (row) => <EditorTextView message={row.description} />,
    },
    {
      key: "image",
      label: "Image",
      visible: true,
      render: (row) => (
        <Image
          rounded="md"
          h="200px"
          w="300px"
          fit="contain"
          src={row["image"]}
        />
      ),
    },
    {
      key: "designation",
      label: "Desgination",
      visible: true,
      render: (row) => <Text>{row.designation.Name}</Text>,
    },
    {
      key: "status",
      label: "Status",
      visible: true,
      render: (row) => (
        <Switch
          colorPalette={"green"}
          checked={row.status === 1}
          onCheckedChange={() => {
            handleStatusChange(String(row.id), row.status);
          }}
        />
      ),
    },
  ];
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<TestimonialData | null>(null);
  const [rows, setRows] = useState<TestimonialData[]>([]);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useCommonToast();

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const handleEdit = (row: TestimonialData) => {
    navigate(`/admin/testimonials/edit/${row.id}`);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/testimonials", {
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

  const handleDelete = async (row: TestimonialData) => {
    try {
      await axiosInstance.delete(`/testimonials/${row.id}`);
      showToast({
        description: `${row.name}'s testimonial deleted succesfully`,
        type: "success",
      });
      setModalOpen(false);
      setLoading(true);
      setTriggerFetch(true);
    } catch (e) {
      console.log(e);
      showToast({
        description: "Error while removing testimonial",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: number) => {
    const newStatus = status === 1 ? 0 : 1;
    try {
      await axiosInstance.patch(`/testimonials/${id}/status`, {
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
        { label: "Testimonials" },
      ]}
      title={`Testimonials`}
      activeSidebarItem="Testimonial"
    >
      <CommonTable
        loading={loading}
        title="Testimonials"
        columns={columns}
        rows={rows}
        addName="Add Testimonials"
        onEdit={handleEdit}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/testimonials/add")}
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
        title={"Remove Testimonial"}
        onButtonClick={() => handleDelete(selectedRow as TestimonialData)}
      >
        <Text>
          {" "}
          Are you sure you want to remove <strong>
            {" "}
            {selectedRow?.name}{" "}
          </strong>{" "}
          ? This will permanently remove all the data regarding the testimonial{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default Testimonial;
