import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import useCommonToast from "@/common/CommonToast";
import CommonTable from "@/common/Table/CommonTable";
import { Switch } from "@/components/ui/switch";
import { Column } from "@/utils";
import { PartnerSliderType } from "@/utils/types";
import { Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PartnerSlider = () => {
  const { showToast } = useCommonToast();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<PartnerSliderType | null>(
    null
  );
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
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        const res = await axiosInstance.get("/partner");
        setRows(res.data.data);
        setTriggerFetch(false);
      } catch (e) {
        console.log(e);
        showToast({
          description: "Error while fetching data",
          type: "error",
        });
      }
    };

    fetchPartners();
  }, [token, triggerFetch]);

  const navigate = useNavigate();

  const handleEdit = (row: PartnerSliderType) => {
    navigate(`/admin/partners/edit/${row.id}`);
  };

  const handleDelete = async (row: PartnerSliderType) => {
    try {
      await axiosInstance.delete(`/partner/${row.id}`);
      showToast({
        description: `${row.title} deleted succesfully`,
        type: "success",
      });
      setModalOpen(false);
      setTriggerFetch(true);
    } catch (e) {
      console.log(e);
      showToast({
        description: "Error while removing partner data",
        type: "error",
      });
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
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => navigate("/admin/partners/add")}
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
      />

      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove PartnerSlider"}
        onButtonClick={() => handleDelete(selectedRow as PartnerSliderType)}
      >
        <Text>
          {" "}
          Are you sure you want to remove {selectedRow?.title}? This will
          permanently remove all the data regarding the partner{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default PartnerSlider;
