import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import useCommonToast from "@/common/CommonToast";
import CommonTable from "@/common/Table/CommonTable";
import useDebounce from "@/helper/debounce";
import { Column } from "@/utils";
import { InternshipType, PaginationProps } from "@/utils/types";
import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VolunteerSection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<InternshipType[]>([]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<InternshipType | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const { showToast } = useCommonToast();

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const columns: Column<InternshipType>[] = [
    { key: "id", label: "#", visible: true },
    { key: "title", label: "Title", visible: true },
    {
      key: "description",
      label: "Description",
      visible: true,
      render: (row) => {
        return (
          <Box
            whiteSpace="normal" // Allow text wrapping
            wordBreak="break-word" // Break long words
            maxW={"400px"}
          >
            <Text
              truncate
              dangerouslySetInnerHTML={{ __html: row.description }}
              lineClamp={2}
            />
          </Box>
        );
      },
    },
    { key: "apply_link", label: "Apply Link", visible: true },
  ];

  const handleEdit = (row: InternshipType) => {
    navigate(`/admin/volunteer/edit/${row.id}`);
  };

  const handleDelete = async (row: InternshipType) => {
    try {
      await axiosInstance.delete(`/volunteers/${row.id}`);
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

  useEffect(() => {
    setLoading(true);
    const fetchVolunteerData = async () => {
      try {
        const res = await axiosInstance.get("/volunteers", {
          params: { page, search: debouncedSearch },
        });
        const data = res.data.data;
        setRows(data.data);
        setPaginationData(data.pagination);
        setLoading(false);
        setTriggerFetch(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
        setTriggerFetch(false);
      }
    };

    fetchVolunteerData();
  }, [triggerFetch, page, debouncedSearch]);

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Volunteer" },
      ]}
      activeSidebarItem="Volunteer"
      title={`Volunteer`}
    >
      <CommonTable
        title="Volunteer List"
        columns={columns}
        rows={rows}
        onEdit={handleEdit}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        loading={loading}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/volunteer/add")}
        // filterComponent={<SliderFilter />}
        isDraggable
        count={paginationData?.total_pages}
        pageSize={paginationData?.per_page}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
        addName="Add Volunteer Details"
      />

      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove Volunteer Data"}
        onButtonClick={() => handleDelete(selectedRow as InternshipType)}
      >
        <Text>
          {" "}
          Are you sure you want to remove{" "}
          <strong> {selectedRow?.title} </strong> ? This will permanently remove
          all the data regarding the volunteer{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};
export default VolunteerSection;
