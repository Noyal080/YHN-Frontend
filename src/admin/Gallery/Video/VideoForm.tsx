import AdminLayout from "@/admin/Layout";
import useCommonToast from "@/common/CommonToast";
import { Button } from "@/components/ui/button";
import { VideoInputTypes } from "@/utils/types";
import { Field } from "@/components/ui/field";
import {
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

const VideoForm = () => {
  const { id } = useParams();
  const { showToast } = useCommonToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [videoData, setVideoData] = useState<VideoInputTypes>({
    title: "",
    description: "",
    status: 1,
    video_url: "",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VideoInputTypes>({
    values: {
      id: videoData.id,
      title: videoData.title || "",
      description: videoData.description || "",
      video_url: videoData.video_url || "",
      status: videoData.status || 1,
    },
  });

  const handleFieldChange = (
    field: keyof VideoInputTypes,
    value: string | number | boolean | File
  ) => {
    setVideoData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = (values: VideoInputTypes) => {
    console.log(values);
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Video", link: "/admin/gallery/videos" },
        { label: `${id ? "Edit" : "Add"} Video` },
      ]}
      title={`${id ? "Edit" : "Add"} Video`}
      activeSidebarItem="Video"
    >
      <CardRoot m="auto" maxWidth="800px" mt={8} boxShadow="lg">
        <CardBody>
          <Heading mb={6}>{id ? "Edit" : "Add"} Video</Heading>
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
                      placeholder="Enter the video title"
                    />
                  </Field>
                )}
              />
              <Controller
                name="video_url"
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
                  <Field>
                    <HStack justify="space-between" align="center">
                      <Text fontWeight="500" textStyle="md">
                        Status
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
    </AdminLayout>
  );
};

export default VideoForm;
