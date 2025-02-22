import AdminLayout from "@/admin/Layout";
import CommonTable from "@/common/Table/CommonTable";
import { Column } from "@/utils";
import { InternshipType } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const InternshipSection = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<InternshipType[]>([]);
  const columns: Column<InternshipType>[] = [
    { key: "id", label: "#", visible: true },
    { key: "title", label: "Title", visible: true },
    { key: "description", label: "Description", visible: true },
    { key: "linkTo", label: "Apply Link", visible: true },
  ];

  const handleEdit = (row: InternshipType) => {
    navigate(`/admin/internship/edit/${row.id}`);
  };

  const handleDelete = (row: InternshipType) => {
    console.log("Delete", row.id);
  };

  useEffect(() => {
    setRows([]);
  }, []);

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Internship" },
      ]}
      activeSidebarItem="Internship"
      title={`Internship`}
    >
      <CommonTable
        title="Internship List"
        columns={columns}
        rows={rows}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => navigate("/admin/internship/add")}
        // filterComponent={<SliderFilter />}
        isDraggable
        count={100}
        addName="Add Internship"
      />
    </AdminLayout>
  );
};
export default InternshipSection;
