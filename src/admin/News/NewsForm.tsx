import { useEffect, useState } from "react";
import AdminLayout from "../Layout";
import { NewsInputType } from "@/utils/types";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";

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
import { Field } from "@/components/ui/field";
import CommonEditor from "@/common/Editor";
import {
  FileUploadDropzone,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { compressImage } from "@/helper/imageCompressor";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/api/axios";
import { Switch } from "@/components/ui/switch";
import useCommonToast from "@/common/CommonToast";
import "react-phone-input-2/lib/style.css";

const NewsForm = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useCommonToast();
  const [pageData, setPageData] = useState<NewsInputType>({
    title: "",
    description: "",
    image: "",
    publish_date: "",
    status: 1,
  });
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewsInputType>({
    values: {
      id: pageData.id,
      title: pageData.title || "",
      description: pageData.description || "",
      image: pageData.image || "",
      publish_date: pageData.publish_date || "",
      status: pageData.status || 1,
    },
  });

  const handleFieldChange = (
    field: keyof NewsInputType,
    value: string | number | boolean | File
  ) => {
    setPageData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/news/${id}`);
        setPageData(res.data.data.news);
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

  const handleImageUpload = async (file: File) => {
    try {
      const compressedFile = await compressImage(file);
      setSelectedImage(URL.createObjectURL(compressedFile));
      handleFieldChange("image", compressedFile);
    } catch (error) {
      console.error("Compression error:", error);
    }
  };

  const onSubmit = async (data: NewsInputType) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === null && key === "gallery_id") {
          // Skip appending if gallery-id is null
          return;
        }
        if (key === "image" && typeof value === "string") {
          formData.append(key, "");
        } else {
          formData.append(key, value as Blob);
        }
      });
      if (id) {
        await axiosInstance.post(`/news/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({
          description: "News updated successfully!",
          type: "success",
        });
      } else {
        await axiosInstance.post(`/news`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({
          description: "News added successfully",
          type: "success",
        });
      }
      navigate("/admin/news");
    } catch (e) {
      console.error(e);
      if (id) {
        showToast({
          description: "Failed to update the news",
          type: "error",
        });
      } else {
        showToast({
          description: "Failed to add the news",
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "News", link: "/admin/news" },
        { label: `${id ? "Edit" : "Add"} News` },
      ]}
      title={`News Section`}
      activeSidebarItem="News"
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
              <HStack justifyContent="space-between" align="center">
                <Heading mb={6}>{id ? "Edit" : "Add"} News</Heading>
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
                          const numericValue = value.checked ? 1 : 0; // Convert `true`/`false` to `1`/`0`
                          field.onChange(numericValue);
                          handleFieldChange("status", numericValue);
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
                        onChange={(e) => {
                          handleFieldChange("title", e.target.value);
                        }}
                      />
                      {errors.title && (
                        <Text textStyle="sm" color="red">
                          {errors.title.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />

                <HStack>
                  <Controller
                    name="publish_date"
                    control={control}
                    rules={{ required: "Publish Date is requried" }}
                    render={({ field }) => (
                      <Field label="Publish Date">
                        <Input
                          {...field}
                          type="date"
                          size={"md"}
                          onChange={(e) =>
                            handleFieldChange("publish_date", e.target.value)
                          }
                        />
                        {errors.publish_date && (
                          <Text textStyle="sm" color="red">
                            {errors.publish_date.message}
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
                <Controller
                  name="image"
                  control={control}
                  rules={{ required: "Banner Image is required" }}
                  render={({ field }) => (
                    <Field label="Banner Image">
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
                        {(selectedImage || pageData.image) && (
                          <Image
                            src={
                              selectedImage ||
                              (typeof pageData.image === "string"
                                ? pageData.image
                                : undefined)
                            }
                            alt="Uploaded or Existing Image"
                            objectFit="contain"
                            aspectRatio={2 / 1}
                            mt={4}
                          />
                        )}
                        <FileUploadDropzone
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          label="Drag and drop here to upload"
                          description=".png, .jpg up to 5MB"
                        />
                      </FileUploadRoot>
                      {errors.image && (
                        <Text textStyle="sm" color="red">
                          {errors.image.message}
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

export default NewsForm;
