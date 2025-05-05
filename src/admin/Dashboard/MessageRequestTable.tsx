import { Column } from "@/utils";
import { MessageRequestType } from "@/utils/types";
import {
  Box,
  Flex,
  Heading,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
} from "@chakra-ui/react";
import MessageContent from "../Home/Message Request/MessageComponent";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/api/axios";
import TableSkeleton from "@/common/Table/TableSkeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { HiSwatch } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DashboardMessageRequest = () => {
  const [rows, setRows] = useState<MessageRequestType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const columns: Column<MessageRequestType>[] = [
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
      visible: true,
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

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/latestmessages");
        const data = res.data.data;
        setRows(data.latest_messages);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box p={5}>
      <Flex justify={"space-between"} mb={3}>
        <Heading size="md">Latest Messages</Heading>
        <Button variant={"ghost"} onClick={() => navigate("/admin/messages")}>
          {" "}
          View all{" "}
        </Button>
      </Flex>
      {loading ? (
        <TableSkeleton visibleColumns={columns} rowCount={5} />
      ) : (
        <TableRoot variant={"outline"}>
          <TableHeader>
            <TableRow>
              {columns
                .filter((column) => column.visible)
                .map((column) => (
                  <TableColumnHeader key={String(column.key)}>
                    {column.label}
                  </TableColumnHeader>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.filter((column) => column.visible).length + 1
                  }
                >
                  <EmptyState
                    icon={<HiSwatch />}
                    title="No data found"
                    size={"lg"}
                    // description="Try adjusting your search"
                  />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns
                    .filter((column) => column.visible) // Only render visible columns
                    .map((column) => (
                      <TableCell key={String(column.key)}>
                        {column.render
                          ? column.render(row)
                          : String(row[column.key])}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </TableRoot>
      )}
    </Box>
  );
};

export default DashboardMessageRequest;
