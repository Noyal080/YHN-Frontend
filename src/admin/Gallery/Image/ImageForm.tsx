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
import { compressMultiImage } from "@/utils/imageCompressor";
import { Gallery, ImageType } from "@/utils/types";
import {
  Box,
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Image,
  Input,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const ImageForm = () => {
  const { id } = useParams();
  const { showToast } = useCommonToast();
  const [imageData, setImageData] = useState<ImageType>({
    title: "",
    images: [],
    status: 1,
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ImageType>({
    values: {
      id: imageData.id,
      title: imageData.title || "",
      images: imageData.images || [],
      status: imageData.status || 1,
    },
  });

  const handleFieldChange = (
    field: keyof ImageType,
    value: string | number | boolean | File | Gallery[]
  ) => {
    setImageData((prev) => ({ ...prev, [field]: value }));
  };

  // const token = localStorage.getItem("accessToken");
  // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const handleImageUpload = async (files: File[]) => {
    try {
      setLoading(true); // Start loading state

      const compressionPromises = files.map((file) => compressMultiImage(file));
      const compressedFiles = await Promise.all(compressionPromises);

      const newPreviewUrls = compressedFiles.map((file) =>
        URL.createObjectURL(file as Blob)
      );

      setPreviewImages(() => {
        const uniqueUrls = [...newPreviewUrls]; // Prevent duplicates
        return Array.from(uniqueUrls);
      });

      setImageData((prev) => {
        const uniqueImages = [...prev.images];

        compressedFiles.forEach((file) => {
          if (!uniqueImages.some((img) => img.name === file.name)) {
            uniqueImages.push(file);
          }
        });

        return { ...prev, images: uniqueImages };
      });
    } catch (error) {
      console.error("Compression error:", error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  const onSubmit = async (data: ImageType) => {
    try {
      await axiosInstance.post("/gallery", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast({
        type: "success",
        description: "Images added succesfuly",
      });
      navigate("/admin/gallery/images");
    } catch (e) {
      console.log(e);
      showToast({ type: "error", description: "Error while adding data" });
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Image", link: "/admin/gallery/images" },
        { label: `${id ? "Edit" : "Add"} Image` },
      ]}
      title={`${id ? "Edit" : "Add"} Image`}
      activeSidebarItem="Image"
    >
      <CardRoot m="auto" maxWidth="800px" mt={8} boxShadow="lg">
        <CardBody>
          <Heading mb={6}>Add Images</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} align={"stretch"}>
              <Controller
                name="title"
                rules={{ required: "Title is required" }}
                control={control}
                render={({ field }) => (
                  <Field label="Title">
                    <Input
                      {...field}
                      size="md"
                      onChange={(e) =>
                        handleFieldChange("title", e.target.value)
                      }
                      placeholder="Enter the gallery title"
                    />
                  </Field>
                )}
              />
              <Controller
                name="images"
                control={control}
                rules={{ required: "Image URL is required" }}
                render={({ field }) => (
                  <Field label="Upload Images">
                    <FileUploadRoot
                      alignItems="stretch"
                      maxFiles={20}
                      accept={["image/*"]}
                      onFileAccept={(value) => {
                        handleImageUpload(value.files);
                        field.onChange([
                          ...(imageData.images as File[]),
                          ...value.files,
                        ]);
                      }}
                    >
                      <FileUploadDropzone
                        label="Drag and drop images here to upload"
                        description=".png, .jpg up to 5MB each"
                      />
                    </FileUploadRoot>
                    {errors.images && (
                      <Text textStyle="sm" color="red" mt={2}>
                        {errors.images.message}
                      </Text>
                    )}
                    {loading ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="200px"
                        width="100%"
                        bg="gray.50"
                        borderRadius="md"
                        mt={4}
                      >
                        <VStack gap={4}>
                          <Spinner
                            size="lg"
                            color="blue.500"
                            borderWidth="4px"
                          />
                          <Text fontSize="md" color="gray.600">
                            Uploading...
                          </Text>
                        </VStack>
                      </Box>
                    ) : (
                      previewImages.length > 0 && (
                        <SimpleGrid
                          columns={[2, 3, 5]} // Responsive columns
                          gap={4}
                          mt={4}
                        >
                          {previewImages.map((src, index) => (
                            <Box
                              key={index}
                              position="relative"
                              borderRadius="md"
                              overflow="hidden"
                              bg="gray.100"
                              _hover={{
                                transform: "scale(1.02)",
                                transition: "transform 0.2s",
                              }}
                            >
                              <Image
                                src={src}
                                alt={`Preview ${index + 1}`}
                                objectFit="cover"
                                height="150px"
                                width="100%"
                              />
                            </Box>
                          ))}
                        </SimpleGrid>
                      )
                    )}
                  </Field>
                )}
              />
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Field label="Status">
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

export default ImageForm;
