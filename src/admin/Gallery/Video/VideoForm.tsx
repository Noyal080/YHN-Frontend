import AdminLayout from "@/admin/Layout";
import useCommonToast from "@/common/CommonToast";
import { Button } from "@/components/ui/button";
import { VideoInputTypes } from "@/utils/types";
import { Field } from "@/components/ui/field";
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
import { axiosInstance } from "@/api/axios";
import { Switch } from "@/components/ui/switch";

const VideoForm = () => {
  const { id } = useParams();
  const { showToast } = useCommonToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoInputTypes>({
    title: "",
    video_url: "",
    status: 1,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VideoInputTypes>({
    values: {
      id: videoData.id,
      title: videoData.title || "",
      video_url: videoData.video_url || "",
      status: videoData.status || 1,
    },
  });

  useEffect(() => {
    const fetchVideoData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/video/${id}`);
        setVideoData(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchVideoData();
    }
  }, [id]);

  const handleFieldChange = (
    field: keyof VideoInputTypes,
    value: string | number | boolean | File
  ) => {
    setVideoData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (videoData: VideoInputTypes) => {
    setIsLoading(true);
    try {
      if (id) {
        await axiosInstance.post(`/video/${id}`, videoData);
        showToast({
          description: "Video updated successfully!",
          type: "success",
        });
      } else {
        await axiosInstance.post(`/video`, videoData);
        showToast({
          description: " Video added successfully",
          type: "success",
        });
      }
      navigate("/admin/gallery/videos");
    } catch (e) {
      console.error(e);
      // if (id) {
      //   showToast({
      //     description: "Failed to update the video",
      //     type: "error",
      //   });
      // } else {
      //   showToast({
      //     description: "Failed to add the video",
      //     type: "error",
      //   });
      // }
    } finally {
      setIsLoading(false);
    }
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
                <Heading mb={6}>{id ? "Edit" : "Add"} Video</Heading>
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
                      {errors.title && (
                        <Text textStyle="sm" color="red">
                          {errors.title.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="video_url"
                  control={control}
                  rules={{ required: "Video URL is required" }}
                  render={({ field }) => (
                    <Field label="Video Link">
                      <Input
                        {...field}
                        size="md"
                        onChange={(e) =>
                          handleFieldChange("video_url", e.target.value)
                        }
                        placeholder="Enter the video url"
                      />
                      {errors.video_url && (
                        <Text textStyle="sm" color="red">
                          {errors.video_url.message}
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

export default VideoForm;
