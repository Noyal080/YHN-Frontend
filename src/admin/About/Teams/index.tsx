import { useNavigate } from "react-router-dom";
import AdminLayout from "../../Layout";
import CommonTable from "@/common/Table/CommonTable";
import { useEffect, useState } from "react";
import { Column } from "@/utils";
import { Switch } from "@/components/ui/switch";
import { Image } from "@chakra-ui/react";
import { TeamsInput } from "@/utils/types";
import { axiosInstance } from "@/api/axios";

const TeamSection = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const columns: Column<{
    id?: number;
    name: string;
    image: string | File;
    position: string;
    role: string;
    status: number;
  }>[] = [
    { key: "id", label: "#", visible: true },
    { key: "name", label: "Name", visible: true },
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
          src={
            typeof row["image"] === "string"
              ? row["image"]
              : URL.createObjectURL(row["image"])
          }
        />
      ),
    },
    { key: "position", label: "Position", visible: true },
    { key: "role", label: "Role", visible: true },
    {
      key: "status",
      label: "Status",
      visible: true,
      render: (row) => (
        <Switch
          checked={row.status === 1}
          onCheckedChange={() => console.log(`${row.id} checked`)}
        />
      ),
    },
  ];

  const handleEdit = (row: TeamsInput) => {
    navigate(`/admin/teams/edit/${row.id}`);
  };

  const handleDelete = (row: TeamsInput) => {
    console.log("Delete", row.id);
  };

  const [rows, setRows] = useState<TeamsInput[]>([]);
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axiosInstance.get("/teams");
        setRows(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchTeams();
  }, [token]);

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Our Team" },
      ]}
      title={`Our Team`}
      activeSidebarItem="Our Team"
    >
      <CommonTable
        title="Teams List"
        columns={columns}
        rows={rows}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => navigate("/admin/teams/add")}
        // filterComponent={<SliderFilter />}
        isDraggable
        count={100}
        addName="Add Teams"
      />
    </AdminLayout>
  );
};

export default TeamSection;
