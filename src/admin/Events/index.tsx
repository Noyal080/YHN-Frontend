import AdminLayout from "../Layout";

const EventSection = () => {
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Events" },
      ]}
      title={`Events Section`}
      activeSidebarItem="Events"
    >
      <h1> Event Section </h1>
    </AdminLayout>
  );
};

export default EventSection;
