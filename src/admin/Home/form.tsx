import AdminLayout from "../Layout";
import { useState } from "react";

import { Button } from "@/components/ui/button";
const AddForm = () => {
  // const { showToast } = useCommonToast();
  const [open, setOpen] = useState(false);

  return (
    <AdminLayout title="Add Form" breadcrumbItems={[]} activeSidebarItem="form">
      <Button onClick={() => setOpen(true)}> Click me</Button>
      {open && <h1> hi </h1>}
    </AdminLayout>
  );
};

export default AddForm;
