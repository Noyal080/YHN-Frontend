import AdminLayout from "../Layout";

const AdminDashboard = () => {
  const breadcrumbItems = [{ label: "Dashboard", link: "/" }];
  return (
    <AdminLayout
      breadcrumbItems={breadcrumbItems}
      dynamicHeader="Admin HomePage"
    >
      <h1> Admin Dashboard</h1>
    </AdminLayout>
  );
};

export default AdminDashboard;
