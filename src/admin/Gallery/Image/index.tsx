import AdminLayout from "@/admin/Layout";
import CommonTable from "@/common/Table/CommonTable";
import { Column } from "@/utils";
import { ImageInputTypes } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageSlider from "./ImageSllider";
import { axiosInstance } from "@/api/axios";
import { Switch } from "@/components/ui/switch";
import useCommonToast from "@/common/CommonToast";
import CommonModal from "@/common/CommonModal";
import { Text } from "@chakra-ui/react";

const ImageSection = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ImageInputTypes | null>(null);
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);
  const { showToast } = useCommonToast();

  const columns: Column<ImageInputTypes>[] = [
    {
      key: "id",
      label: "#",
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
          onCheckedChange={() => console.log(row.id)}
        />
      ),
    },
  ];

  const [rows, setRows] = useState<ImageInputTypes[]>([]);
  const token = localStorage.getItem("accessToken");
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);

      try {
        const res = await axiosInstance.get("/gallery");
        setRows(res.data.data);
        setTriggerFetch(false);
        setLoading(false);
        // setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    fetchGallery();
  }, [triggerFetch]);

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
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => navigate("/admin/gallery/images/add")}
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
          permanently remove all the data regarding the gallery{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default ImageSection;
