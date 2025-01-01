import { Box } from "@chakra-ui/react";
import AdminLayout from "../Layout";

import { useState } from "react";
const AddForm = () => {
  const [editorReady, setEditorReady] = useState(false);
  console.log(editorReady);

  return (
    <AdminLayout title="Add Form" breadcrumbItems={[]} activeSidebarItem="form">
      <Box borderWidth={1} borderRadius="md" p={2}></Box>
    </AdminLayout>
  );
};

export default AddForm;
