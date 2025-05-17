import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import CommonEditor from "@/common/Editor";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { JobApplicationType } from "@/utils/types";
import CreatableSelect from "react-select/creatable";

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

interface PositionOption {
  label: string;
  value: number;
}

const JobApplicationForm = () => {
  const [positionOption, setPositionOption] = useState<PositionOption[]>([]);

  const [jobApplicationData, setJobApplicationData] =
    useState<JobApplicationType>({
      title: "",
      description: "",
      apply_link: "",
      job_position: "",
      job_open_position_id: null,
      status: "1",
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
    watch,
    formState: { errors },
  } = useForm<JobApplicationType>({
    values: {
      id: jobApplicationData?.id || undefined,
      title: jobApplicationData?.title || "",
      description: jobApplicationData?.description || "",
      apply_link: jobApplicationData?.apply_link || "",
      status: jobApplicationData.status,
      job_position: jobApplicationData.job_position,
      job_open_position_id: jobApplicationData.job_open_position_id,
      start_date:
        jobApplicationData.start_date || new Date().toISOString().split("T")[0],
      end_date: jobApplicationData.end_date || "",
    },
  });

  const startDate = watch("start_date");

  useEffect(() => {
    const fetchPositionData = async () => {
      try {
        const res = await axiosInstance.get("/jobopenposition");
        const result = res.data.data.data;
        setPositionOption(
          result.map((position: { name: string; id: number }) => ({
            label: position.name,
            value: position.id,
          }))
        );
      } catch (e) {
        console.error(e);
      }
    };
    fetchPositionData();
  }, []);

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
    const plainTextLength = data.description
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .trim().length; // Remove whitespace

    console.log(plainTextLength, data.description.length, data.description);

    try {
      const submissionData = { ...data };

      // Check if the position is a new one (a string value)
      if (typeof submissionData.job_open_position_id === "string") {
        // Create new position first
        const positionResponse = await axiosInstance.post("/jobopenposition", {
          name: submissionData.job_open_position_id,
        });

        // Extract the new position ID from the response
        const newPositionId = positionResponse.data.data.id;

        // Update the submission data with the new position ID
        submissionData.job_open_position_id = newPositionId;
      }
      if (id) {
        const res = await axiosInstance.patch(
          `/JobApplications/${id}`,
          submissionData
        );
        showToast({
          type: "success",
          description: res.data.message,
        });
      } else {
        const res = await axiosInstance.post(
          "/JobApplications",
          submissionData
        );
        showToast({
          type: "success",
          description: res.data.message,
        });
      }
      navigate("/admin/join-us");
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
                        {field.value === "1" ? "Show" : "Hide"}
                      </Text>
                      <Switch
                        checked={field.value === "1"}
                        onCheckedChange={(value) => {
                          const statusValue = value.checked ? "1" : "0";
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
                <HStack>
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
                    name="job_open_position_id"
                    control={control}
                    rules={{ required: "Position is required" }}
                    render={({ field }) => (
                      <Field label="Job Position">
                        <CreatableSelect
                          {...field}
                          placeholder="Create or add job user position"
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          options={positionOption as any}
                          onChange={(selectedOption) => {
                            // Update both React Hook Form state and local state
                            field.onChange(selectedOption?.value || null);
                          }}
                          value={
                            // Find the matching option object if field.value is a number
                            typeof field.value === "number"
                              ? positionOption.find(
                                  (option) => option.value === field.value
                                )
                              : // If it's a custom value (string) or null, handle accordingly
                              field.value
                              ? {
                                  label: String(field.value),
                                  value: field.value,
                                }
                              : null
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "100%",
                              zIndex: 1000,
                            }),
                            control: (base) => ({
                              ...base,
                              width: "100%",
                              borderColor: errors.job_open_position_id
                                ? "red"
                                : base.borderColor,
                            }),
                            menu: (base) => ({
                              ...base,
                              width: "100%",
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              width: "100%",
                            }),
                            input: (base) => ({
                              ...base,
                              width: "100%",
                            }),
                          }}
                        />
                        {errors.job_open_position_id && (
                          <Text textStyle="sm" color="red">
                            {errors.job_open_position_id.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />
                </HStack>

                <Controller
                  name="apply_link"
                  control={control}
                  rules={{
                    required: "Job Application Link is required",
                    pattern: {
                      value: /^https:\/\/[\w.-]+\.[a-z]{2,6}([/\w.-]*)*\/?$/,
                      message:
                        "Please enter a valid URL (e.g., https://example.com)",
                    },
                  }}
                  render={({ field }) => (
                    <Field label="Job Application Link">
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
                          min={startDate}
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
