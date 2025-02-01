import CommonTable from "@/common/Table/CommonTable";
import AdminLayout from "../Layout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Column } from "@/utils";
import { ServiceInput } from "@/utils/types";

const Services = () => {
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const navigate = useNavigate();

  const columns: Column<{
    id?: number;
    title: string;
    description: string;
  }>[] = [
    {
      key: "id",
      label: "#",
      visible: true,
    },
    {
      key: "title",
      label: "Title",
      visible: true,
    },
    {
      key: "description",
      label: "Description",
      visible: false,
    },
  ];
  const [rows, setRows] = useState<ServiceInput[]>([]);

  useEffect(() => {
    setRows([
      {
        id: 1,
        title: "Service 1",
        description: "Service 1 Description",
      },
      {
        id: 2,
        title: "Service 2",
        description: "Service 2 Description",
      },
      {
        id: 3,
        title: "Service 3",
        description: "Service 3 Description",
      },
    ]);
  }, []);

  const handleEdit = (row: ServiceInput) => {
    navigate(`/admin/services/edit/${row.id}`);
  };

  const handleDelete = (row: ServiceInput) => {
    console.log("Delete", row);
  };
  return (
    <AdminLayout
      title="Service Section"
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        {
          label: "Service",
        },
      ]}
      activeSidebarItem="Services"
    >
      <CommonTable
        title="Service List"
        columns={columns}
        rows={rows}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => navigate("/admin/services/add")}
        // filterComponent={<SliderFilter />}
        isDraggable
        count={100}
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
        addName="Add Services"
      />
    </AdminLayout>
  );
};

export default Services;
