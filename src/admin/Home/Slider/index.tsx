import CommonTable from "@/common/Table/CommonTable";
import AdminLayout from "../../Layout";
import { useState } from "react";
import { SliderType } from "@/utils/types";
import { Column } from "@/utils";
import { Switch } from "@/components/ui/switch";
import { Image } from "@chakra-ui/react";

const SliderSection = () => {
  const columns: Column<{
    id: number;
    priorityOrder: number;
    "content.image": string;
    status: boolean;
    text: string;
  }>[] = [
    { key: "id", label: "#" },
    { key: "priorityOrder", label: "Priority Order" },
    {
      key: "content.image",
      label: "Image",
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
      render: (row) => <Switch checked={row.status || false} />,
    },
    { key: "text", label: "Text" },
  ];

  const [rows, setRows] = useState<SliderType[]>([
    {
      id: 1,
      priorityOrder: 1,
      content: {
        image: "https://placehold.co/600x400",
      },
      status: true,
      text: "Sample Text 1",
    },
    {
      id: 2,
      priorityOrder: 2,
      content: {
        image: "https://placehold.co/300x200",
      },
      status: false,
      text: "Sample Text 2",
    },
    {
      id: 3,
      priorityOrder: 3,
      content: { image: "https://placehold.co/600x400" },
      status: false,
      text: "Sample Text 3",
    },
    {
      id: 4,
      priorityOrder: 4,
      content: { image: "https://placehold.co/600x400/000000/FFF" },
      status: true,
      text: "Sample Text 4",
    },

    {
      id: 5,
      priorityOrder: 5,
      content: { image: "https://placehold.co/600x400/png" },
      status: true,
      text: "Sample Text 5",
    },
  ]);

  const [entriesPerPage, setEntriesPerPage] = useState("10");

  const handleEdit = (row: SliderType) => {
    alert(`Edit row with ID: ${row.id}`);
  };

  const handleDelete = (row: SliderType) => {
    if (window.confirm(`Delete slider with ID: ${row.id}?`)) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  return (
    <AdminLayout
      title="Slider Section"
      breadcrumbItems={[]}
      activeSidebarItem="Slider"
    >
      <CommonTable
        title="User List"
        columns={columns}
        rows={rows.map((row) => ({
          ...row,
          "content.image": row.content.image,
        }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => console.log("Add")}
        filterComponent={<div>Custom Filter Component</div>}
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
