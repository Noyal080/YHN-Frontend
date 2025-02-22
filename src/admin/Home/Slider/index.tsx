import CommonTable from "@/common/Table/CommonTable";
import AdminLayout from "../../Layout";
import { useEffect, useState } from "react";
import { SliderInput } from "@/utils/types";
import { Column } from "@/utils";
import { Switch } from "@/components/ui/switch";
import { Image } from "@chakra-ui/react";
// import SliderFilter from "./SliderFilter";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/api/axios";

const SliderSection = () => {
  const columns: Column<{
    id?: number;
    title: string;
    sub_title: string;
    priority_order: number;
    image: string;
    status: boolean;
    button_title?: string;
    button_route?: string;
  }>[] = [
    { key: "id", label: "#", visible: true },
    { key: "title", label: "Title", visible: true },
    { key: "sub_title", label: "Description", visible: false },
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
      key: "status",
      label: "Status",
      visible: true,
      render: (row) => (
        <Switch
          checked={row.status}
          onCheckedChange={() => console.log(`${row.id} checked`)}
        />
      ),
    },
    {
      key: "button_title",
      label: "Button Title",
      visible: false,
    },
    {
      key: "button_route",
      label: "Button Route",
      visible: false,
    },
    { key: "priority_order", label: "Priority Order", visible: false },
  ];
  const navigate = useNavigate();

  const [rows, setRows] = useState<SliderInput[]>([]);

  const token = localStorage.getItem("accessToken");
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axiosInstance.get("/sliders");
        setRows(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSliders();
  }, [token]);

  const handleEdit = (row: SliderInput) => {
    navigate(`/admin/slider/edit/${row.id}`);
  };

  const handleDelete = (row: SliderInput) => {
    if (window.confirm(`Delete slider with ID: ${row.id}?`)) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  return (
    <AdminLayout
      title="Slider Section"
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        {
          label: "Slider",
        },
      ]}
      activeSidebarItem="Slider"
    >
      <CommonTable
        title="Slider List"
        columns={columns}
        rows={rows}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => navigate("/admin/slider/add")}
        // filterComponent={<SliderFilter />}
        isDraggable
        count={100}
        addName="Add Slider"
      />
    </AdminLayout>
  );
};
export default SliderSection;
