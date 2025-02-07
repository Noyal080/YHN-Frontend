import CommonTable from "@/common/Table/CommonTable";
import AdminLayout from "../../Layout";
import { useEffect, useState } from "react";
import { SliderType } from "@/utils/types";
import { Column } from "@/utils";
import { Switch } from "@/components/ui/switch";
import { Image } from "@chakra-ui/react";
// import SliderFilter from "./SliderFilter";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/api/axios";

const SliderSection = () => {
  const columns: Column<{
    id: number;
    title: string;
    priorityOrder: number;
    "content.image": string;
    status: boolean;
    "content.text": string;
    "content.button"?: {
      label: string;
      link: string;
    };
  }>[] = [
    { key: "id", label: "#", visible: true },
    { key: "title", label: "Title", visible: true },
    {
      key: "content.image",
      label: "Image",
      visible: true,
      render: (row) => (
        <Image
          rounded="md"
          h="200px"
          w="300px"
          fit="contain"
          src={row["content.image"]}
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
    { key: "content.text", label: "Text", visible: true },
    {
      key: "content.button",
      label: "Button",
      visible: false,
      render: (row) =>
        row["content.button"] ? (
          <>
            <span>{row["content.button"].label}</span>
          </>
        ) : (
          "No Button"
        ),
    },
    { key: "priorityOrder", label: "Priority Order", visible: false },
  ];
  const navigate = useNavigate();

  const [rows, setRows] = useState<SliderType[]>([]);

  const token = localStorage.getItem("accessToken");
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axiosInstance.get("/slider");
        setRows(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSliders();
  }, [token]);

  const [entriesPerPage, setEntriesPerPage] = useState("10");

  const handleEdit = (row: SliderType) => {
    navigate(`/admin/slider/edit/${row.id}`);
  };

  const handleDelete = (row: SliderType) => {
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
        rows={rows.map((row) => ({
          ...row,
          "content.image": row.content.image,
          "content.text": row.content.text,
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => navigate("/admin/slider/add")}
        // filterComponent={<SliderFilter />}
        isDraggable
        count={100}
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
        addName="Add Slider"
      />
    </AdminLayout>
  );
};
export default SliderSection;
