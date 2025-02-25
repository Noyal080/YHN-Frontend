import AdminLayout from "@/admin/Layout";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  FileUploadDropzone,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { compressMultiImage } from "@/utils/imageCompressor";
import { Gallery, ImageInputTypes } from "@/utils/types";
import {
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Image,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const ImageForm = () => {
  const { id } = useParams();
  const [imageData, setImageData] = useState<ImageInputTypes>({
    title: "",
    images: [],
    status: 1,
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ImageInputTypes>({});

  const handleFieldChange = (
    field: keyof ImageInputTypes,
    value: string | number | boolean | File | Gallery[]
  ) => {
    console.log("here");

    setImageData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (files: File[]) => {
    try {
      console.log("entered");

      const compressionPromises = files.map((file) => compressMultiImage(file));
      const compressedFiles = await Promise.all(compressionPromises);

      // Create Gallery objects from compressed files
      const newGalleryItems: Gallery[] = compressedFiles.map((file, index) => ({
        id: Date.now() + index, // Temporary ID, replace with actual ID from backend if needed
        imageUrl: file,
      }));

      // Create preview URLs for all compressed images
      const newPreviewUrls = compressedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      // Update state
      setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
      handleFieldChange("images", [...imageData.images, ...newGalleryItems]);
    } catch (error) {
      console.error("Compression error:", error);
    }
  };

  const onSubmit = async (data: ImageInputTypes) => {
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
                rules={{ required: "Title is required" }}
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
                          ...(imageData.images as Gallery[]),
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
                    {previewImages.length > 0 && (
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

export default ImageForm;
