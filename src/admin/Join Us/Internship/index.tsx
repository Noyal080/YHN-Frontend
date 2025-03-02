import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import useCommonToast from "@/common/CommonToast";
import CommonTable from "@/common/Table/CommonTable";
import { Column } from "@/utils";
import { InternshipType } from "@/utils/types";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const InternshipSection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<InternshipType[]>([]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<InternshipType | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const { showToast } = useCommonToast();
  const columns: Column<InternshipType>[] = [
    { key: "id", label: "#", visible: true },
    { key: "title", label: "Title", visible: true },
    { key: "description", label: "Description", visible: true },
    { key: "apply_link", label: "Apply Link", visible: true },
  ];

  const handleEdit = (row: InternshipType) => {
    navigate(`/admin/internship/edit/${row.id}`);
  };

  const handleDelete = async (row: InternshipType) => {
    try {
      await axiosInstance.delete(`/internships/${row.id}`);
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
        description: "Error while removing internship data",
        type: "error",
      });
      setLoading(false);
    }
  };
  // const token = localStorage.getItem("accessToken");
  // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    setLoading(true);
    const fetchIntershipData = async () => {
      try {
        const res = await axiosInstance.get("/internships");
        setRows(res.data.data);
        setLoading(false);
        setTriggerFetch(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
        setTriggerFetch(false);
      }
    };

    fetchIntershipData();
  }, [triggerFetch]);

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
        loading={loading}
        title="Internship List"
        columns={columns}
        rows={rows}
        onEdit={handleEdit}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        onSearch={(query) => console.log("Search", query)}
        onAdd={() => navigate("/admin/internship/add")}
        // filterComponent={<SliderFilter />}
        isDraggable
        count={100}
        addName="Add Internship"
      />

      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove Internship Data"}
        onButtonClick={() => handleDelete(selectedRow as InternshipType)}
      >
        <Text>
          {" "}
          Are you sure you want to remove{" "}
          <strong> {selectedRow?.title} </strong> ? This will permanently remove
          all the data regarding the internship{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};
export default InternshipSection;
