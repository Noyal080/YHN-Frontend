import AdminLayout from "@/admin/Layout";

const VolunteerSection = () => {
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Volunteer" },
      ]}
      activeSidebarItem="Volunteer"
      title={`Volunteer`}
    >
      <h1> Volunteer </h1>
    </AdminLayout>
  );
};
export default VolunteerSection;
