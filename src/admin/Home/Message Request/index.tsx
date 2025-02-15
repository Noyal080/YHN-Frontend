import AdminLayout from "@/admin/Layout";
import CommonTable from "@/common/Table/CommonTable";
import { Column } from "@/utils";
import { MessageRequestType } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MessageRequest = () => {
  const [selectedRow, setSelectedRow] = useState<MessageRequestType | null>(
    null
  );
  const navigate = useNavigate();
  const columns: Column<MessageRequestType>[] = [
    {
      key: "id",
      label: "#",
      visible: true,
    },
    {
      key: "full_name",
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
      visible: false,
    },
  ];
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [rows, setRows] = useState<MessageRequestType[]>([]);

  useEffect(() => {
    setRows([
      {
        id: 1,
        full_name: "John Doe",
        email: "johndoe@example.com",
        phone: 1234567890,
        address: "123 Main St, New York, NY",
        message: "I am interested in your services.",
      },
      {
        id: 2,
        full_name: "Jane Smith",
        email: "janesmith@example.com",
        phone: 9876543210,
        address: "456 Elm St, Los Angeles, CA",
        message: "Please provide more details about your offer.",
      },
    ]);
  }, []);

  console.log(selectedRow);

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
        title="Partner Slider"
        columns={columns}
        rows={rows}
        onDelete={(row) => {
          setSelectedRow(row);
        }}
        onView={(row) => navigate(`/admin/messages/view/${row.id}`)}
        onSearch={(query) => console.log("Search", query)}
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
        isDraggable={false}
      />
    </AdminLayout>
  );
};

export default MessageRequest;
