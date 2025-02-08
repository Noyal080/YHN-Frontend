import {
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import AdminLayout from "../Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ServiceInput } from "@/utils/types";
import { Controller, useForm } from "react-hook-form";
import { Field } from "@/components/ui/field";
import CommonEditor from "@/common/Editor";
import { Button } from "@/components/ui/button";

const ServiceForms = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState<ServiceInput>({
    title: "",
    description: "",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceInput>({
    values: {
      title: serviceData.title || "",
      description: serviceData.description || "",
    },
  });

  const handleFieldChange = (
    field: keyof ServiceInput,
    value: string | number | boolean | File
  ) => {
    setServiceData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = (data: ServiceInput) => {
    console.log(data);
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        {
          label: "Service",
          link: "/admin/services",
        },
        { label: id ? "Edit Service" : "Add Service" },
      ]}
      title={`${id ? "Edit" : "Add"} Services Section`}
      activeSidebarItem="Services"
    >
      <CardRoot m="auto" maxWidth="800px" mt={8} boxShadow="lg">
        <CardBody>
          <Heading mb={6}>{id ? "Edit Slider" : "Add Slider"}</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} align="stretch">
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <Field label="Title">
                    <Input
                      {...field}
                      placeholder="Enter title"
                      size="md"
                      onChange={(e) =>
                        handleFieldChange("title", e.target.value)
                      }
                    />
                    {errors.title && (
                      <Text textStyle="sm" color="red">
                        {errors.title.message}
                      </Text>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <Field label="Description">
                    <CommonEditor
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        handleFieldChange("description", value);
                      }}
                    />
                    {errors.description && (
                      <Text textStyle="sm" color="red">
                        {errors.description.message}
                      </Text>
                    )}
                  </Field>
                )}
              />
            </VStack>
            <HStack justifyContent="flex-end" mt={4}>
              <Button variant={"ghost"} onClick={() => navigate(-1)}>
                {" "}
                Cancel{" "}
              </Button>
              <Button type="submit" colorPalette={"blue"}>
                {" "}
                Submit
              </Button>
            </HStack>
          </form>
        </CardBody>
      </CardRoot>
    </AdminLayout>
  );
};

export default ServiceForms;
