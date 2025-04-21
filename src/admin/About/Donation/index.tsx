import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import EditorTextView from "@/common/EditorTextView";
import CommonTable from "@/common/Table/CommonTable";
import useDebounce from "@/helper/debounce";
import { Column } from "@/utils";
import { DonationsType, PaginationProps } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Donations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<DonationsType[]>([]);

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const navigate = useNavigate();

  const columns: Column<DonationsType>[] = [
    { key: "id", label: "Id", visible: true },
    { key: "donorName", label: "Donor Name", visible: true },
    {
      key: "email",
      label: "Email",
      visible: true,
      render: (row) => <EditorTextView message={row.email} />,
    },
    {
      key: "contributionType",
      label: "Contribution Type",
      visible: true,
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    const fetchDonation = async () => {
      try {
        const res = await axiosInstance.get("/donationform", {
          params: { page, search: debouncedSearch },
        });
        const data = res.data.data;
        setRows(data.data);
        setPaginationData(data.pagination);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    };

    fetchDonation();
  }, [page, debouncedSearch]);

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Donation" },
      ]}
      title={`Donation`}
      activeSidebarItem="Donation"
    >
      <CommonTable
        title="Donation List"
        columns={columns}
        rows={rows}
        loading={isLoading}
        onSearch={(query) => setSearchQuery(query)}
        // filterComponent={<SliderFilter />}
        onView={(row) => {
          navigate(`/admin/donation/${row.id}`);
        }}
        count={paginationData?.total_records}
        pageSize={paginationData?.per_page}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
      />
    </AdminLayout>
  );
};

export default Donations;
