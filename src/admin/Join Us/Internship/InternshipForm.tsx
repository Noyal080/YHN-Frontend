import AdminLayout from "@/admin/Layout";
import CommonEditor from "@/common/Editor";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InternshipType } from "@/utils/types";
import {
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const InternshipForm = () => {
  const [internshipData, setInternshipData] = useState<InternshipType>({
    title: "",
    description: "",
    linkTo: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InternshipType>({
    values: {
      id: internshipData.id,
      title: internshipData.title || "",
      description: internshipData.description || "",
      linkTo: internshipData.linkTo || "",
    },
  });

  const onSubmit = (data: InternshipType) => {
    console.log(data);
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Internship", link: "/admin/internship" },
        { label: `${id ? "Edit" : "Add"} Internship` },
      ]}
      activeSidebarItem="Internship"
      title={`${id ? "Edit" : "Add"} Internship`}
    >
      <CardRoot m="auto" maxWidth="800px" mt={8} boxShadow="lg">
        <CardBody>
          <Heading mb={6}>{id ? "Edit Internship" : "Add Internship"}</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} align={"stretch"}>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is requried" }}
                render={({ field }) => (
                  <Field label="Title">
                    <Input
                      {...field}
                      placeholder="Enter a title"
                      size={"md"}
                      onChange={(value) => field.onChange(value)}
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
                        // handleFieldChange("sub_title", value);
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

              <Controller
                name="linkTo"
                control={control}
                render={({ field }) => (
                  <Field label="Apply Link">
                    <Input
                      {...field}
                      placeholder="Enter the link url"
                      size="md"
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    {errors.linkTo && (
                      <Text textStyle="sm" color="red">
                        {errors.linkTo.message}
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

export default InternshipForm;
