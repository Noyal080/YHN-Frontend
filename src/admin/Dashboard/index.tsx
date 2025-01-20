import AdminLayout from "../Layout";

const AdminDashboard = () => {
  const breadcrumbItems = [{ label: "Dashboard", link: "/admin" }];
  return (
    <AdminLayout
      breadcrumbItems={breadcrumbItems}
      title="Admin HomePage"
      activeSidebarItem="Dashboard"
    >
      <h1> Admin Dashboard</h1>
    </AdminLayout>
  );
};

export default AdminDashboard;
