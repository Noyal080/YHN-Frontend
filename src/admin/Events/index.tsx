import { useNavigate } from "react-router-dom";
import AdminLayout from "../Layout";
import { Column } from "@/utils";
import { EventType } from "@/utils/types";
import { useEffect, useState } from "react";
import CommonTable from "@/common/Table/CommonTable";

const EventSection = () => {
  const navigate = useNavigate();
  const columns: Column<EventType>[] = [
    { key: "id", label: "#", visible: true },
    { key: "title", label: "Title", visible: true },
    { key: "description", label: "Description", visible: false },
    { key: "banner_image", label: "Banner", visible: true },
    { key: "date", label: "Date", visible: false },
    { key: "location", label: "Location", visible: false },
    { key: "gallery", label: "Gallery", visible: false },
  ];
  const [rows, setRows] = useState<EventType[]>([]);
  const handleEdit = (row: EventType) => {
    navigate(`/admin/events/edit/${row.id}`);
  };

  const handleDelete = (row: EventType) => {
    console.log("Delete", row.id);
  };

  useEffect(() => {
    setRows([]);
  }, []);

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Events" },
      ]}
      title={`Events Section`}
      activeSidebarItem="Events"
    >
      <CommonTable
        title="Event List"
        columns={columns}
        rows={rows}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => navigate("/admin/events/add")}
        // filterComponent={<SliderFilter />}
        isDraggable
        count={100}
        addName="Add Events"
      />
    </AdminLayout>
  );
};

export default EventSection;
