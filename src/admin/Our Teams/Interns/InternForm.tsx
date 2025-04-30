import AdminLayout from "@/admin/Layout";
import { FellowInternInput } from "@/utils/types";
import { useState } from "react";
import { useForm } from "react-hook-form";

const InternsForm = () => {
  const [internData, setInternData] = useState<FellowInternInput>({
    name: "",
    image: "",
    joined_date: "",
    completion_date: "",
    status: 1,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FellowInternInput>({
    values: {
      name: internData.name,
      image: internData.image,
      joined_date: internData.joined_date,
      completion_date: internData.completion_date,
      status: internData.status,
    },
  });

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Interns", link: "/admin/interns" },
        { label: "Add Intern" },
      ]}
      title={`Add Intern`}
      activeSidebarItem="Interns"
    >
      <h1> Add</h1>
    </AdminLayout>
  );
};

export default InternsForm;
