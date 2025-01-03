import CommonTable from "@/common/CommonTable";
import AdminLayout from "../Layout";
import { useState } from "react";

const SliderSection = () => {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
  ];

  const [rows, setRows] = useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ]);

  const [entriesPerPage, setEntriesPerPage] = useState("10");

  const handleEdit = (row: any) => {
    alert(`Edit row with ID: ${row.id}`);
  };

  const handleDelete = (row: any) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete row with ID: ${row.id}?`
    );
    if (confirmed) {
      setRows(rows.filter((r) => r.id !== row.id));
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
        rows={rows}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => console.log("Add")}
        filterComponent={<div>Custom Filter Component</div>}
        isDraggable
        count={100}
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
      />
    </AdminLayout>
  );
};
export default SliderSection;
