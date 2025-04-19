import {
  Box,
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import AdminLayout from "../../Layout";
import { useEffect, useState } from "react";
import useCommonToast from "@/common/CommonToast";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "@/api/axios";
import { Field } from "@/components/ui/field";
import CommonEditor from "@/common/Editor";
import { Button } from "@/components/ui/button";
import {
  FileUploadDropzone,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { compressImage } from "@/helper/imageCompressor";

interface FormValues {
  organisation_description?: string;
  mission?: string;
  vision?: string;
  logo?: string;
  small_logo?: string;
}

const OrganizationDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<FormValues | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const [selectedSmallImage, setSelectedSmallImage] = useState<string | null>();

  const { showToast } = useCommonToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    values: {
      organisation_description: initialData?.organisation_description || "",
      mission: initialData?.mission || "",
      vision: initialData?.vision || "",
      logo: initialData?.logo || "",
      small_logo: initialData?.small_logo || "",
    },
  });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/organisation_information");
        const resData = response.data.data.information;
        console.log(resData);

        setInitialData(resData[0]);
      } catch (error) {
        console.error("Failed to fetch contact data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactData();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      await axiosInstance.post("/organisation_information", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showToast({
        description: "Organisation Information updated successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Update failed:", error);
      showToast({
        description: "Error while updating Organisation Information",
        type: "error",
      });
    }
  };
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Organisation Information" },
      ]}
      title={`Organisation Information`}
      activeSidebarItem="Organisation Information"
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
        <CardRoot m="auto" maxWidth="1000px" mt={8} boxShadow="lg">
          <CardBody>
            <Heading mb={6}>Organisation Information</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack gap={4} align="stretch">
           

                <Controller
                  name="logo"
                  control={control}
                  render={({ field }) => (
                    <Field label="Organisation Logo">
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
                        {(selectedImage || initialData?.logo) && (
                          <Image
                            src={
                              selectedImage || initialData?.logo || undefined
                            }
                            alt="Uploaded or Existing Image"
                            objectFit="contain"
                            aspectRatio={2 / 1}
                            mt={4}
                          />
                        )}
                      </FileUploadRoot>
                      {errors.logo && (
                        <Text textStyle="sm" color="red">
                          {errors.logo.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="small_logo"
                  control={control}
                  render={({ field }) => (
                    <Field label="Favicon Image">
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
                            setSelectedSmallImage(
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
                        {(selectedSmallImage || initialData?.small_logo) && (
                          <Image
                            src={
                              selectedSmallImage ||
                              initialData?.small_logo ||
                              undefined
                            }
                            alt="Uploaded or Existing Image"
                            objectFit="contain"
                            aspectRatio={2 / 1}
                            mt={4}
                          />
                        )}
                      </FileUploadRoot>
                      {errors.small_logo && (
                        <Text textStyle="sm" color="red">
                          {errors.small_logo.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />
              </VStack>
              <HStack justifyContent="flex-end" mt={4}>
                <Button variant={"ghost"}> Cancel </Button>
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

export default OrganizationDetails;
