import CommonTable from "@/common/Table/CommonTable";
import AdminLayout from "../../Layout";
import { useEffect, useState } from "react";
import { SliderInput } from "@/utils/types";
import { Column } from "@/utils";
import { Switch } from "@/components/ui/switch";
import { Box, Image, Text } from "@chakra-ui/react";
// import SliderFilter from "./SliderFilter";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import useCommonToast from "@/common/CommonToast";

const SliderSection = () => {
  const { showToast } = useCommonToast();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<SliderInput | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const columns: Column<SliderInput>[] = [
    { key: "id", label: "#", visible: true },
    { key: "title", label: "Title", visible: true },
    {
      key: "sub_title",
      label: "Description",
      visible: false,
      render: (row) => {
        return (
          <Box
            whiteSpace="normal" // Allow text wrapping
            wordBreak="break-word" // Break long words
            maxW={"400px"}
          >
            <Text
              truncate
              dangerouslySetInnerHTML={{ __html: row.sub_title }}
              lineClamp={2}
            />
          </Box>
        );
      },
    },
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
          src={row["image"]}
        />
      ),
    },
    {
      key: "status",
      label: "Status",
      visible: true,
      render: (row) => (
        <Switch
          checked={row.status === 1}
          onCheckedChange={() => handleStatusChange(String(row.id), row.status)}
        />
      ),
    },
    {
      key: "button_title",
      label: "Button Title",
      visible: false,
    },
    {
      key: "button_route",
      label: "Button Route",
      visible: false,
    },
    { key: "priority_order", label: "Priority Order", visible: false },
  ];
  const navigate = useNavigate();

  const [rows, setRows] = useState<SliderInput[]>([]);

  // const token = localStorage.getItem("accessToken");
  // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axiosInstance.get("/sliders/");
        setRows(response.data.data.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSliders();
  }, [triggerFetch]);

  const handleEdit = (row: SliderInput) => {
    navigate(`/admin/sliders/edit/${row.id}`);
  };

  const handleDelete = async (row: SliderInput) => {
    try {
      await axiosInstance.delete(`/sliders/${row.id}`);
      showToast({
        description: `${row.title} deleted succesfully`,
        type: "success",
      });
      setModalOpen(false);
      setLoading(true);
      setTriggerFetch(true);
    } catch (e) {
      console.log(e);
      showToast({
        description: "Error while removing slider data",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: number) => {
    const newStatus = status === 1 ? 0 : 1;
    console.log("clicked");

    try {
      await axiosInstance.post(`/sliders/${id}`, {
        status: newStatus,
      });
      setTriggerFetch(true);
    } catch (error) {
      console.error("Error changing status:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <AdminLayout
      title="Slider Section"
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        {
          label: "Sliders",
        },
      ]}
      activeSidebarItem="Sliders"
    >
      <CommonTable
        loading={loading}
        title="Slider List"
        columns={columns}
        rows={rows}
        onEdit={handleEdit}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => navigate("/admin/sliders/add")}
        // filterComponent={<SliderFilter />}
        isDraggable
        count={100}
        addName="Add Slider"
      />

      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove Slider"}
        onButtonClick={() => handleDelete(selectedRow as SliderInput)}
      >
        <Text>
          {" "}
          Are you sure you want to remove{" "}
          <strong> {selectedRow?.title} </strong> ? This will permanently remove
          all the data regarding the slider{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};
export default SliderSection;
