import AdminLayout from "@/admin/Layout";
import useCommonToast from "@/common/CommonToast";
import { Field } from "@/components/ui/field";
import {
  FileUploadDropzone,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { compressImage } from "@/helper/imageCompressor";
import { TeamsInput } from "@/utils/types";
import {
  Box,
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Image,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/api/axios";

interface RoleOption {
  label: string;
  value: string;
}

interface PositionOption {
  label: string;
  value: number;
}

const TeamsForms = () => {
  const { id } = useParams();
  const { showToast } = useCommonToast();
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const [positionOption, setPositionOption] = useState<PositionOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [teamData, setTeamData] = useState<TeamsInput>({
    name: "",
    image: "",
    position_id: null,
    role: "",
    status: 1,
  });
  const navigate = useNavigate();
  // const token = localStorage.getItem("accessToken");
  // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const options: RoleOption[] = [
    { label: "BOD", value: "BOD" },
    { label: "Staff", value: "Staff" },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamsInput>({
    values: {
      id: teamData.id,
      name: teamData.name,
      image: teamData.image,
      position_id: teamData.position_id,
      role: teamData.role,
      status: teamData.status,
      image_url: teamData.image_url,
    },
  });

  const handleFieldChange = (
    field: keyof TeamsInput,
    value: string | number | boolean | File | null
  ) => {
    setTeamData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      const compressedFile = await compressImage(file);
      setSelectedImage(URL.createObjectURL(compressedFile)); // Preview image
      handleFieldChange("image", compressedFile); // Update form state
    } catch (error) {
      console.error("Compression error:", error);
    }
  };

  useEffect(() => {
    const fetchPositionData = async () => {
      try {
        const res = await axiosInstance.get("/positions");
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
    const fetchTeamData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/teams/${id}`);
        setTeamData(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchTeamData();
    }
  }, [id]);

  const onSubmit = async (data: TeamsInput) => {
    setIsLoading(true);
    try {
      const submissionData = { ...data };

      // Check if the position is a new one (a string value)
      if (typeof submissionData.position_id === "string") {
        // Create new position first
        const positionResponse = await axiosInstance.post("/positions", {
          name: submissionData.position_id,
        });

        // Extract the new position ID from the response
        const newPositionId = positionResponse.data.data.id;

        // Update the submission data with the new position ID
        submissionData.position_id = newPositionId;
      }

      if (id) {
        await axiosInstance.post(`/teams/${id}`, submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({
          description: "Team updated successfully",
          type: "success",
        });
        navigate("/admin/teams");
      } else {
        await axiosInstance.post("/teams", submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({ description: "Team added successfully", type: "success" });
        navigate("/admin/teams");
      }
    } catch (e) {
      console.error(e);
      showToast({
        description: id ? `Failed to update the team` : "Failed to add team",
        type: "error",
      });
    } finally {
      setIsLoading(false); // Set loading to false when submission ends (success or error)
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Our Team", link: "/admin/teams" },
        { label: `${id ? "Edit" : "Add"} Team` },
      ]}
      activeSidebarItem="Our Team"
      title={`${id ? "Edit" : "Add"} Team`}
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
            <Heading mb={6}> {id ? "Edit" : "Add"} Teams </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack gap={4} align="stretch">
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <Field label="Name">
                      <Input
                        {...field}
                        placeholder="Enter user name"
                        size={"md"}
                        onChange={(e) =>
                          handleFieldChange("name", e.target.value)
                        }
                      />
                      {errors.name && (
                        <Text textStyle="sm" color="red">
                          {errors.name.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />
                <HStack>
                  <Controller
                    name="position_id"
                    control={control}
                    rules={{ required: "Position is required" }}
                    render={({ field }) => (
                      <Field label="Position">
                        <CreatableSelect
                          {...field}
                          placeholder="Create or select user position"
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          options={positionOption as any}
                          onChange={(selectedOption) => {
                            // Update both React Hook Form state and local state
                            field.onChange(selectedOption?.value || null);
                            handleFieldChange(
                              "position_id",
                              selectedOption?.value || null
                            );
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
                            }),
                            control: (base) => ({
                              ...base,
                              width: "100%",
                              borderColor: errors.position_id
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
                        {errors.position_id && (
                          <Text textStyle="sm" color="red">
                            {errors.position_id.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: "Role is required" }}
                    render={({ field }) => (
                      <Field label="Role">
                        <Select
                          {...field}
                          isClearable
                          options={options}
                          value={options.find(
                            (option) => option.value === field.value
                          )}
                          onChange={(selectedOption) =>
                            handleFieldChange(
                              "role",
                              selectedOption?.value || ""
                            )
                          }
                          placeholder="Select user role"
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "100%",
                            }),
                            control: (base) => ({
                              ...base,
                              width: "100%",
                              borderColor: errors.role
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
                        {errors.role && (
                          <Text textStyle="sm" color="red">
                            {errors.role.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />
                </HStack>

                <Controller
                  name="image"
                  control={control}
                  rules={!id ? { required: "Image URL is required" } : {}}
                  render={({ field }) => (
                    <Field label="Image URL">
                      <FileUploadRoot
                        alignItems="stretch"
                        maxFiles={1}
                        accept={["image/*"]}
                        onFileAccept={(value) => {
                          const file = value.files[0];
                          field.onChange(file);
                          handleImageUpload(file);
                        }}
                      >
                        <FileUploadDropzone
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          label="Drag and drop here to upload"
                          description=".png, .jpg up to 5MB"
                        />
                        {(selectedImage ||
                          teamData.image ||
                          teamData.image_url) && (
                          <Image
                            src={
                              selectedImage ||
                              (typeof teamData.image === "string"
                                ? teamData.image
                                : undefined) ||
                              teamData.image_url
                            }
                            alt="Uploaded or Existing Image"
                            objectFit="contain"
                            aspectRatio={2 / 1}
                            mt={4}
                          />
                        )}
                      </FileUploadRoot>
                      {errors.image && (
                        <Text textStyle="sm" color="red">
                          {errors.image.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <HStack justify="space-between" align="center">
                        <Text fontWeight="500" textStyle="md">
                          Show Team
                        </Text>
                        <Switch
                          checked={field.value === 1}
                          onCheckedChange={(value) => {
                            const statusValue = value.checked ? 1 : 0;
                            field.onChange(statusValue);
                            handleFieldChange("status", statusValue);
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

export default TeamsForms;
