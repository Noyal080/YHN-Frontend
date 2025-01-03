import { Button } from "@/components/ui/button";
import AdminLayout from "../Layout";
import { useState } from "react";
import CommonModal from "@/common/CommonModal";

const AddForm = () => {
  // const { showToast } = useCommonToast();
  const [open, setOpen] = useState(false);

  return (
    <AdminLayout title="Add Form" breadcrumbItems={[]} activeSidebarItem="form">
      <Button onClick={() => setOpen(true)}> Click me</Button>
      <CommonModal
        open={open}
        onOpenChange={() => setOpen(!open)}
        title="Add Form"
      >
        Hrllo
      </CommonModal>
    </AdminLayout>
  );
};

export default AddForm;
