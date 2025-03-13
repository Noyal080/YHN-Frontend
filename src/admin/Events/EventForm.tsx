import { useEffect, useState } from "react";
import AdminLayout from "../Layout";
import { EventInputs, ImageInputTypes } from "@/utils/types";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
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

interface GalleryOptions {
  label: string;
  value: number;
}

const EventForm = () => {
  //Gallery is missing
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const [options, setOptions] = useState<GalleryOptions[]>([]);
  const [pageData, setPageData] = useState<EventInputs>({
    title: "",
    description: "",
    banner_image: "",
    banner_date: "",
    banner_location: "",
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
      banner_date: pageData.banner_date || "",
      banner_location: pageData.banner_location || "",
      gallery_id: pageData.gallery_id || null,
      status: pageData.status || 1,
    },
  });

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
      try {
        const res = await axiosInstance.get(`/events/${id}`);
        setPageData(res.data);
      } catch (e) {
        console.log(e);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const onSubmit = (data: EventInputs) => {
    console.log(data);
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
                      onChange={(value) => field.onChange(value)}
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
                        // handleFieldChange("sub_title", value);
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
                      onInputChange={(inputValue) => setSearchQuery(inputValue)}
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

              <HStack>
                <Controller
                  name="banner_date"
                  control={control}
                  rules={{ required: "Date is requried" }}
                  render={({ field }) => (
                    <Field label="Date">
                      <Input
                        {...field}
                        type="date"
                        placeholder="Enter a date"
                        size={"md"}
                        onChange={(value) => field.onChange(value)}
                      />
                      {errors.banner_date && (
                        <Text textStyle="sm" color="red">
                          {errors.banner_date.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="banner_location"
                  control={control}
                  rules={{ required: "Location is requried" }}
                  render={({ field }) => (
                    <Field label="Location">
                      <Input
                        {...field}
                        placeholder="Enter location"
                        size={"md"}
                        onChange={(value) => field.onChange(value)}
                      />
                      {errors.banner_location && (
                        <Text textStyle="sm" color="red">
                          {errors.banner_location.message}
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
                      onFileAccept={async (value) => {
                        const file = value.files[0];
                        try {
                          // Compress the image and get the compressed file
                          const compressedFile = await compressImage(file);

                          // Set the preview image URL (you can remove this line if not needed)
                          setSelectedImage(URL.createObjectURL(compressedFile));

                          // Update the form state with the compressed image file
                          field.onChange(compressedFile);
                        } catch (error) {
                          console.error("Compression error:", error);
                        }
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
    </AdminLayout>
  );
};

export default EventForm;
