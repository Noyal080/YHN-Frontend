import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../Layout";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { ImageInputTypes, OurWorkType } from "@/utils/types";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import CommonEditor from "@/common/Editor";
import { Button } from "@/components/ui/button";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { compressImage } from "@/helper/imageCompressor";
import { axiosInstance } from "@/api/axios";
import { GalleryOptions } from "@/utils";
import useDebounce from "@/helper/debounce";
import { Switch } from "@/components/ui/switch";
import useCommonToast from "@/common/CommonToast";
import nepalData from "../../common/cities.json";
import { CiFileOn } from "react-icons/ci";

interface SectorOptions {
  label: string;
  value: number;
}

const WorkForms = () => {
  //Gallery is missing
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const [options, setOptions] = useState<GalleryOptions[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sectorOptions, setSectorOptions] = useState<SectorOptions[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { showToast } = useCommonToast();
  const [pageData, setPageData] = useState<OurWorkType>({
    title: "",
    sector_id: null,
    description: "",
    banner_image: "",
    banner_start_date: "",
    banner_end_date: "",
    banner_location_country: "",
    banner_location_stateorprovince: "",
    banner_location_cityordistrict: "",
    gallery_id: null,
    objectives: "",
    activities: "",
    upload_pdf: "",
    status: 1,
  });
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OurWorkType>({
    values: {
      id: pageData.id,
      title: pageData.title || "",
      sector_id: pageData.sector_id,
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
      objectives: pageData.objectives || "",
      activities: pageData.activities || "",
      upload_pdf: pageData.upload_pdf || null,
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
    const fetchGalleryandSectors = async () => {
      try {
        const res = await axiosInstance.get("/gallery", {
          params: { search: debouncedSearch },
        });
        const sectorRes = await axiosInstance.get("/sectors");

        const resData = res.data.data;
        const mappedOptions = resData.data.map((item: ImageInputTypes) => ({
          value: item.id,
          label: item.title, // Ensure this field exists in your API response
        }));
        setOptions(mappedOptions);
        const result = sectorRes.data.data.data;
        setSectorOptions(
          result.map((sector: { name: string; id: number }) => ({
            label: sector.name,
            value: sector.id,
          }))
        );

        // setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    fetchGalleryandSectors();
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/ourwork/${id}`);
        const result = res.data.data;
        setPageData(result);
        const selectedState = result.banner_location_stateorprovince;
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

  const onSubmit = async (data: OurWorkType) => {
    setIsLoading(true);
    try {
      const submissionData = { ...data };
      if (submissionData.banner_location_country) {
        submissionData.banner_location_country += ", Nepal";
      } else {
        submissionData.banner_location_country = "Nepal";
      }
      if (typeof submissionData.sector_id === "string") {
        // Create new position first
        const positionResponse = await axiosInstance.post("/sectors", {
          name: submissionData.sector_id,
        });

        // Extract the new position ID from the response
        const newPositionId = positionResponse.data.data.data.id;

        // Update the submission data with the new position ID
        submissionData.sector_id = newPositionId;
      }
      const formData = new FormData();
      Object.entries(submissionData).forEach(([key, value]) => {
        if (
          (key === "banner_image" || key === "upload_pdf") &&
          typeof value === "string"
        ) {
          formData.append(key, "");
        } else {
          formData.append(key, value as Blob);
        }
      });
      if (id) {
        await axiosInstance.post(`/ourwork/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({
          description: "Work updated successfully",
          type: "success",
        });
        navigate("/admin/our-works");
      } else {
        await axiosInstance.post("/ourwork", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({
          description: "Work added successfully",
          type: "success",
        });
        navigate("/admin/our-works");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Our Works", link: "/admin/our-works" },
        { label: `${id ? "Edit" : "Add"} Our Works` },
      ]}
      title={`${id ? "Edit" : "Add"} Our Works`}
      activeSidebarItem="Our Works"
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
              <HStack justify="space-between" align="center">
                <Heading mb={6}>
                  {id ? "Edit Our Works" : "Add Our Works"}
                </Heading>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <HStack>
                      <Text fontWeight="500" textStyle="md">
                        Show Work
                      </Text>
                      <Switch
                        checked={field.value === 1}
                        onCheckedChange={(value) => {
                          const statusValue = value.checked ? 1 : 0;
                          field.onChange(statusValue);
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

                <HStack>
                  <Controller
                    name="sector_id"
                    control={control}
                    rules={{ required: "Work Sector is required" }}
                    render={({ field }) => (
                      <Field label="Sector">
                        <CreatableSelect
                          {...field}
                          placeholder="Create or select sector"
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          options={sectorOptions as any}
                          value={
                            // Find the matching option object if field.value is a number
                            typeof field.value === "number"
                              ? sectorOptions.find(
                                  (option) => option.value === field.value
                                )
                              : // If it's a custom value (string) or null, handle accordingly
                              field.value
                              ? {
                                  label: String(field.value),
                                  value: field.value,
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            // Update both React Hook Form state and local state
                            field.onChange(selectedOption?.value || null);
                          }}
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "100%",
                            }),
                            control: (base) => ({
                              ...base,
                              width: "100%",
                              borderColor: errors.sector_id
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

                        {errors.sector_id && (
                          <Text textStyle="sm" color="red">
                            {errors.sector_id.message}
                          </Text>
                        )}
                      </Field>
                    )}
                  />
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
                            field.onChange(selectedOption?.value)
                          }
                          placeholder="Select Gallery related to the work"
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
                              zIndex: 10,
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              zIndex: 10,
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
                    name="banner_start_date"
                    control={control}
                    rules={{ required: "Start Date is requried" }}
                    render={({ field }) => (
                      <Field label="Start Date">
                        <Input
                          {...field}
                          type="date"
                          size={"md"}
                          onChange={(value) => field.onChange(value)}
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
                          onChange={(value) => field.onChange(value)}
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
                            field.onChange(selectedOption?.value);
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
                              zIndex: 10,
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              zIndex: 10,
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
                              zIndex: 10,
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              zIndex: 10,
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
                  name="objectives"
                  control={control}
                  rules={{ required: "Objective is required" }}
                  render={({ field }) => (
                    <Field label="Objective">
                      <CommonEditor
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          // handleFieldChange("sub_title", value);
                        }}
                      />

                      {errors.objectives && (
                        <Text textStyle="sm" color="red">
                          {errors.objectives.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="activities"
                  control={control}
                  rules={{ required: "Activities is required" }}
                  render={({ field }) => (
                    <Field label="Activities">
                      <CommonEditor
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          // handleFieldChange("sub_title", value);
                        }}
                      />

                      {errors.activities && (
                        <Text textStyle="sm" color="red">
                          {errors.activities.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />

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
                            setSelectedImage(
                              URL.createObjectURL(compressedFile)
                            );

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
                  name="upload_pdf"
                  control={control}
                  rules={{
                    validate: {
                      fileSize: (value) => {
                        if (
                          value instanceof File &&
                          value.size > 2 * 1024 * 1024
                        ) {
                          return "File size must be less than 2MB";
                        }
                        return true;
                      },
                    },
                  }}
                  render={({ field }) => (
                    <Field label="PDF File">
                      <FileUploadRoot
                        alignItems="stretch"
                        maxFiles={1}
                        accept={["application/pdf"]}
                        onFileAccept={(value) => {
                          const file = value.files[0];
                          field.onChange(file);
                        }}
                        // maxFileSize={2 * 1024 * 1024}
                      >
                        <FileUploadDropzone
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          label="Drag and drop PDF here"
                          description=".pdf files up to 2MB"
                        />
                        <FileUploadList />
                        {typeof field.value === "string" && field.value && (
                          <Box
                            mt={2}
                            p="4"
                            borderWidth="1px"
                            borderColor="border.disabled"
                            color="fg.disabled"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            borderRadius={"lg"}
                          >
                            <HStack>
                              <Icon as={CiFileOn} boxSize={5} />
                              <Text fontSize="sm" fontWeight="medium">
                                {field.value.includes("/")
                                  ? field.value.split("/").pop()
                                  : field.value}
                              </Text>
                            </HStack>
                          </Box>
                        )}
                      </FileUploadRoot>
                      {errors.upload_pdf && (
                        <Text textStyle="sm" color="red">
                          {errors.upload_pdf.message}
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

export default WorkForms;
