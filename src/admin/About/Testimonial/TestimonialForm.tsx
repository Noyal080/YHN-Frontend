import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import CommonEditor from "@/common/Editor";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { TestimonialInput } from "@/utils/types";
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
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { compressImage } from "@/helper/imageCompressor";
import { FiPlus } from "react-icons/fi";

// interface DesignationOptions {
//   label: string;
//   value: number;
// }

const TestimonialForm = () => {
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { showToast } = useCommonToast();
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);
  // const [designationOption, setDesignationOption] = useState<
  //   DesignationOptions[]
  // >([]);
  const navigate = useNavigate();
  const [testimonialData, setTestimonialData] = useState<TestimonialInput>({
    name: "",
    description: "",

    category: "",
    description2: "",
    image: "",
    status: 1,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TestimonialInput>({
    values: {
      id: testimonialData.id,
      name: testimonialData.name || "",
      description: testimonialData.description || "",
      image: testimonialData.image || "",
      description2: testimonialData.description2 || "",
      category: testimonialData.category || "",
      status: testimonialData.status || 1,
    },
  });

  useEffect(() => {
    const fetchTestimonialData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/testimonials/${id}`);
        const result = res.data.data.data;
        setTestimonialData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchTestimonialData();
    }
  }, [id]);

  // useEffect(() => {
  //   const fetchDesignation = async () => {
  //     try {
  //       const res = await axiosInstance.get("/designations");
  //       const result = res.data.data.data;
  //       setDesignationOption(
  //         result.map((position: { name: string; id: number }) => ({
  //           label: position.name,
  //           value: position.id,
  //         }))
  //       );
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  //   fetchDesignation();
  // }, []);

  const handleFieldChange = (
    field: keyof TestimonialInput,
    value: string | number | boolean | File | null
  ) => {
    setTestimonialData((prev) => ({ ...prev, [field]: value }));
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

  const onSubmit = async (data: TestimonialInput) => {
    setIsLoading(true);
    try {
      const submissionData = { ...data };
      const formData = new FormData();

      // Check if the position is a new one (a string value)
      // if (typeof submissionData.designation_id === "string") {
      //   // Create new position first
      //   const positionResponse = await axiosInstance.post("/designations", {
      //     name: submissionData.designation_id,
      //   });

      //   // Extract the new position ID from the response
      //   const newPositionId = positionResponse.data.data.id;
      //   // Update the submission data with the new position ID
      //   submissionData.designation_id = newPositionId;
      // }

      Object.entries(submissionData).forEach(([key, value]) => {
        if (key === "image" && typeof value === "string") {
          formData.append(key, "");
        } else {
          formData.append(key, value as Blob);
        }
      });

      if (id) {
        await axiosInstance.post(`/testimonials/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({
          description: "Testimonial updated successfully",
          type: "success",
        });
        navigate("/admin/testimonials");
      } else {
        await axiosInstance.post("/testimonials", submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({
          description: "Testimonial added successfully",
          type: "success",
        });
        navigate("/admin/testimonials");
      }
    } catch (e) {
      console.error(e);
      // showToast({
      //   description: id
      //     ? `Failed to update the Testimonial`
      //     : "Failed to add Testimonial",
      //   type: "error",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Testimonial", link: "/admin/testimonials" },
        { label: `${id ? "Edit" : "Add"} Testimonial` },
      ]}
      activeSidebarItem="Testimonial"
      title={`${id ? "Edit" : "Add"} Testimonial`}
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
                  {id ? "Edit Testimonial" : "Add Testimonial"}
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
                          handleFieldChange("status", statusValue);
                        }}
                        color="black"
                        colorPalette="green"
                      />
                    </HStack>
                  )}
                />
              </HStack>
              <VStack gap={4} align="stretch">
                <HStack gap={6} align="start">
                  <Controller
                    name="image"
                    control={control}
                    rules={{ required: "Image is required" }}
                    render={({ field }) => (
                      <Box position="relative">
                        {!field.value && !selectedImage ? (
                          <Box
                            width="250px"
                            height="250px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            border="2px dashed gray"
                            rounded="full"
                            cursor="pointer"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <FiPlus size={30} color="gray" />
                          </Box>
                        ) : (
                          <Image
                            src={
                              selectedImage ||
                              (typeof testimonialData.image === "string"
                                ? testimonialData.image
                                : undefined)
                            }
                            alt="Uploaded or Existing Image"
                            boxSize="250px"
                            rounded="full"
                            objectFit="cover"
                            cursor="pointer"
                            onClick={() => fileInputRef.current?.click()}
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          ref={fileInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                              handleImageUpload(file);
                            }
                          }}
                        />
                      </Box>
                    )}
                  />
                  <VStack gap={4} flex="1">
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: "Testimonee Name is required" }}
                      render={({ field }) => (
                        <Field label="Testimonee Name">
                          <Input
                            {...field}
                            placeholder="Enter testimonee name"
                            size="md"
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

                    <Controller
                      name="description2"
                      control={control}
                      rules={{ required: "Designation is required" }}
                      render={({ field }) => (
                        <Field label=" Designation">
                          {/* <CreatableSelect
                            {...field}
                            placeholder="Create or select designation"
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            options={designationOption as any}
                            value={
                              // Find the matching option object if field.value is a number
                              typeof field.value === "number"
                                ? designationOption.find(
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
                            onChange={(selectedOption) => {
                              // Update both React Hook Form state and local state
                              field.onChange(selectedOption?.value || null);
                              handleFieldChange(
                                "designation_id",
                                selectedOption?.value || null
                              );
                            }}
                            // onBlur={field.onBlur}
                            styles={{
                              container: (base) => ({
                                ...base,
                                width: "100%",
                                zIndex: 1000,
                              }),
                              control: (base) => ({
                                ...base,
                                width: "100%",
                                borderColor: errors.designation_id
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
                          {errors.designation_id && (
                            <Text textStyle="sm" color="red">
                              {errors.designation_id.message}
                            </Text>
                          )} */}
                          <Input
                            {...field}
                            placeholder="Enter designation name"
                            size="md"
                            onChange={(e) =>
                              handleFieldChange("description2", e.target.value)
                            }
                          />
                          {errors.description2 && (
                            <Text textStyle="sm" color="red">
                              {errors.description2.message}
                            </Text>
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <Field label="Organisation (Optional) ">
                          <Input
                            {...field}
                            placeholder="Enter organisation name"
                            size="md"
                            onChange={(e) =>
                              handleFieldChange("category", e.target.value)
                            }
                          />
                          {errors.category && (
                            <Text textStyle="sm" color="red">
                              {errors.category.message}
                            </Text>
                          )}
                        </Field>
                      )}
                    />
                  </VStack>
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
      </Box>
    </AdminLayout>
  );
};

export default TestimonialForm;
