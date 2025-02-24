import AdminLayout from "@/admin/Layout";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  FileUploadDropzone,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { Switch } from "@/components/ui/switch";
import { SliderInput } from "@/utils/types";
import {
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import CommonEditor from "@/common/Editor";
import { compressImage } from "@/utils/imageCompressor";
const SliderForm = () => {
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const { showToast } = useCommonToast();
  const [sliderData, setSliderData] = useState<SliderInput>({
    title: "",
    sub_title: "",
    priority_order: 1,
    image: "",
    status: 1,
    button_title: "",
    button_route: "",
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SliderInput>({
    values: {
      id: sliderData.id,
      title: sliderData.title || "",
      sub_title: sliderData.sub_title || "",
      priority_order: sliderData.priority_order || 1,
      image: sliderData.image || "",
      status: sliderData.status || 1,
      button_title: sliderData.button_title || "",
      button_route: sliderData.button_route || "",
    },
  });
  const { id } = useParams();
  const token = localStorage.getItem("accessToken");

  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const res = await axiosInstance.get(`/sliders/${id}`);
        setSliderData(res.data.data);
      } catch (e) {
        console.error(e);
      }
    };
    if (id) {
      fetchSliderData();
    }
  }, [id]);

  const handleFieldChange = (
    field: keyof SliderInput,
    value: string | number | boolean | File
  ) => {
    setSliderData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (sliderData: SliderInput) => {
    try {
      if (id) {
        await axiosInstance.post(`/sliders/${id}`, sliderData);
        showToast({
          description: "Slider updated successfully!",
          type: "success",
        });
      } else {
        await axiosInstance.post(`/sliders`, sliderData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({
          description: " Slider added successfully",
          type: "success",
        });
      }
      navigate("/admin/sliders");
    } catch (e) {
      console.error(e);
      if (id) {
        showToast({
          description: "Failed to update the slider",
          type: "error",
        });
      } else {
        showToast({
          description: "Failed to add the slider",
          type: "error",
        });
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
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

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Sliders", link: "/admin/sliders" },
        { label: id ? "Edit Slider" : "Add Slider" },
      ]}
      title={`${id ? "Edit" : "Add"} Slider Section`}
      activeSidebarItem="Slider"
    >
      <CardRoot m="auto" maxWidth="800px" mt={8} boxShadow="lg">
        <CardBody>
          <Heading mb={6}>{id ? "Edit Slider" : "Add Slider"}</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} align="stretch">
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <Field label="Title">
                    <Input
                      {...field}
                      placeholder="Enter title"
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
                name="sub_title"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <Field label="Description">
                    <CommonEditor
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        handleFieldChange("sub_title", value);
                      }}
                    />

                    {errors.sub_title && (
                      <Text textStyle="sm" color="red">
                        {errors.sub_title.message}
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
                      onFileAccept={async (value) => {
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
                name="priority_order"
                control={control}
                rules={{ required: "Priority order is required" }}
                render={({ field }) => (
                  <Field label="Priority Order">
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      placeholder="Enter priority order"
                      size="md"
                      onChange={(e) =>
                        handleFieldChange(
                          "priority_order",
                          Number(e.target.value)
                        )
                      }
                    />
                    {errors.priority_order && (
                      <Text textStyle="sm" color="red">
                        {errors.priority_order.message}
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
                        Pinned Image
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

              <Button
                variant="outline"
                colorScheme="blue"
                onClick={() => setShowButtons(!showButtons)}
                mt={4}
              >
                {showButtons ? "Hide Buttons" : "Add/Show Buttons"}
              </Button>

              {showButtons && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={buttonVariants}
                >
                  <HStack gap={4} align="flex-start">
                    <Controller
                      name="button_title"
                      control={control}
                      render={({ field }) => (
                        <Field label="Button Title">
                          <Input
                            {...field}
                            placeholder="Enter button title"
                            size="md"
                            onChange={(e) =>
                              handleFieldChange("button_title", e.target.value)
                            }
                          />
                          {errors.button_title && (
                            <Text textStyle="sm" color="red">
                              {errors.button_title.message}
                            </Text>
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="button_route"
                      control={control}
                      render={({ field }) => (
                        <Field label="Button Route">
                          <Input
                            {...field}
                            placeholder="Enter button route"
                            size="md"
                            onChange={(e) =>
                              handleFieldChange("button_route", e.target.value)
                            }
                          />
                          {errors.button_route && (
                            <Text textStyle="sm" color="red">
                              {errors.button_route.message}
                            </Text>
                          )}
                        </Field>
                      )}
                    />
                  </HStack>
                </motion.div>
              )}
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

export default SliderForm;
