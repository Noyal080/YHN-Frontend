import CommonTable from "@/common/Table/CommonTable";
import AdminLayout from "../../Layout";
import { useEffect, useState } from "react";
import { PaginationProps, SliderInput } from "@/utils/types";
import { Column } from "@/utils";
import { Switch } from "@/components/ui/switch";
import { Box, Image, Text } from "@chakra-ui/react";
// import SliderFilter from "./SliderFilter";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import useCommonToast from "@/common/CommonToast";
import useDebounce from "@/helper/debounce";

const SliderSection = () => {
  const { showToast } = useCommonToast();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<SliderInput | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false);

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const columns: Column<SliderInput>[] = [
    { key: "id", label: "#", visible: true },
    { key: "title", label: "Title", visible: true },
    {
      key: "sub_title",
      label: "Sub Title",
      visible: false,
      render: (row) => {
        return (
          <Box
            whiteSpace="normal" // Allow text wrapping
            wordBreak="break-word" // Break long words
            maxW={"400px"}
          >
            <Text
              truncate
              dangerouslySetInnerHTML={{ __html: row.sub_title }}
              lineClamp={2}
            />
          </Box>
        );
      },
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
          src={
            typeof row["image"] === "string"
              ? row["image"]
              : URL.createObjectURL(row["image"])
          }
        />
      ),
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
    // { key: "priority_order", label: "Priority Order", visible: false },
  ];
  const navigate = useNavigate();

  const [rows, setRows] = useState<SliderInput[]>([]);

  // const token = localStorage.getItem("accessToken");
  // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await axiosInstance.get("/sliders/", {
          params: { page, search: debouncedSearch },
        });
        const data = res.data.data;
        setRows(data.data);
        setPaginationData(data.pagination);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchSliders();
  }, [triggerFetch, page, debouncedSearch]);

  const handleEdit = (row: SliderInput) => {
    navigate(`/admin/sliders/edit/${row.id}`);
  };

  const handleDelete = async (row: SliderInput) => {
    try {
      await axiosInstance.delete(`/sliders/${row.id}`);
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
        description: "Error while removing slider data",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: number) => {
    const newStatus = status === 1 ? 0 : 1;
    try {
      await axiosInstance.post(`/sliders/${id}`, {
        status: newStatus,
      });
      setTriggerFetch(true);
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  return (
    <AdminLayout
      title="Slider Section"
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        {
          label: "Sliders",
        },
      ]}
      activeSidebarItem="Sliders"
    >
      <CommonTable
        loading={loading}
        title="Slider List"
        columns={columns}
        rows={rows}
        onEdit={handleEdit}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/sliders/add")}
        // filterComponent={<SliderFilter />}
        count={paginationData?.total_records}
        pageSize={paginationData?.per_page}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
        addName="Add Slider"
      />

      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove Slider"}
        onButtonClick={() => handleDelete(selectedRow as SliderInput)}
      >
        <Text>
          {" "}
          Are you sure you want to remove{" "}
          <strong> {selectedRow?.title} </strong> ? This will permanently remove
          all the data regarding the slider{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};
export default SliderSection;
