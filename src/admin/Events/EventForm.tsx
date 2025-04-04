import { useEffect, useState } from "react";
import AdminLayout from "../Layout";
import { EventInputs, ImageInputTypes } from "@/utils/types";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import nepalData from "../../common/cities.json";

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
import Select from "react-select";
import useDebounce from "@/helper/debounce";
import useCommonToast from "@/common/CommonToast";
import { GalleryOptions } from "@/utils";

const EventForm = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<GalleryOptions[]>([]);
  const { showToast } = useCommonToast();
  const [pageData, setPageData] = useState<EventInputs>({
    title: "",
    description: "",
    banner_image: "",
    banner_start_date: "",
    banner_end_date: "",
    banner_location_country: "",
    banner_location_stateorprovince: "",
    banner_location_cityordistrict: "",
    gallery_id: null,
    status: 1,
  });
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EventInputs>({
    values: {
      id: pageData.id,
      title: pageData.title || "",
      description: pageData.description || "",
      banner_image: pageData.banner_image || "",
      banner_start_date: pageData.banner_start_date || "",
      banner_end_date: pageData.banner_end_date || "",
      banner_location_country: pageData.banner_location_country || "",
      banner_location_stateorprovince:
        pageData.banner_location_stateorprovince || "",
      banner_location_cityordistrict:
        pageData.banner_location_cityordistrict || "",
      gallery_id: pageData.gallery_id || null,
      status: pageData.status || 1,
    },
  });

  const stateOptions = nepalData.map((item) => ({
    value: item.state,
    label: item.state,
  }));

  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Handle state selection
  const handleStateChange = (
    selectedOption: { value: string; label: string } | null,
    onChange: (value: string | undefined) => void
  ) => {
    onChange(selectedOption?.value || "");
    setCityOptions(
      selectedOption
        ? nepalData
            .find((item) => item.state === selectedOption.value)
            ?.cities.map((city) => ({ value: city, label: city })) || []
        : []
    );
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axiosInstance.get("/gallery", {
          params: { search: debouncedSearch },
        });
        const resData = res.data.data;

        const mappedOptions = resData.data.map((item: ImageInputTypes) => ({
          value: item.id,
          label: item.title, // Ensure this field exists in your API response
        }));
        setOptions(mappedOptions);
        // setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    fetchGallery();
  }, [debouncedSearch]);

  const handleFieldChange = (
    field: keyof EventInputs,
    value: string | number | boolean | File
  ) => {
    setPageData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/newsandevents/${id}`);
        setPageData(res.data.data);
        const selectedState = res.data.data.banner_location_stateorprovince;
        if (selectedState) {
          const cities =
            nepalData
              .find((item) => item.state === selectedState)
              ?.cities.map((city) => ({ value: city, label: city })) || [];
          setCityOptions(cities);
        }
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
      handleFieldChange("banner_image", compressedFile);
    } catch (error) {
      console.error("Compression error:", error);
    }
  };

  const onSubmit = async (data: EventInputs) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("banner_location_country", "Nepal");
      Object.entries(data).forEach(([key, value]) => {
        if (key === "banner_image" && typeof value === "string") {
          formData.append(key, "");
        } else {
          formData.append(key, value as Blob);
        }
      });
      if (id) {
        await axiosInstance.post(`/newsandevents/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({
          description: "News and Event updated successfully!",
          type: "success",
        });
      } else {
        await axiosInstance.post(`/newsandevents`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({
          description: "News and Event added successfully",
          type: "success",
        });
      }
      navigate("/admin/events");
    } catch (e) {
      console.error(e);
      if (id) {
        showToast({
          description: "Failed to update the news and events",
          type: "error",
        });
      } else {
        showToast({
          description: "Failed to add the news and events",
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
        { label: "News & Events", link: "/admin/events" },
        { label: `${id ? "Edit" : "Add"} News & Events` },
      ]}
      title={`News & Events Section`}
      activeSidebarItem="News & Events"
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
            <Heading mb={6}>{id ? "Edit" : "Add"} News & Events</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
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

                <HStack w={"1/2"}>
                  <Controller
                    name="gallery_id"
                    control={control}
                    rules={{ required: "Gallery is required" }}
                    render={({ field }) => (
                      <Field label="Gallery">
                        <Select
                          {...field}
                          isClearable
                          options={options}
                          value={options.find(
                            (option) => option.value === field.value
                          )}
                          onChange={(selectedOption) =>
                            handleFieldChange(
                              "gallery_id",
                              selectedOption?.value || ""
                            )
                          }
                          placeholder="Select Gallery related to the event"
                          onInputChange={(inputValue) =>
                            setSearchQuery(inputValue)
                          }
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "100%",
                            }),
                            control: (base) => ({
                              ...base,
                              width: "100%",
                              borderColor: errors.gallery_id
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
                        {errors.gallery_id && (
                          <Text textStyle="sm" color="red">
                            {errors.gallery_id.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />
                </HStack>
                <HStack>
                  <Controller
                    name={"banner_location_stateorprovince"}
                    control={control}
                    rules={{ required: "State is required" }}
                    render={({ field }) => (
                      <Field>
                        State
                        <Select
                          {...field}
                          options={stateOptions}
                          value={stateOptions.find(
                            (option) => option.value === field.value
                          )}
                          onChange={(selectedOption) => {
                            handleStateChange(selectedOption, field.onChange);
                            handleFieldChange(
                              "banner_location_stateorprovince",
                              selectedOption?.value || ""
                            );
                          }}
                          placeholder="Select State"
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "100%",
                            }),
                            control: (base) => ({
                              ...base,
                              width: "100%",
                              borderColor: errors.gallery_id
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
                        {errors.banner_location_stateorprovince && (
                          <Text textStyle="sm" color="red">
                            {errors.banner_location_stateorprovince.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name={"banner_location_cityordistrict"}
                    control={control}
                    rules={{ required: "City is required" }}
                    render={({ field }) => (
                      <Field>
                        City
                        <Select
                          {...field}
                          options={cityOptions}
                          value={cityOptions.find(
                            (option) => option.value === field.value
                          )}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption?.value || "");
                            handleFieldChange(
                              "banner_location_cityordistrict",
                              selectedOption?.value || ""
                            );
                          }}
                          placeholder="Select City"
                          isDisabled={cityOptions.length === 0}
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "100%",
                            }),
                            control: (base) => ({
                              ...base,
                              width: "100%",
                              borderColor: errors.gallery_id
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
                      </Field>
                    )}
                  />
                  {errors.banner_location_cityordistrict && (
                    <Text textStyle="sm" color="red">
                      {errors.banner_location_cityordistrict.message}
                    </Text>
                  )}
                </HStack>
                <HStack>
                  <Controller
                    name="banner_start_date"
                    control={control}
                    rules={{ required: "Start Date is requried" }}
                    render={({ field }) => (
                      <Field label="Start Date">
                        <Input
                          {...field}
                          type="date"
                          size={"md"}
                          onChange={(e) =>
                            handleFieldChange(
                              "banner_start_date",
                              e.target.value
                            )
                          }
                        />
                        {errors.banner_start_date && (
                          <Text textStyle="sm" color="red">
                            {errors.banner_start_date.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="banner_end_date"
                    control={control}
                    rules={{ required: "End Date is requried" }}
                    render={({ field }) => (
                      <Field label="End Date">
                        <Input
                          {...field}
                          type="date"
                          size={"md"}
                          onChange={(e) =>
                            handleFieldChange("banner_end_date", e.target.value)
                          }
                        />
                        {errors.banner_end_date && (
                          <Text textStyle="sm" color="red">
                            {errors.banner_end_date.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />
                </HStack>

                <Controller
                  name="banner_image"
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
                        {(selectedImage || pageData.banner_image) && (
                          <Image
                            src={
                              selectedImage ||
                              (typeof pageData.banner_image === "string"
                                ? pageData.banner_image
                                : undefined)
                            }
                            alt="Uploaded or Existing Image"
                            objectFit="contain"
                            aspectRatio={2 / 1}
                            mt={4}
                          />
                        )}
                      </FileUploadRoot>
                      {errors.banner_image && (
                        <Text textStyle="sm" color="red">
                          {errors.banner_image.message}
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
                          Show Events
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

export default EventForm;
