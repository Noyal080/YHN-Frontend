import AdminLayout from "@/admin/Layout";

const VideoSection = () => {
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Video" },
      ]}
      title={`Video Section`}
      activeSidebarItem="Video"
    >
      <h1> Video Section </h1>
    </AdminLayout>
  );
};

export default VideoSection;
