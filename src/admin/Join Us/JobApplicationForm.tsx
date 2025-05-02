import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import CommonEditor from "@/common/Editor";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { JobApplicationType } from "@/utils/types";
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
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const JobApplicationForm = () => {
  const [jobApplicationData, setJobApplicationData] =
    useState<JobApplicationType>({
      title: "",
      description: "",
      apply_link: "",
      job_position: "",
      status: 0,
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
    });
  const navigate = useNavigate();
  const { id } = useParams();

  const { showToast } = useCommonToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JobApplicationType>({
    values: {
      id: jobApplicationData?.id || undefined,
      title: jobApplicationData?.title || "",
      description: jobApplicationData?.description || "",
      apply_link: jobApplicationData?.apply_link || "",
      status: jobApplicationData.status,
      job_position: jobApplicationData.job_position,
      start_date:
        jobApplicationData.start_date || new Date().toISOString().split("T")[0],
      end_date: jobApplicationData.end_date || "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/JobApplications/${id}`);
        setJobApplicationData(res.data.data);
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

  const onSubmit = async (data: JobApplicationType) => {
    setIsLoading(true);
    try {
      if (id) {
        const res = await axiosInstance.patch(`/JobApplications/${id}`, data);
        showToast({
          type: "success",
          description: res.data.message,
        });
      } else {
        const res = await axiosInstance.post("/JobApplications", data);
        showToast({
          type: "success",
          description: res.data.message,
        });
      }
      navigate("/admin/volunteer");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Join Us", link: "/admin/join-us" },
        { label: `${id ? "Edit" : "Add"} Job Application` },
      ]}
      activeSidebarItem="Join Us"
      title={`${id ? "Edit" : "Add"} Job Application`}
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
                  {id ? "Edit Job Application" : "Add Job Application"}
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
                    required: "Volunteer Application Link is required",
                    pattern: {
                      value: /^https:\/\/[\w.-]+\.[a-z]{2,6}([/\w.-]*)*\/?$/,
                      message:
                        "Please enter a valid URL (e.g., https://example.com)",
                    },
                  }}
                  render={({ field }) => (
                    <Field label="Volunteer Application Link">
                      <Input
                        {...field}
                        placeholder="Enter the link url"
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
                          min={jobApplicationData.start_date}
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
                  rules={{ required: "Job Description is required" }}
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

export default JobApplicationForm;
