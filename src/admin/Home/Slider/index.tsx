import CommonTable from "@/common/Table/CommonTable";
import AdminLayout from "../../Layout";
import { useState } from "react";
import { SliderType } from "@/utils/types";
import { Column } from "@/utils";
import { Switch } from "@/components/ui/switch";
import { Image } from "@chakra-ui/react";
// import SliderFilter from "./SliderFilter";
import { useNavigate } from "react-router-dom";

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
    { key: "priorityOrder", label: "Priority Order", visible: true },
    {
      key: "content.image",
      label: "Image",
      visible: false,
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
  ];
  const navigate = useNavigate();

  const [rows, setRows] = useState<SliderType[]>([
    {
      id: 1,
      title: "ABCD",
      priorityOrder: 1,
      content: {
        image: "https://placehold.co/600x400",
        text: "Sample Text 1",
      },
      status: true,
    },
    {
      id: 2,
      title: "ABCD",
      priorityOrder: 2,
      content: {
        image: "https://placehold.co/300x200",
        text: "Sample Text 2",
      },
      status: false,
    },
    {
      id: 3,
      title: "ABCD",
      priorityOrder: 3,
      content: { image: "https://placehold.co/600x400", text: "Sample Text 3" },
      status: false,
    },
    {
      id: 4,
      title: "ABCD",
      priorityOrder: 4,
      content: {
        image: "https://placehold.co/600x400/000000/FFF",
        text: "Sample Text 4",
      },
      status: true,
    },

    {
      id: 5,
      title: "ABCD",
      priorityOrder: 5,
      content: {
        image: "https://placehold.co/600x400/png",
        text: "Sample Text 5",
      },
      status: true,
    },
  ]);

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
