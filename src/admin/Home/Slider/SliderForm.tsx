import AdminLayout from "@/admin/Layout";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  FileUploadDropzone,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { Switch } from "@/components/ui/switch";
import { SliderButton, SliderInput } from "@/utils/types";
import {
  Box,
  CardBody,
  CardRoot,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import { compressImage } from "@/helper/imageCompressor";
import { FiTrash } from "react-icons/fi";
const SliderForm = () => {
  const [isLoading, setIsLoading] = useState(false);
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
    buttons: [],
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
      buttons: sliderData.buttons || [],
    },
  });
  const { id } = useParams();
  // const token = localStorage.getItem("accessToken");

  // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const fetchSliderData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/sliders/${id}`);
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
    field: keyof SliderInput,
    value: string | number | boolean | File
  ) => {
    setSliderData((prev) => ({ ...prev, [field]: value }));
  };

  const handleButtonChange = (
    index: number,
    field: keyof SliderButton,
    value: string
  ) => {
    setSliderData((prev) => {
      const newButtons = [...(prev.buttons || [])];
      newButtons[index] = { ...newButtons[index], [field]: value };
      return { ...prev, buttons: newButtons };
    });
  };

  const addNewButton = () => {
    if ((sliderData?.buttons ?? []).length < 2) {
      setSliderData((prev) => ({
        ...prev,
        buttons: [...(prev.buttons || []), { title: "", route: "" }],
      }));
    }
  };

  const removeButton = (index: number) => {
    setSliderData((prev) => ({
      ...prev,
      buttons: (prev.buttons ?? []).filter((_, i) => i !== index),
    }));
  };

  const onSubmit = async (sliderData: SliderInput) => {
    setIsLoading(true);
    try {
      const data = new FormData();
      Object.entries(sliderData).forEach(([key, value]) => {
        if (key === "image" && typeof value === "string") {
          data.append(key, "");
        } else {
          data.append(key, value as Blob);
        }
      });

      if (id) {
        await axiosInstance.post(`/sliders/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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
    } finally {
      setIsLoading(false);
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: -20, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      height: 0,
      transition: { duration: 0.3, ease: "easeOut" },
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
      activeSidebarItem="Sliders"
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
                  rules={{ required: "Sub Title is required" }}
                  render={({ field }) => (
                    <Field label="Sub Title">
                      <Textarea
                        height={"100px"}
                        resize={"vertical"}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleFieldChange("sub_title", e.target.value);
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

                {/* <Button
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
                                handleFieldChange(
                                  "button_title",
                                  e.target.value
                                )
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
                                handleFieldChange(
                                  "button_route",
                                  e.target.value
                                )
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
                )} */}

                <HStack justify="space-between" align="center" mt={4}>
                  <Text fontWeight="bold">Buttons </Text>
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    onClick={addNewButton}
                    disabled={
                      sliderData.buttons && sliderData.buttons.length >= 2
                    }
                  >
                    Add Button
                  </Button>
                </HStack>

                {sliderData.buttons?.map((button, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={buttonVariants}
                  >
                    <HStack gap={4} align="flex-end">
                      <Field label={`Button ${index + 1} Title`}>
                        <Input
                          value={button.title}
                          placeholder="Enter button title"
                          size="md"
                          onChange={(e) =>
                            handleButtonChange(index, "title", e.target.value)
                          }
                        />
                      </Field>

                      <Field label={`Button ${index + 1} Route`}>
                        <Input
                          value={button.route}
                          placeholder="Enter button route"
                          size="md"
                          onChange={(e) =>
                            handleButtonChange(index, "route", e.target.value)
                          }
                        />
                      </Field>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <IconButton
                          aria-label={`Remove button ${index + 1}`}
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => removeButton(index)}
                        >
                          <FiTrash />
                        </IconButton>
                      </motion.div>
                    </HStack>
                  </motion.div>
                ))}
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

export default SliderForm;
