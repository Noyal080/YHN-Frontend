import AdminLayout from "@/admin/Layout";
import CommonTable from "@/common/Table/CommonTable";
import { Column } from "@/utils";
import { ImageInputTypes } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageSlider from "./ImageSllider";

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
      label: "title",
      visible: true,
    },
    {
      key: "image",
      label: "Image",
      visible: true,
      render: (row) => <ImageSlider images={row.image} />,
    },
  ];

  const [rows, setRows] = useState<ImageInputTypes[]>([]);
  useEffect(() => {
    setRows([
      {
        id: 1,
        title: "Opening Ceremony",
        image: [
          {
            id: 1,
            imageUrl: "https://placehold.jp/300x300.png",
          },
          {
            id: 2,
            imageUrl: "https://imageplaceholder.net/600x400",
          },
          {
            id: 3,
            imageUrl: "https://placehold.jp/400x400.png",
          },
          {
            id: 4,
            imageUrl: "https://placehold.jp/800x800.png",
          },
        ],
        status: 1,
      },
    ]);
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
        title="Testimonials"
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
