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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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
    banner_location_city: "",
    banner_location_state: "",
    banner_location_district: "",
    gallery_id: null,
    register_link: "",
    mail: "",
    phone: "",
    banner_start_time: "",
    banner_end_time: "",
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
      banner_location_city: pageData.banner_location_city || "",
      banner_location_state: pageData.banner_location_state || "",
      banner_location_district: pageData.banner_location_district || "",
      gallery_id: pageData.gallery_id || null,
      banner_start_time: pageData.banner_start_time || "",
      banner_end_time: pageData.banner_end_time || "",
      register_link: pageData.register_link || "",
      mail: pageData.mail || "",
      phone: pageData.phone || "",
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
        const res = await axiosInstance.get(`/events/${id}`);
        setPageData(res.data.data);
        const selectedState = res.data.data.banner_location_state;
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
      Object.entries(data).forEach(([key, value]) => {
        if (value === null && key === "gallery_id") {
          // Skip appending if gallery-id is null
          return;
        }
        if (key === "banner_image" && typeof value === "string") {
          formData.append(key, "");
        } else {
          formData.append(key, value as Blob);
        }
      });
      if (id) {
        await axiosInstance.post(`/events/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({
          description: "Events updated successfully!",
          type: "success",
        });
      } else {
        await axiosInstance.post(`/events`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({
          description: "Events added successfully",
          type: "success",
        });
      }
      navigate("/admin/events");
    } catch (e) {
      console.error(e);
      if (id) {
        showToast({
          description: "Failed to update the events",
          type: "error",
        });
      } else {
        showToast({
          description: "Failed to add the events",
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
        { label: "Events", link: "/admin/events" },
        { label: `${id ? "Edit" : "Add"} Events` },
      ]}
      title={`Events Section`}
      activeSidebarItem="Events"
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
                <Heading mb={6}>{id ? "Edit" : "Add"} Events</Heading>
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
                        value={field.value}
                        size={"md"}
                        onChange={(e) => {
                          field.onChange(e.target.value);
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
                {/* <Heading size={"lg"}> Event Location Detail </Heading> */}
                <HStack>
                  <Controller
                    name={"banner_location_state"}
                    control={control}
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
                            field.onChange(selectedOption?.value);
                            handleFieldChange(
                              "banner_location_state",
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
                        {errors.banner_location_state && (
                          <Text textStyle="sm" color="red">
                            {errors.banner_location_state.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name={"banner_location_district"}
                    control={control}
                    render={({ field }) => (
                      <Field>
                        District
                        <Select
                          {...field}
                          options={cityOptions}
                          value={cityOptions.find(
                            (option) => option.value === field.value
                          )}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption?.value || "");
                            handleFieldChange(
                              "banner_location_district",
                              selectedOption?.value || ""
                            );
                          }}
                          placeholder="Select district"
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
                        {errors.banner_location_district && (
                          <Text textStyle="sm" color="red">
                            {errors.banner_location_district.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />
                </HStack>
                <HStack w={"1/2"}>
                  <Controller
                    name="banner_location_city"
                    control={control}
                    render={({ field }) => (
                      <Field label="City">
                        <Input
                          {...field}
                          value={field.value}
                          placeholder="Enter a city"
                          size={"md"}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            handleFieldChange(
                              "banner_location_city",
                              e.target.value
                            );
                          }}
                        />
                        {errors.banner_location_city && (
                          <Text textStyle="sm" color="red">
                            {errors.banner_location_city.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />
                </HStack>
                {/* <Heading size={"lg"}> Event Time Date Details </Heading> */}
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
                <HStack>
                  <Controller
                    name="banner_start_time"
                    control={control}
                    render={({ field }) => (
                      <Field label="Start Time">
                        <Input
                          {...field}
                          type="time"
                          size={"md"}
                          onChange={(e) =>
                            handleFieldChange(
                              "banner_start_time",
                              e.target.value
                            )
                          }
                        />
                        {errors.banner_start_time && (
                          <Text textStyle="sm" color="red">
                            {errors.banner_start_time.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="banner_end_time"
                    control={control}
                    render={({ field }) => (
                      <Field label="End Time">
                        <Input
                          {...field}
                          type="time"
                          size={"md"}
                          onChange={(e) =>
                            handleFieldChange("banner_end_time", e.target.value)
                          }
                        />
                        {errors.banner_end_time && (
                          <Text textStyle="sm" color="red">
                            {errors.banner_end_time.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />
                </HStack>
                <HStack>
                  <Controller
                    name="mail"
                    control={control}
                    render={({ field }) => (
                      <Field label="Organizer Email">
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter organizer e-mail"
                          size={"md"}
                          onChange={(e) => {
                            handleFieldChange("mail", e.target.value);
                          }}
                        />
                        {errors.mail && (
                          <Text textStyle="sm" color="red">
                            {errors.mail.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Field label="Organizer Phone Number">
                        <PhoneInput
                          {...field}
                          placeholder="Enter organizer phone number"
                          country="np"
                          onlyCountries={["np"]}
                          inputStyle={{
                            width: "100%",
                            borderRadius: "0.375rem",
                            border: "1px solid #E2E8F0",
                          }}
                          onChange={(value) => {
                            handleFieldChange("phone", value);
                          }}
                        />
                        {errors.phone && (
                          <Text textStyle="sm" color="red">
                            {errors.phone.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />
                </HStack>
                <HStack>
                  <Controller
                    name="gallery_id"
                    control={control}
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
                  <Controller
                    name="register_link"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^https:\/\/[\w.-]+\.[a-z]{2,6}([/\w.-]*)*\/?$/,
                        message:
                          "Please enter a valid URL (e.g., https://example.com)",
                      },
                    }}
                    render={({ field }) => (
                      <Field label="Register Link">
                        <Input
                          {...field}
                          placeholder="Enter register link"
                          size={"md"}
                          onChange={(e) => {
                            handleFieldChange("register_link", e.target.value);
                          }}
                        />
                        {errors.register_link && (
                          <Text textStyle="sm" color="red">
                            {errors.register_link.message}
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
                  name="banner_image"
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
