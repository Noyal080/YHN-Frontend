import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import CommonEditor from "@/common/Editor";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { InternshipType } from "@/utils/types";
import {
  Box,
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const InternshipForm = () => {
  const [internshipData, setInternshipData] = useState<InternshipType>({
    title: "",
    description: "",
    apply_link: "",
    status: 0,
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();
  // const token = localStorage.getItem("accessToken");
  // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const { showToast } = useCommonToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InternshipType>({
    values: {
      id: internshipData?.id || undefined,
      title: internshipData?.title || "",
      description: internshipData?.description || "",
      apply_link: internshipData?.apply_link || "",
      status: internshipData.status,
      start_date:
        internshipData.start_date || new Date().toISOString().split("T")[0],
      end_date: internshipData.end_date || "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/internships/${id}`);
        setInternshipData(res.data.data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const onSubmit = async (data: InternshipType) => {
    setIsLoading(true);
    try {
      if (id) {
        const res = await axiosInstance.patch(`/internships/${id}`, data);
        showToast({
          type: "success",
          description: res.data.message,
        });
      } else {
        const res = await axiosInstance.post("/internships", data);
        showToast({
          type: "success",
          description: res.data.message,
        });
      }
      navigate("/admin/internship");
    } catch (error) {
      let errorMessage = "Failed to update internship";
      if (axios.isAxiosError(error)) {
        // Try to get the error message from response data first
        errorMessage = error.response?.data?.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      showToast({
        description: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Internship", link: "/admin/internship" },
        { label: `${id ? "Edit" : "Add"} Internship Application` },
      ]}
      activeSidebarItem="Internship"
      title={`${id ? "Edit" : "Add"} Internship Application`}
    >
      <Box position="relative">
        {/* Overlay and Spinner */}
        {isLoading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(255, 255, 255, 0.8)" // Semi-transparent white background
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1} // Ensure it's above the form
          >
            <Spinner size="xl" color="blue.500" />
          </Box>
        )}
        <CardRoot m="auto" maxWidth="800px" mt={8} boxShadow="lg">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <HStack justifyContent="space-between" mb={4}>
                <Heading mb={6}>
                  {id
                    ? "Edit Internship Application"
                    : "Add Internship Application"}
                </Heading>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <HStack justify="space-between" align="center">
                      <Text fontWeight="500" textStyle="md">
                        {field.value === 1 ? "Active" : "Inactive"}
                      </Text>
                      <Switch
                        checked={field.value === 1}
                        onCheckedChange={(value) => {
                          const statusValue = value.checked ? 1 : 0;
                          field.onChange(statusValue);
                        }}
                        color="black"
                        colorPalette="green"
                      />
                    </HStack>
                  )}
                />
              </HStack>
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
                  name="apply_link"
                  control={control}
                  rules={{
                    required: "Internship Application Link is required",
                    pattern: {
                      value: /^https:\/\/[\w.-]+\.[a-z]{2,6}([/\w.-]*)*\/?$/,
                      message:
                        "Please enter a valid URL (e.g., https://example.com)",
                    },
                  }}
                  render={({ field }) => (
                    <Field label="Internship Application Link">
                      <Input
                        {...field}
                        placeholder="Example: https://example.com"
                        size="md"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      {errors.apply_link && (
                        <Text textStyle="sm" color="red">
                          {errors.apply_link.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />
                <HStack>
                  <Controller
                    name="start_date"
                    control={control}
                    rules={{ required: "Application Publish Date is requried" }}
                    render={({ field }) => (
                      <Field label="Application Publish Date">
                        <Input
                          {...field}
                          type="date"
                          size={"md"}
                          onChange={(value) => field.onChange(value)}
                        />
                        {errors.start_date && (
                          <Text textStyle="sm" color="red">
                            {errors.start_date.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="end_date"
                    control={control}
                    rules={{ required: "Deadline is requried" }}
                    render={({ field }) => (
                      <Field label="Deadline">
                        <Input
                          {...field}
                          min={internshipData.start_date}
                          type="date"
                          size={"md"}
                          onChange={(value) => field.onChange(value)}
                        />
                        {errors.end_date && (
                          <Text textStyle="sm" color="red">
                            {errors.end_date.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />
                </HStack>

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
      </Box>
    </AdminLayout>
  );
};

export default InternshipForm;
