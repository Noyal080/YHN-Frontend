import AdminLayout from "@/admin/Layout";
const Fellows = () => {
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Former Fellow" },
      ]}
      title={`Former Fellow`}
      activeSidebarItem="Former Fellow"
    >
      <h1> Hey </h1>
    </AdminLayout>
  );
};

export default Fellows;
