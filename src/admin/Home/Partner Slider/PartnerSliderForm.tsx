import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  FileUploadDropzone,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { Switch } from "@/components/ui/switch";
import { compressImage } from "@/helper/imageCompressor";
import { PartnerSliderType } from "@/utils/types";
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

const PartnerSliderForm = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useCommonToast();
  const [sliderData, setSliderData] = useState<PartnerSliderType>({
    image: "",
    title: "",
    link: "",
    status: 1,
  });
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PartnerSliderType>({
    values: {
      id: sliderData.id,
      title: sliderData.title,
      image: sliderData.image,
      link: sliderData.link,
      status: sliderData.status,
    },
  });
  // const token = localStorage.getItem("accessToken");
  // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const fetchSliderData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/partner/${id}`);
        setSliderData(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchSliderData();
    }
  }, [id]);

  const handleFieldChange = (
    field: keyof PartnerSliderType,
    value: string | number | boolean | File
  ) => {
    setSliderData((prev) => ({ ...prev, [field]: value }));
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

  const onSubmit = async (sliderData: PartnerSliderType) => {
    setIsLoading(true);
    try {
      if (id) {
        const formData = new FormData();
        formData.append("title", sliderData.title);
        formData.append("status", sliderData.status.toString());

        if (sliderData.image instanceof File) {
          formData.append("image", sliderData.image);
        }
        await axiosInstance.post(`/partner/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({
          description: "Slider updated successfully!",
          type: "success",
        });
      } else {
        const res = await axiosInstance.post(`/partner`, sliderData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({
          description: res.data.message,
          type: "success",
        });
      }

      navigate("/admin/partners");
    } catch (e) {
      console.error(e);
      showToast({
        description: id
          ? "Failed to update the slider"
          : "Failed to add the slider",
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
        { label: "Partner Slider", link: "/admin/partners" },
        { label: id ? "Edit Partner" : "Add Partner" },
      ]}
      activeSidebarItem="Partner Slider"
      title={`${id ? "Edit" : "Add"} Partner Slider`}
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
            <Heading mb={6}>
              {id ? "Edit Partner Slider" : "Add Partner Slider"}
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack gap={4} align="stretch">
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Partner Name is required" }}
                  render={({ field }) => (
                    <Field label="Parnter Name">
                      <Input
                        {...field}
                        placeholder="Enter partner name"
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
                  name="link"
                  control={control}
                  rules={{
                    required: "Link is required",
                    pattern: {
                      value: /^https:\/\/[\w.-]+\.[a-z]{2,6}([/\w.-]*)*\/?$/,
                      message:
                        "Please enter a valid URL (e.g., https://example.com)",
                    },
                  }}
                  render={({ field }) => (
                    <Field label="Link">
                      <Input
                        {...field}
                        placeholder="Example: https://example.com"
                        size="md"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleFieldChange("link", e.target.value);
                        }}
                      />
                      {errors.link && (
                        <Text textStyle="sm" color="red">
                          {errors.link.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="image"
                  control={control}
                  rules={{ required: "Image URL is required" }}
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
                        {(selectedImage || sliderData.image) && (
                          <Image
                            src={
                              selectedImage ||
                              (typeof sliderData.image === "string"
                                ? sliderData.image
                                : undefined)
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
                          Show Image
                        </Text>
                        <Switch
                          checked={field.value === 1}
                          onCheckedChange={(value) => {
                            const numericValue = value.checked ? 1 : 0; // Convert `true`/`false` to `1`/`0`
                            field.onChange(numericValue);
                            handleFieldChange("status", numericValue);
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

export default PartnerSliderForm;
