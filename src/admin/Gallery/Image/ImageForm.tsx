import AdminLayout from "@/admin/Layout";
import { useParams } from "react-router-dom";

const ImageForm = () => {
  const { id } = useParams();
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Image", link: "/admin/gallery/images" },
        { label: `${id ? "Edit" : "Add"} Image` },
      ]}
      title={`${id ? "Edit" : "Add"} Image`}
      activeSidebarItem="Image"
    >
      <h1> Add Iamge </h1>
    </AdminLayout>
  );
};

export default ImageForm;
