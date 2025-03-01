import CommonTable from "@/common/Table/CommonTable";
import { Column } from "@/utils";
import { TestimonialInput } from "@/utils/types";
import { Image } from "@chakra-ui/react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/admin/Layout";

const Testimonial = () => {
  const columns: Column<TestimonialInput>[] = [
    {
      key: "id",
      label: "#",
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
      label: "User Desgination",
      visible: true,
    },
    {
      key: "usercategory",
      label: "User Category",
      visible: true,
    },
    {
      key: "status",
      label: "Status",
      visible: true,
      render: (row) => {
        return (
          <Switch
            checked={row.status}
            onCheckedChange={() => console.log(`${row.id}`)}
          />
        );
      },
    },
  ];

  const [rows, setRows] = useState<TestimonialInput[]>([
    {
      id: 1,
      status: true,
      image: "",
      name: "Radha",
      description: "This is it",
      designation: "Nepali Teacher Primary Level",
      usercategory: "Jyoti Academy",
    },
  ]);

  const navigate = useNavigate();

  const handleEdit = (row: TestimonialInput) => {
    navigate(`/admin/testimonials/edit/${row.id}`);
  };

  const handleDelete = (row: TestimonialInput) => {
    if (window.confirm(`Delete slider with ID: ${row.id}?`)) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
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
        title="Testimonials"
        columns={columns}
        rows={rows}
        addName="Add Testimonials"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => navigate("/admin/testimonials/add")}
      />
    </AdminLayout>
  );
};

export default Testimonial;
