import AdminLayout from "../Layout";

const ProjectSection = () => {
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Our Works" },
      ]}
      title={`Our Works`}
      activeSidebarItem="Our Works"
    >
      <h1> Our Works </h1>
    </AdminLayout>
  );
};

export default ProjectSection;
