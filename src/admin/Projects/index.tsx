import { Column } from "@/utils";
import AdminLayout from "../Layout";
import { OurWorkType, PaginationProps } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonTable from "@/common/Table/CommonTable";
import useDebounce from "@/helper/debounce";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<OurWorkType[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<OurWorkType | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const { showToast } = useCommonToast();

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const handleEdit = (row: OurWorkType) => {
    navigate(`/admin/internship/edit/${row.id}`);
  };

  const handleDelete = (row: OurWorkType) => {
    console.log("Delete", row.id);
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
