import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import CommonTable from "@/common/Table/CommonTable";
import { Switch } from "@/components/ui/switch";
import { Column } from "@/utils";
import { PartnerSliderType } from "@/utils/types";
import { Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PartnerSlider = () => {
  const { showToast } = useCommonToast();
  const columns: Column<{
    id?: number;
    title: string;
    image: string;
    status: number;
  }>[] = [
    {
      key: "id",
      label: "#",
      visible: true,
    },
    {
      key: "title",
      label: "Partner Name",
      visible: true,
    },
    {
      key: "image",
      label: "Logo",
      visible: true,
      render: (row) => (
        <Image
          rounded="md"
          h="200px"
          w="300px"
          fit="contain"
          src={row["image"]}
        />
      ),
    },
    {
      key: "status",
      label: "Status",
      visible: true,
      render: (row) => {
        return (
          <Switch
            checked={row.status === 1}
            onCheckedChange={() => console.log(`${row.id}`)}
          />
        );
      },
    },
  ];
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [rows, setRows] = useState<PartnerSliderType[]>([]);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        const res = await axiosInstance.get("/partner");
        setRows(res.data.data);
      } catch (e) {
        console.log(e);
        showToast({
          description: "Error while fetching data",
          type: "error",
        });
      }
    };

    fetchPartners();
  }, [token]);

  const navigate = useNavigate();

  const handleEdit = (row: PartnerSliderType) => {
    navigate(`/admin/partners/edit/${row.id}`);
  };

  const handleDelete = async (row: PartnerSliderType) => {
    try {
      await axiosInstance.delete(`/partner/${row.id}`);
      showToast({
        description: "Deleted Succesfully",
        type: "success",
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Partner Slider" },
      ]}
      title={`Partner Slider`}
      activeSidebarItem="Partner Slider"
    >
      <CommonTable
        title="Partner Slider"
        columns={columns}
        rows={rows}
        addName="Add Partner"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => navigate("/admin/partners/add")}
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
      />
    </AdminLayout>
  );
};

export default PartnerSlider;
