import { Column } from "@/utils";
import AdminLayout from "../Layout";
import { OurWorks, PaginationProps } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonTable from "@/common/Table/CommonTable";
import useDebounce from "@/helper/debounce";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import CommonModal from "@/common/CommonModal";
import { Text } from "@chakra-ui/react";

const ProjectSection = () => {
  const navigate = useNavigate();
  const columns: Column<OurWorks>[] = [
    { key: "id", label: "#", visible: true },
    { key: "title", label: "Title", visible: true },
    { key: "description", label: "Description", visible: false },
    { key: "sector", label: "Sector", visible: true },
    { key: "banner_image", label: "Banner", visible: true },
    { key: "banner_date", label: "Date", visible: false },
    { key: "banner_location_country", label: "Country", visible: false },
    {
      key: "banner_location_stateorprovince",
      label: "Province",
      visible: false,
    },
    { key: "banner_location_cityordistrict", label: "City", visible: false },
    { key: "gallery", label: "Gallery", visible: false },
    { key: "objectives", label: "Objective", visible: false },
    { key: "activities", label: "Activities", visible: false },
  ];
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<OurWorks[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<OurWorks | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const { showToast } = useCommonToast();

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const handleEdit = (row: OurWorks) => {
    navigate(`/admin/our-works/edit/${row.id}`);
  };

  const handleDelete = async (row: OurWorks) => {
    try {
      await axiosInstance.delete(`/ourwork/${row.id}`);
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
        description: "Error while removing events data",
        type: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchWorkData = async () => {
      try {
        const res = await axiosInstance.get("/ourwork/", {
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

    fetchWorkData();
  }, [triggerFetch, page, debouncedSearch]);

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
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        loading={loading}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/our-works/add")}
        // filterComponent={<SliderFilter />}
        count={paginationData?.total_pages}
        pageSize={paginationData?.per_page}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
        isDraggable={false}
        addName="Add Works"
      />

      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove Event Data"}
        onButtonClick={() => handleDelete(selectedRow as OurWorks)}
      >
        <Text>
          {" "}
          Are you sure you want to remove{" "}
          <strong> {selectedRow?.title} </strong> ? This will permanently remove
          all the data regarding the work{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default ProjectSection;
