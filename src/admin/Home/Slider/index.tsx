import CommonTable from "@/common/CommonTable";
import AdminLayout from "../../Layout";
import { useState } from "react";
import { SliderType } from "@/utils/types";
import { Column } from "@/utils";

const SliderSection = () => {
  const columns: Column<{
    id: number;
    priorityOrder: number;
    "content.image": string;
    text: string;
  }>[] = [
    { key: "id", label: "#" },
    { key: "priorityOrder", label: "Priority Order" },
    { key: "content.image", label: "Image" },
    { key: "text", label: "Text" },
  ];

  const [rows, setRows] = useState<SliderType[]>([
    {
      id: 1,
      priorityOrder: 1,
      content: { image: "image_url_1" },
      text: "Sample Text 1",
    },
    {
      id: 2,
      priorityOrder: 2,
      content: { image: "image_url_2" },
      text: "Sample Text 2",
    },
    {
      id: 3,
      priorityOrder: 3,
      content: { image: "image_url_3" },
      text: "Sample Text 3",
    },
    {
      id: 4,
      priorityOrder: 4,
      content: { image: "image_url_4" },
      text: "Sample Text 4",
    },
    {
      id: 5,
      priorityOrder: 5,
      content: { image: "image_url_5" },
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
