import AdminLayout from "../Layout";

const CareerSection = () => {
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Careers" },
      ]}
      title={`Volunteer / Careers Section`}
      activeSidebarItem="Volunteer / Careers"
    >
      <h1> Carrer </h1>
    </AdminLayout>
  );
};

export default CareerSection;
