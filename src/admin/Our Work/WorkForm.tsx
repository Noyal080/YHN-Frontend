import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../Layout";
import { useEffect, useState } from "react";
import Select from "react-select";
import { ImageInputTypes, MultipleLocation, OurWorkType } from "@/utils/types";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Box,
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Icon,
  IconButton,
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
import { FaPlus, FaTrash } from "react-icons/fa";

interface SectorOptions {
  label: string;
  value: number;
}

const SectionToggle = ({
  label,
  isChecked,
  onChange,
}: {
  label: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <HStack alignItems="center" gap={16}>
    <Text fontWeight="medium">{label}</Text>
    <Switch
      checked={isChecked}
      onChange={() => onChange(!isChecked)}
      colorPalette="blue"
    />
  </HStack>
);

const WorkForms = () => {
  //Gallery is missing
  const { id } = useParams();
  const [showObjectives, setShowObjectives] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const [options, setOptions] = useState<GalleryOptions[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sectorOptions, setSectorOptions] = useState<SectorOptions[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { showToast } = useCommonToast();
  const [pageData, setPageData] = useState<OurWorkType>({
    title: "",
    services_id: null,
    description: "",
    banner_image: "",
    // banner_start_date: "",
    // banner_end_date: "",
    banner_location_district: "",
    banner_location_state: "",
    banner_location_city: "",
    gallery_id: null,
    objectives: "",
    activities: "",
    upload_pdf: "",
    status: "1",
    additional_location_details: [
      {
        district: "",
        state: "",
        city: "",
      },
    ],
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
      services_id: pageData.services_id,
      description: pageData.description || "",
      banner_image: pageData.banner_image || "",
      banner_location_district: pageData.banner_location_district || "",
      banner_location_state: pageData.banner_location_state || "",
      banner_location_city: pageData.banner_location_city || "",
      gallery_id: pageData.gallery_id,
      objectives: pageData.objectives || "",
      activities: pageData.activities || "",
      upload_pdf: pageData.upload_pdf || "",
      status: pageData.status || "1",
      additional_location_details: pageData.additional_location_details || [
        {
          district: "",
          state: "",
          city: "",
        },
      ],
    },
  });

  const {
    fields: locationFields,
    append: appendLocation,
    remove: removeLocation,
  } = useFieldArray({
    control,
    name: "additional_location_details",
  });

  const stateOptions = nepalData.map((item) => ({
    value: item.state,
    label: item.state,
  }));

  const [locationCityOptions, setLocationCityOptions] = useState<
    { value: string; label: string }[][]
  >([]);

  const addNewLocation = () => {
    appendLocation({
      district: "",
      state: "",
      city: "",
    });
    setLocationCityOptions([...locationCityOptions, []]);
  };

  // Handle state selection for additional locations
  const handleLocationStateChange = (
    selectedOption: { value: string; label: string } | null,
    index: number,
    onChange: (value: string | undefined) => void
  ) => {
    onChange(selectedOption?.value || "");

    const newCityOptions = [...locationCityOptions];
    newCityOptions[index] = selectedOption
      ? nepalData
          .find((item) => item.state === selectedOption.value)
          ?.cities.map((city) => ({ value: city, label: city })) || []
      : [];

    setLocationCityOptions(newCityOptions);
  };

  useEffect(() => {
    const fetchGalleryandServices = async () => {
      try {
        const res = await axiosInstance.get("/gallery", {
          params: { search: debouncedSearch },
        });
        const sectorRes = await axiosInstance.get("/service");

        const resData = res.data.data;
        const mappedOptions = resData.data.map((item: ImageInputTypes) => ({
          value: item.id,
          label: item.title, // Ensure this field exists in your API response
        }));
        setOptions(mappedOptions);
        const result = sectorRes.data.data.data;
        setSectorOptions(
          result.map((sector: { title: string; id: number }) => ({
            label: sector.title,
            value: sector.id,
          }))
        );

        // setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    fetchGalleryandServices();
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/ourwork/${id}`);
        const result = res.data.data;
        setPageData(result);
        const initialCityOptions =
          result.additional_location_details?.map((loc: MultipleLocation) => {
            return (
              nepalData
                .find((item) => item.state === loc.state)
                ?.cities.map((city) => ({ value: city, label: city })) || []
            );
          }) || [];

        setLocationCityOptions(initialCityOptions);
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

      if (
        submissionData.gallery_id === null ||
        submissionData.gallery_id === undefined
      ) {
        delete submissionData.gallery_id;
      }

      const formData = new FormData();
      Object.entries(submissionData).forEach(([key, value]) => {
        if (key === "additional_location_details") return;
        if (
          (key === "banner_image" || key === "upload_pdf") &&
          typeof value === "string"
        ) {
          formData.append(key, "");
        } else {
          formData.append(key, value as Blob);
        }
      });

      submissionData.additional_location_details.forEach((location) => {
        formData.append(
          "additional_location_details[]",
          JSON.stringify({
            additional_location_details_district: location.district,
            additional_location_details_state: location.state,
            additional_location_details_city: location.city,
          })
        );
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
                        {field.value === "1" ? "Show" : "Hide"}
                      </Text>
                      <Switch
                        checked={field.value === "1"}
                        onCheckedChange={(value) => {
                          const statusValue = value.checked ? "1" : "0";
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
                  rules={{ required: "Title is required" }}
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
                    name="services_id"
                    rules={{ required: "Sector is required" }}
                    control={control}
                    render={({ field }) => (
                      <Field label="Sector">
                        <Select
                          {...field}
                          placeholder="Select sector"
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
                              zIndex: 9999, // High z-index for the container
                            }),
                            control: (base) => ({
                              ...base,
                              width: "100%",
                              borderColor: errors.services_id
                                ? "red"
                                : base.borderColor,
                              zIndex: 9999, // High z-index for the control
                            }),
                            menu: (base) => ({
                              ...base,
                              width: "100%",
                              zIndex: 9999, // High z-index for the dropdown menu
                            }),
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999, // High z-index for the menu portal
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              width: "100%",
                              zIndex: 9999, // High z-index for the value container
                            }),
                            input: (base) => ({
                              ...base,
                              width: "100%",
                            }),
                          }}
                        />

                        {errors.services_id && (
                          <Text textStyle="sm" color="red">
                            {errors.services_id.message}
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
                              zIndex: 10001,
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

                {/* Additional Locations Section */}
                <Heading size="md" mt={4}>
                  Locations
                </Heading>
                {locationFields.map((field, index) => (
                  <Box
                    key={field.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    mb={4}
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="bold">Location {index + 1}</Text>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        colorPalette="red"
                        onClick={() => removeLocation(index)}
                      >
                        <FaTrash />
                      </IconButton>
                    </HStack>

                    <HStack mb={2}>
                      <Controller
                        name={`additional_location_details.${index}.state`}
                        control={control}
                        render={({ field }) => (
                          <Field>
                            State
                            <Select
                              options={stateOptions}
                              value={stateOptions.find(
                                (option) => option.value === field.value
                              )}
                              onChange={(selectedOption) => {
                                handleLocationStateChange(
                                  selectedOption,
                                  index,
                                  field.onChange
                                );
                              }}
                              placeholder="Select State"
                              styles={{
                                container: (base) => ({
                                  ...base,
                                  width: "100%",
                                  zIndex: 1000 - index, // Adjust z-index for stacking
                                }),
                                control: (base) => ({
                                  ...base,
                                  width: "100%",
                                }),
                              }}
                            />
                          </Field>
                        )}
                      />

                      <Controller
                        name={`additional_location_details.${index}.district`}
                        control={control}
                        render={({ field }) => (
                          <Field>
                            District
                            <Select
                              options={locationCityOptions[index] || []}
                              value={(locationCityOptions[index] || []).find(
                                (option) => option.value === field.value
                              )}
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption?.value || "");
                              }}
                              placeholder="Select District"
                              isDisabled={!locationCityOptions[index]?.length}
                              styles={{
                                container: (base) => ({
                                  ...base,
                                  width: "100%",
                                  zIndex: 1000 - index, // Adjust z-index for stacking
                                }),
                                control: (base) => ({
                                  ...base,
                                  width: "100%",
                                }),
                              }}
                            />
                          </Field>
                        )}
                      />
                    </HStack>

                    <Controller
                      name={`additional_location_details.${index}.city`}
                      control={control}
                      render={({ field }) => (
                        <Field>
                          City
                          <Input
                            width={"1/2"}
                            {...field}
                            placeholder="Enter City"
                            value={field.value}
                            size={"md"}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </Field>
                      )}
                    />
                  </Box>
                ))}

                <Button
                  type="button"
                  onClick={addNewLocation}
                  variant="outline"
                >
                  <FaPlus />
                  Add Location
                </Button>

                {/* <HStack>
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
                          }}
                          placeholder="Select State"
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "100%",
                              zIndex: 1000,
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
                          }}
                          placeholder="Select District"
                          isDisabled={cityOptions.length === 0}
                          styles={{
                            container: (base) => ({
                              ...base,
                              width: "100%",
                              zIndex: 1000,
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
                  {errors.banner_location_district && (
                    <Text textStyle="sm" color="red">
                      {errors.banner_location_district.message}
                    </Text>
                  )}
                </HStack>
                <Controller
                  name={"banner_location_city"}
                  control={control}
                  render={({ field }) => (
                    <Field>
                      City
                      <Input
                        width={"1/2"}
                        {...field}
                        placeholder="Enter City"
                        value={field.value}
                        size={"md"}
                        onChange={(value) => field.onChange(value)}
                      />
                    </Field>
                  )}
                />
                {errors.banner_location_city && (
                  <Text textStyle="sm" color="red">
                    {errors.banner_location_city.message}
                  </Text>
                )} */}
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
                  render={({ field }) => (
                    <Field
                      label={
                        <Box w="full">
                          <SectionToggle
                            label="Objectives"
                            isChecked={showObjectives}
                            onChange={setShowObjectives}
                          />
                        </Box>
                      }
                    >
                      {showObjectives && (
                        <>
                          <CommonEditor
                            value={field.value || ""}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                          />
                          {errors.objectives && (
                            <Text textStyle="sm" color="red">
                              {errors.objectives.message}
                            </Text>
                          )}
                        </>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="activities"
                  control={control}
                  render={({ field }) => (
                    <Field
                      label={
                        <SectionToggle
                          label="Activities"
                          isChecked={showActivities}
                          onChange={setShowActivities}
                        />
                      }
                    >
                      {showActivities && (
                        <>
                          <CommonEditor
                            value={field.value || ""}
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
                        </>
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
                        <FileUploadDropzone
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          label="Drag and drop here to upload"
                          description=".png, .jpg up to 5MB"
                        />
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
                          value.size > 10 * 1024 * 1024
                        ) {
                          return "File size must be less than 10MB";
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
                        maxFileSize={10 * 1024 * 1024}
                      >
                        <FileUploadDropzone
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          label="Drag and drop PDF here"
                          description=".pdf files up to 10MB"
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
