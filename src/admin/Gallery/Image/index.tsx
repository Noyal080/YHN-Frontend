import AdminLayout from "@/admin/Layout";
import CommonTable from "@/common/Table/CommonTable";
import { Column } from "@/utils";
import { ImageInputTypes } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageSlider from "./ImageSllider";
import { axiosInstance } from "@/api/axios";
import { Switch } from "@/components/ui/switch";

const ImageSection = () => {
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axiosInstance.get("/gallery/");
        setRows(res.data.data);
        // setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    fetchGallery();
  }, []);

  const handleDelete = () => {
    console.log("Delete");
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
        columns={columns}
        rows={rows}
        addName="Add Images"
        onEdit={(row) => navigate(`/admin/gallery/images/edit/${row.id}`)}
        onDelete={handleDelete}
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => navigate("/admin/gallery/images/add")}
      />
    </AdminLayout>
  );
};

export default ImageSection;
