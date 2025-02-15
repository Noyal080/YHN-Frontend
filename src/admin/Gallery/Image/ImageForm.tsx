import AdminLayout from "@/admin/Layout";
import { Field } from "@/components/ui/field";
import { ImageInputTypes } from "@/utils/types";
import { CardBody, CardRoot, Heading, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const ImageForm = () => {
  const { id } = useParams();
  const [imageData, setImageData] = useState<ImageInputTypes>({
    title: "",
    image: [],
    status: 1,
  });

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ImageInputTypes>({});

  const handleFieldChange = (
    field: keyof ImageInputTypes,
    value: string | number | boolean | File
  ) => {
    setImageData((prev) => ({ ...prev, [field]: value }));
  };
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
      <CardRoot m="auto" maxWidth="800px" mt={8} boxShadow="lg">
        <CardBody>
          <Heading mb={6}>Add Images</Heading>
          <form>
            <VStack gap={4} align={"stretch"}>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <Field label="Title">
                    <Input
                      {...field}
                      size="md"
                      onChange={(e) =>
                        handleFieldChange("title", e.target.value)
                      }
                      placeholder="Enter the images title"
                    />
                  </Field>
                )}
              />
              <Controller
                name="image"
                control={control}
                rules={{ required: "Image URL is required" }}
                render={({ field }) => <Field label="Image URL"></Field>}
              />
            </VStack>
          </form>
        </CardBody>
      </CardRoot>
    </AdminLayout>
  );
};

export default ImageForm;
