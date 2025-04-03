import AdminLayout from "@/admin/Layout";
const ChairpersonMessage = () => {
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Chairperson Message" },
      ]}
      title={`Chairperson Message`}
      activeSidebarItem="Chairperson Message"
    >
      <h1> Chairperson Message </h1>
    </AdminLayout>
  );
};

export default ChairpersonMessage;
