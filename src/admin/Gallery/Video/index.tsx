import AdminLayout from "@/admin/Layout";
import useCommonToast from "@/common/CommonToast";
import CommonTable from "@/common/Table/CommonTable";
import ReactPlayer from "react-player";
import useDebounce from "@/helper/debounce";
import { Column } from "@/utils";
import { PaginationProps, VideoInputTypes } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/api/axios";
import CommonModal from "@/common/CommonModal";
import { Text } from "@chakra-ui/react";

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
            width="100%"
            height="100%"
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);

      try {
        const res = await axiosInstance.get("/video", {
          params: { page, search: debouncedSearch },
        });
        const resData = res.data.data;

        setRows(resData.data);
        setPaginationData(resData.pagination);

        setTriggerFetch(false);
        setLoading(false);
        // setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    fetchGallery();
  }, [triggerFetch, debouncedSearch, page]);

  const handleDelete = async (row: VideoInputTypes) => {
    try {
      await axiosInstance.delete(`/videos/${row.id}`);
      showToast({
        description: `${row.title} deleted succesfully`,
        type: "success",
      });
      setModalOpen(false);
      setTriggerFetch(true);
    } catch (e) {
      console.log(e);
      showToast({
        description: "Error while removing video data",
        type: "error",
      });
    }
  };

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
        onEdit={(row) => navigate(`/admin/gallery/videos/edit/${row.id}`)}
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

      <CommonModal
        open={modalOpen}
        onOpenChange={() => setModalOpen(false)}
        title={"Remove Gallery Image"}
        onButtonClick={() => handleDelete(selectedRow as VideoInputTypes)}
      >
        <Text>
          {" "}
          Are you sure you want to remove {selectedRow?.title}? This will
          permanently remove all the data regarding the videos.{" "}
        </Text>
      </CommonModal>
    </AdminLayout>
  );
};

export default VideoSection;
