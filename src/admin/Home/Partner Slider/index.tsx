import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import useCommonToast from "@/common/CommonToast";
import CommonTable from "@/common/Table/CommonTable";
import { Switch } from "@/components/ui/switch";
import useDebounce from "@/helper/debounce";
import { Column } from "@/utils";
import { PaginationProps, PartnerSliderType } from "@/utils/types";
import { Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PartnerSlider = () => {
  const { showToast } = useCommonToast();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<PartnerSliderType | null>(
    null
  );

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const columns: Column<PartnerSliderType>[] = [
    {
      key: "id",
      label: "#",
      visible: true,
    },
    {
      key: "title",
      label: "Partner Name",
      visible: true,
    },
    {
      key: "link",
      label: "Link",
      visible: true,
    },
    {
      key: "image",
      label: "Logo",
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
      render: (row) => {
        return (
          <Switch
            checked={row.status === 1}
            onCheckedChange={() => {
              console.log("clicked");
              handleStatusChange(String(row.id), row.status);
            }}
          />
        );
      },
    },
  ];

  const [rows, setRows] = useState<PartnerSliderType[]>([]);
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);
  // const token = localStorage.getItem("accessToken");
  // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/partner", {
          params: { page, search: debouncedSearch },
        });
        const data = res.data.data;
        setRows(data.data);
        setPaginationData(data.pagination);
        setTriggerFetch(false);
        setLoading(false);
      } catch (e) {
        console.log(e);
        showToast({
          description: "Error while fetching data",
          type: "error",
        });
        setLoading(false);
      }
    };

    fetchPartners();
  }, [triggerFetch, page, debouncedSearch]);

  const navigate = useNavigate();

  const handleEdit = (row: PartnerSliderType) => {
    navigate(`/admin/partners/edit/${row.id}`);
  };

  const handleDelete = async (row: PartnerSliderType) => {
    try {
      await axiosInstance.delete(`/partner/${row.id}`);
      showToast({
        description: `${row.title} deleted succesfully`,
        type: "success",
      });
      setModalOpen(false);
      setTriggerFetch(true);
    } catch (e) {
      console.log(e);
      showToast({
        description: "Error while removing partner data",
        type: "error",
      });
    }
  };

  const handleStatusChange = async (id: string, status: number) => {
    const newStatus = status === 1 ? 0 : 1;
    console.log("clicked");

    try {
      await axiosInstance.post(`/partner/${id}`, {
        status: newStatus,
      });
      console.log(`Partner ${id} status changed to ${newStatus}`);
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
        { label: "Partner Slider" },
      ]}
      title={`Partner Slider`}
      activeSidebarItem="Partner Slider"
    >
      <CommonTable
        title="Partner Slider"
        loading={loading}
        columns={columns}
        rows={rows}
        addName="Add Partner"
        onEdit={handleEdit}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/partners/add")}
        isDraggable={false}
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
        title={"Remove PartnerSlider"}
        onButtonClick={() => handleDelete(selectedRow as PartnerSliderType)}
      >
        <Text>
          {" "}
          Are you sure you want to remove {selectedRow?.title}? This will
          permanently remove all the data regarding the partner{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default PartnerSlider;
