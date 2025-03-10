import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../Layout";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { OurWorkType } from "@/utils/types";
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
import { Button } from "@/components/ui/button";
import {
  FileUploadDropzone,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { compressImage } from "@/helper/imageCompressor";
import { axiosInstance } from "@/api/axios";

const WorkForms = () => {
  //Gallery is missing
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const [pageData, setPageData] = useState<OurWorkType>({
    title: "",
    sector: "",
    description: "",
    banner_image: "",
    date: "",
    location: "",
    gallery: null,
    objective: "",
    activities: "",
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
      sector: pageData.sector || "",
      description: pageData.description || "",
      banner_image: pageData.banner_image || "",
      date: pageData.date || "",
      location: pageData.location || "",
      gallery: pageData.gallery || null,
      objective: pageData.objective || "",
      activities: pageData.activities || "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/works/${id}`);
        setPageData(res.data);
      } catch (e) {
        console.log(e);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const onSubmit = (data: OurWorkType) => {
    console.log(data);
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
      <CardRoot m="auto" maxWidth="800px" mt={8} boxShadow="lg">
        <CardBody>
          <Heading mb={6}>{id ? "Edit Our Works" : "Add Our Works"}</Heading>
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
                name="sector"
                control={control}
                rules={{ required: "Work Sector is required" }}
                render={({ field }) => (
                  <Field label="Sector">
                    <CreatableSelect
                      {...field}
                      placeholder="Create or select sector"
                      styles={{
                        container: (base) => ({
                          ...base,
                          width: "100%",
                        }),
                        control: (base) => ({
                          ...base,
                          width: "100%",
                          borderColor: errors.sector ? "red" : base.borderColor,
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

                    {errors.sector && (
                      <Text textStyle="sm" color="red">
                        {errors.sector.message}
                      </Text>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="objective"
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

                    {errors.objective && (
                      <Text textStyle="sm" color="red">
                        {errors.objective.message}
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
              <HStack>
                <Controller
                  name="date"
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
                      {errors.date && (
                        <Text textStyle="sm" color="red">
                          {errors.date.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="location"
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
                      {errors.location && (
                        <Text textStyle="sm" color="red">
                          {errors.location.message}
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

export default WorkForms;
