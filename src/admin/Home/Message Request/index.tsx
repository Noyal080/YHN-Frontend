import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import useCommonToast from "@/common/CommonToast";
import CommonTable from "@/common/Table/CommonTable";
import useDebounce from "@/helper/debounce";
import { Column } from "@/utils";
import { MessageRequestType, PaginationProps } from "@/utils/types";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MessageContent from "./MessageComponent";

const MessageRequest = () => {
  const [selectedRow, setSelectedRow] = useState<MessageRequestType | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<MessageRequestType[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const { showToast } = useCommonToast();

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const columns: Column<MessageRequestType>[] = [
    {
      key: "id",
      label: "Id",
      visible: true,
    },
    {
      key: "name",
      label: "Full Name",
      visible: true,
    },
    {
      key: "email",
      label: "Email",
      visible: true,
    },
    {
      key: "phone",
      label: "Phone Number",
      visible: false,
    },
    {
      key: "address",
      label: "Address",
      visible: true,
    },
    {
      key: "message",
      label: "Message",
      visible: true,
      render: (row) => <MessageContent message={row.message} />,
    },
  ];

  const handleDelete = async (row: MessageRequestType) => {
    try {
      await axiosInstance.delete(`/messagerequests/${row.id}`);
      showToast({
        description: `${row.name} deleted succesfully`,
        type: "success",
      });
      setModalOpen(false);
      setLoading(true);
      setTriggerFetch(true);
    } catch (e) {
      console.log(e);
      showToast({
        description: "Error while removing message request data",
        type: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchVolunteerData = async () => {
      try {
        const res = await axiosInstance.get("/messagerequests", {
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
        { label: "Messages" },
      ]}
      title={`Messages`}
      activeSidebarItem="Messages"
    >
      <CommonTable
        title="Messages"
        columns={columns}
        rows={rows}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        // onView={(row) => navigate(`/admin/messages/view/${row.id}`)}
        loading={loading}
        onSearch={(query) => setSearchQuery(query)}
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
        title={"Remove Message Request Data"}
        onButtonClick={() => handleDelete(selectedRow as MessageRequestType)}
      >
        <Text>
          {" "}
          Are you sure you want to remove <strong>
            {" "}
            {selectedRow?.name}{" "}
          </strong>{" "}
          ? This will permanently remove all the data regarding the message.
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default MessageRequest;
