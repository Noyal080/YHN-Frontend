import { Box } from "@chakra-ui/react";
import AdminLayout from "../Layout";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState } from "react";
const AddForm = () => {
  const [editorReady, setEditorReady] = useState(false);
  console.log(editorReady);

  return (
    <AdminLayout title="Add Form" breadcrumbItems={[]}>
      <Box borderWidth={1} borderRadius="md" p={2}>
        <CKEditor
          editor={ClassicEditor}
          data="<p>Hello from CKEditor 5!</p>"
          config={{
            licenseKey: "",
            toolbar: [
              "heading",
              "|",
              "bold",
              "italic",
              "link",
              "bulletedList",
              "numberedList",
              "|",
              "imageUpload",
              "blockQuote",
              "insertTable",
              "mediaEmbed",
              "undo",
              "redo",
            ],
            image: {
              toolbar: [
                "imageStyle:inline",
                "imageStyle:block",
                "imageStyle:side",
                "|",
                "toggleImageCaption",
                "imageTextAlternative",
              ],
            },
          }}
          onReady={(editor) => {
            console.log("Editor is ready to use!", editor);
            setEditorReady(true);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
          }}
        />
      </Box>
    </AdminLayout>
  );
};

export default AddForm;
