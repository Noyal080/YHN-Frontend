import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import CommonTable from "@/common/Table/CommonTable";
import { Switch } from "@/components/ui/switch";
import useDebounce from "@/helper/debounce";
import { Column } from "@/utils";
import { FellowInternDataType, PaginationProps } from "@/utils/types";
import { Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Fellows = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<FellowInternDataType | null>(
    null
  );
  const [triggerFetch, setTriggerFetch] = useState(false);

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [rows, setRows] = useState<FellowInternDataType[]>([]);

  const columns: Column<FellowInternDataType>[] = [
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
          src={row["image"]}
        />
      ),
    },
    {
      key: "joined_date",
      label: "Joined Date",
      visible: true,
      render: (row) => row.joined_date ?? "N/A",
    },
    {
      key: "completion_date",
      label: "Completion Date",
      visible: true,
      render: (row) => row.completion_date ?? "N/A",
    },
    {
      key: "status",
      label: "Status",
      visible: true,
      render: (row) => (
        <Switch
          colorPalette={"green"}
          checked={row.status === 1}
          // onCheckedChange={() => {
          //   handleStatusChange(String(row.id), row.status);
          // }}
        />
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/fellows", {
          params: { page, name: debouncedSearch, role: "BOD" },
        });
        const data = res.data.data;
        setRows(data.data);
        setPaginationData(data.pagination);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    fetchData();
  }, [triggerFetch, page, debouncedSearch]);

  const handleDelete = async (rows: FellowInternDataType) => {
    console.log(rows);
    setTriggerFetch((prev) => !prev);
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Fellows" },
      ]}
      title={`Fellows`}
      activeSidebarItem="Fellows"
    >
      <CommonTable
        loading={loading}
        title="Fellow List"
        columns={columns}
        rows={rows}
        onEdit={(row) => navigate(`/fellow/edit/${row.id}`)}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/fellow/add")}
        addName="Add Fellow"
        count={paginationData?.total_records}
        pageSize={paginationData?.per_page}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
      />

      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove BOD"}
        onButtonClick={() => handleDelete(selectedRow as FellowInternDataType)}
      >
        <Text>
          {" "}
          Are you sure you want to remove <strong>
            {" "}
            {selectedRow?.name}{" "}
          </strong>{" "}
          ? This will permanently remove all the data regarding the fellow{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default Fellows;
