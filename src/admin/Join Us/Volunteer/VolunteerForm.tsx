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

const VolunteerForm = () => {
  const [volunteerData, setVolunteerData] = useState<InternshipType>({
    title: "",
    description: "",
    apply_link: "",
    status: 1,
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
  } = useForm<InternshipType>({
    values: {
      id: volunteerData?.id || undefined,
      title: volunteerData?.title || "",
      description: volunteerData?.description || "",
      apply_link: volunteerData?.apply_link || "",
      status: volunteerData.status,
      start_date:
        volunteerData.start_date || new Date().toISOString().split("T")[0],
      end_date: volunteerData.end_date || "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/volunteers/${id}`);
        setVolunteerData(res.data.data);
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
        const res = await axiosInstance.patch(`/volunteers/${id}`, data);
        showToast({
          type: "success",
          description: res.data.message,
        });
      } else {
        const res = await axiosInstance.post("/volunteers", data);
        showToast({
          type: "success",
          description: res.data.message,
        });
      }
      navigate("/admin/volunteer");
    } catch (error) {
      let errorMessage = "Failed to update volunteer status";
      if (axios.isAxiosError(error)) {
        // Try to get the error message from response data first
        errorMessage =
          error.response?.data?.message ||
          // Additional debugging info
          console.log("Error details:", {
            status: error.response?.status,
            data: error.response?.data,
          });
      } else if (error instanceof Error) {
        errorMessage = error.message;
        console.log(errorMessage);
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
        { label: "Volunteer", link: "/admin/volunteer" },
        { label: `${id ? "Edit" : "Add"} Volunteer` },
      ]}
      activeSidebarItem="Volunteer"
      title={`${id ? "Edit" : "Add"} Volunteer`}
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
            <Heading mb={6}>{id ? "Edit Volunteer" : "Add Volunteer"}</Heading>
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
                    rules={{ required: "Start Date is requried" }}
                    render={({ field }) => (
                      <Field label="Start Date">
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
                    rules={{ required: "End Date is requried" }}
                    render={({ field }) => (
                      <Field label="End Date">
                        <Input
                          {...field}
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
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <HStack justify="space-between" align="center">
                        <Text fontWeight="500" textStyle="md">
                          Show Volunteership
                        </Text>
                        <Switch
                          checked={field.value === 1}
                          onCheckedChange={(value) => {
                            const statusValue = value.checked ? 1 : 0;
                            field.onChange(statusValue);
                          }}
                          color="black"
                          colorPalette="blue"
                        />
                      </HStack>
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

export default VolunteerForm;
