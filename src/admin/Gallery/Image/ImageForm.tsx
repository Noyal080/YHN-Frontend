import AdminLayout from "@/admin/Layout";
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
  } = useForm<ImageType>({});

  const handleFieldChange = (
    field: keyof ImageType,
    value: string | number | boolean | File | Gallery[]
  ) => {
    setImageData((prev) => ({ ...prev, [field]: value }));
  };

  console.log(imageData, previewImages);

  const handleImageUpload = async (files: File[]) => {
    try {
      setLoading(true); // Start loading state

      const compressionPromises = files.map((file) => compressMultiImage(file));
      const compressedFiles = await Promise.all(compressionPromises);

      const newPreviewUrls = compressedFiles.map((file) =>
        URL.createObjectURL(file as Blob)
      );

      setPreviewImages((prev) => {
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

  const onSubmit = (data: ImageType) => {
    console.log("here");
    console.log(data);
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
                      <VStack mt={4}>
                        <Spinner size="lg" color="blue.500" />
                        <Text>Uploading...</Text>
                      </VStack>
                    ) : (
                      previewImages.length > 0 && (
                        <SimpleGrid columns={5} gap={4} mt={4}>
                          {previewImages.map((src, index) => (
                            <Image
                              key={index}
                              src={src}
                              alt={`Preview ${index + 1}`}
                              objectFit="cover"
                              height="150px"
                              borderRadius="md"
                            />
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
