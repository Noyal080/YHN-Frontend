import AdminLayout from "@/admin/Layout";
import CommonTable from "@/common/Table/CommonTable";
import { Column } from "@/utils";
import { ImageInputTypes, PaginationProps } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import { axiosInstance } from "@/api/axios";
import { Switch } from "@/components/ui/switch";
import useCommonToast from "@/common/CommonToast";
import CommonModal from "@/common/CommonModal";
import { Text } from "@chakra-ui/react";
import useDebounce from "@/helper/debounce";

const ImageSection = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ImageInputTypes | null>(null);
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);
  const { showToast } = useCommonToast();

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const columns: Column<ImageInputTypes>[] = [
    {
      key: "id",
      label: "Id",
      visible: true,
    },
    {
      key: "title",
      label: "Title",
      visible: true,
    },
    {
      key: "images",
      label: "Images",
      visible: true,
      render: (row) => <ImageSlider images={row.images} />,
    },
    {
      key: "status",
      label: "Status",
      visible: true,
      render: (row) => (
        <Switch
          checked={row.status === 1}
          onCheckedChange={() => {
            handleStatusChange(String(row.id), row.status, row.title);
          }}
          colorPalette={"green"}
        />
      ),
    },
  ];

  const [rows, setRows] = useState<ImageInputTypes[]>([]);
  // const token = localStorage.getItem("accessToken");
  // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);

      try {
        const res = await axiosInstance.get("/gallery", {
          params: { page, search: debouncedSearch },
        });
        const resData = res.data.data;

        setRows(resData.data);
        setPaginationData(resData.pagination);

        setTriggerFetch(false);
        setLoading(false);
        // setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    fetchGallery();
  }, [triggerFetch, debouncedSearch, page]);

  const handleDelete = async (row: ImageInputTypes) => {
    try {
      await axiosInstance.delete(`/gallery/${row.id}`);
      showToast({
        description: `${row.title} deleted succesfully`,
        type: "success",
      });
      setModalOpen(false);
      setTriggerFetch(true);
    } catch (e) {
      console.log(e);
      showToast({
        description: "Error while removing gallery data",
        type: "error",
      });
    }
  };

  const handleStatusChange = async (
    id: string,
    status: number,
    title: string
  ) => {
    const newStatus = status === 1 ? 0 : 1;
    try {
      await axiosInstance.patch(`/gallery/${id}/update-title-status/`, {
        title,
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
        { label: "Image" },
      ]}
      title={`Image Section`}
      activeSidebarItem="Image"
    >
      <CommonTable
        title="Gallery Images"
        loading={loading}
        columns={columns}
        rows={rows}
        addName="Add Images"
        onView={(row) => navigate(`/admin/gallery/images/view/${row.id}`)}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/gallery/images/add")}
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
        title={"Remove Gallery Image"}
        onButtonClick={() => handleDelete(selectedRow as ImageInputTypes)}
      >
        <Text>
          {" "}
          Are you sure you want to remove {selectedRow?.title}? This will
          permanently remove all the data regarding the gallery images.{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default ImageSection;
