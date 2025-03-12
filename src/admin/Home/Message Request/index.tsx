import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import useCommonToast from "@/common/CommonToast";
import CommonTable from "@/common/Table/CommonTable";
import useDebounce from "@/helper/debounce";
import { Column } from "@/utils";
import { MessageRequestType, PaginationProps } from "@/utils/types";
import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const MessageRequest = () => {
  const [selectedRow, setSelectedRow] = useState<MessageRequestType | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<MessageRequestType[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const { showToast } = useCommonToast();
  const [expandedMessages, setExpandedMessages] = useState<number[]>([]);

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const toggleMessage = (id: number) => {
    setExpandedMessages((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );
  };

  const columns: Column<MessageRequestType>[] = [
    {
      key: "id",
      label: "#",
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
      render: (row) => (
        <Box width="300px">
          <div
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: expandedMessages.includes(row.id) ? "none" : 2,
              cursor: "pointer",
            }}
            onClick={() => toggleMessage(row.id)}
          >
            {row.message}
          </div>
          {row.message.length > 100 && (
            <div
              onClick={() => toggleMessage(row.id)}
              style={{
                color: "teal",
                cursor: "pointer",
                marginTop: "8px",
                fontWeight: "bold",
              }}
            >
              {expandedMessages.includes(row.id) ? "Show Less" : "Show More"}
            </div>
          )}
        </Box>
      ),
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
        setRows([
          {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "123-456-7890",
            address: "123 Main St, City, Country",
            message:
              "This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "987-654-3210",
            address: "456 Elm St, City, Country",
            message:
              "Another long message that can be expanded. This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.This is a long message that can be expanded.",
          },
        ]);
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
        { label: "Message Request" },
      ]}
      title={`Message Request`}
      activeSidebarItem="Message Request"
    >
      <CommonTable
        title="Message Requests"
        columns={columns}
        rows={rows}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        // onView={(row) => navigate(`/admin/messages/view/${row.id}`)}
        loading={loading}
        onSearch={(query) => setSearchQuery(query)}
        isDraggable={false}
        count={paginationData?.total_pages}
        pageSize={paginationData?.per_page}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
      />

      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove Volunteer Data"}
        onButtonClick={() => handleDelete(selectedRow as MessageRequestType)}
      >
        <Text>
          {" "}
          Are you sure you want to remove <strong>
            {" "}
            {selectedRow?.name}{" "}
          </strong>{" "}
          ? This will permanently remove all the data regarding the volunteer{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default MessageRequest;
