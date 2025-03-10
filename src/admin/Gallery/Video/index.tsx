import AdminLayout from "@/admin/Layout";
import useCommonToast from "@/common/CommonToast";
import CommonTable from "@/common/Table/CommonTable";
import { Switch } from "@/components/ui/switch";
import ReactPlayer from "react-player";
import useDebounce from "@/helper/debounce";
import { Column } from "@/utils";
import { PaginationProps, VideoInputTypes } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VideoSection = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<VideoInputTypes | null>(null);
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);
  const { showToast } = useCommonToast();
  const [rows, setRows] = useState<VideoInputTypes[]>([]);

  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    setRows([
      {
        id: 1,
        title: "Sample Video",
        description: "This is a sample video",
        video_url:
          "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
        status: 1,
      },
    ]);
  }, []);

  const columns: Column<VideoInputTypes>[] = [
    {
      key: "id",
      label: "#",
      visible: true,
    },
    {
      key: "title",
      label: "Title",
      visible: true,
    },
    {
      key: "video_url",
      label: "Video",
      visible: true,
      render: (row) => (
        <div style={{ width: "300px", height: "auto" }}>
          {" "}
          {/* Adjust size here */}
          <ReactPlayer
            url={row.video_url}
            controls={true}
            width="100%" // Takes 100% of the parent container's width
            height="100%" // Takes 100% of the parent container's height
          />
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      visible: true,
      render: (row) => (
        <Switch
          checked={row.status === 1}
          onCheckedChange={() => console.log(row.id)}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Video" },
      ]}
      title={`Video Section`}
      activeSidebarItem="Video"
    >
      <CommonTable
        title="Gallery Videos"
        loading={loading}
        columns={columns}
        rows={rows}
        addName="Add Videos"
        onView={(row) => navigate(`/admin/gallery/videos/view/${row.id}`)}
        onDelete={(row) => {
          setModalOpen(true);
          setSelectedRow(row);
        }}
        onSearch={(query) => setSearchQuery(query)}
        onAdd={() => navigate("/admin/gallery/videos/add")}
        count={paginationData?.total_pages}
        pageSize={paginationData?.per_page}
        currentPage={page}
        onPageChange={(page) => {
          setPage(page);
        }}
      />
    </AdminLayout>
  );
};

export default VideoSection;
