import AdminLayout from "@/admin/Layout";
import { Field } from "@/components/ui/field";
import { SliderInput } from "@/utils/types";
import {
  Box,
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const SliderForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SliderInput>();
  const { id } = useParams();
  const onSubmit = (data: SliderInput) => {
    console.log(data);
    // Handle login logic here
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        {
          label: "Slider",
          link: "/admin/slider",
        },
        {
          label: id ? "Edit Slider" : "Add Slider",
        },
      ]}
      title={`${id ? "Edit" : "Add"} Slider Section`}
      activeSidebarItem="Slider"
    >
      <CardRoot m={"auto"}>
        <CardBody>
          <Heading mb={6}>{id ? "Edit Slider" : "Add Slider"}</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} align="stretch">
              <HStack gap={4}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <Field label="Title" required error={errors.title?.message}>
                      <Input {...field} placeholder="Enter title" size="md" />
                    </Field>
                  )}
                />
                <Controller
                  name="sub_title"
                  control={control}
                  render={({ field }) => (
                    <Field label="Text Field">
                      <Input {...field} placeholder="Enter Text" size="md" />
                    </Field>
                  )}
                />
              </HStack>
              <HStack gap={4}>
                <Controller
                  name="priority_order"
                  control={control}
                  rules={{ required: "Priority order is required" }}
                  render={({ field }) => (
                    <Field label="Priority Order" required></Field>
                  )}
                />
                <Controller
                  name="image"
                  control={control}
                  rules={{ required: "Image URL is required" }}
                  render={({ field }) => (
                    <Field
                      label="Image URL"
                      required
                      error={errors.image?.message}
                    >
                      <Input
                        {...field}
                        placeholder="Enter image URL"
                        size="md"
                      />
                    </Field>
                  )}
                />
              </HStack>

              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <Box>
                    <Field label="Title" required>
                      <Input
                        {...field}
                        placeholder="Enter your title"
                        type="text"
                        size="sm"
                      />
                    </Field>
                  </Box>
                )}
              />
              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <Box>
                    <Field label="Title" required>
                      <Input
                        {...field}
                        placeholder="Enter your title"
                        type="text"
                        size="sm"
                      />
                    </Field>
                  </Box>
                )}
              />
              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <Box>
                    <Field label="Title" required>
                      <Input
                        {...field}
                        placeholder="Enter your title"
                        type="text"
                        size="sm"
                      />
                    </Field>
                  </Box>
                )}
              />
              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <Box>
                    <Field label="Title" required>
                      <Input
                        {...field}
                        placeholder="Enter your title"
                        type="text"
                        size="sm"
                      />
                    </Field>
                  </Box>
                )}
              />
              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <Box>
                    <Field label="Title" required>
                      <Input
                        {...field}
                        placeholder="Enter your title"
                        type="text"
                        size="sm"
                      />
                    </Field>
                  </Box>
                )}
              />
            </VStack>
          </form>
        </CardBody>
      </CardRoot>
    </AdminLayout>
  );
};

export default SliderForm;
