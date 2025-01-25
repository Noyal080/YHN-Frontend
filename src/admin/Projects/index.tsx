import AdminLayout from "../Layout";

const ProjectSection = () => {
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Projects" },
      ]}
      title={`Projects Section`}
      activeSidebarItem="Projects"
    >
      <h1> Projects </h1>
    </AdminLayout>
  );
};

export default ProjectSection;
