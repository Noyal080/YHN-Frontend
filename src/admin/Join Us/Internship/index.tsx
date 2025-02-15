import AdminLayout from "@/admin/Layout";

const InternshipSection = () => {
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Internship" },
      ]}
      activeSidebarItem="Internship"
      title={`Internship`}
    >
      <h1> Internship </h1>
    </AdminLayout>
  );
};
export default InternshipSection;
