import { useState } from "react";
import AdminLayout from "../Layout";
import { EventType } from "@/utils/types";
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
import { compressImage } from "@/utils/imageCompressor";
import { Button } from "@/components/ui/button";

const EventForm = () => {
  //Gallery is missing
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const [pageData, setPageData] = useState<EventType>({
    title: "",
    description: "",
    banner_image: "",
    date: "",
    location: "",
    gallery: null,
  });
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EventType>({
    values: {
      id: pageData.id,
      title: pageData.title || "",
      description: pageData.description || "",
      banner_image: pageData.banner_image || "",
      date: pageData.date || "",
      location: pageData.location || "",
      gallery: pageData.gallery || null,
    },
  });

  const onSubmit = (data: EventType) => {
    console.log(data);
  };
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Events", link: "/events" },
        { label: `${id ? "Edit" : "Add"} Events` },
      ]}
      title={`Events Section`}
      activeSidebarItem="Events"
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
