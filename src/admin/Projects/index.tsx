import { Column } from "@/utils";
import AdminLayout from "../Layout";
import { OurWorkType } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonTable from "@/common/Table/CommonTable";

const ProjectSection = () => {
  const navigate = useNavigate();
  const columns: Column<OurWorkType>[] = [
    { key: "id", label: "#", visible: true },
    { key: "title", label: "Title", visible: true },
    { key: "description", label: "Description", visible: false },
    { key: "sector", label: "Sector", visible: true },
    { key: "banner_image", label: "Banner", visible: true },
    { key: "date", label: "Date", visible: false },
    { key: "location", label: "Location", visible: false },
    { key: "gallery", label: "Gallery", visible: false },
    { key: "objective", label: "Objective", visible: false },
    { key: "activities", label: "Activities", visible: false },
  ];
  const [rows, setRows] = useState<OurWorkType[]>([]);
  const handleEdit = (row: OurWorkType) => {
    navigate(`/admin/internship/edit/${row.id}`);
  };

  const handleDelete = (row: OurWorkType) => {
    console.log("Delete", row.id);
  };

  useEffect(() => {
    setRows([]);
  }, []);
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Our Works" },
      ]}
      title={`Our Works`}
      activeSidebarItem="Our Works"
    >
      <CommonTable
        title="Work List"
        columns={columns}
        rows={rows}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => navigate("/admin/our-works/add")}
        // filterComponent={<SliderFilter />}
        isDraggable
        count={100}
        addName="Add Works"
      />
    </AdminLayout>
  );
};

export default ProjectSection;
