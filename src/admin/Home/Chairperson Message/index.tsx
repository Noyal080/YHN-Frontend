import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import CommonEditor from "@/common/Editor";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  FileUploadDropzone,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { compressImage } from "@/helper/imageCompressor";
import { ChairpersonMessageType } from "@/utils/types";
import {
  Box,
  CardBody,
  CardRoot,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Input,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface ContactFields {
  Email: string;
  Phone: string;
  Mobile: string;
}

interface AdditionalInformation {
  "Our Mission": string;
  "Our Vision": string;
}

const ChairpersonMessage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [pageData, setPageData] = useState<ChairpersonMessageType>({
    company_description: "",
    message_from_chairperson: "",
    additional_information: "",
    chairperson_fullname: "",
    chairperson_contact: "",
    chairperson_image: "",
  });

  const { showToast } = useCommonToast();

  const [contactFields, setContactFields] = useState<ContactFields>({
    Email: "",
    Phone: "",
    Mobile: "",
  });

  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInformation>({
    "Our Mission": "",
    "Our Vision": "",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChairpersonMessageType>({
    values: {
      company_description: pageData.company_description || "",
      message_from_chairperson: pageData.message_from_chairperson || "",
      additional_information: pageData.additional_information || "",
      chairperson_fullname: pageData.chairperson_fullname || "",
      chairperson_contact: pageData.chairperson_contact || "",
      chairperson_image: pageData.chairperson_image || "",
    },
  });

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/chairpersonmessage");
        const data = res.data.data;
        setPageData(data);
        if (data.chairperson_contact) {
          const contact =
            typeof data.chairperson_contact === "string"
              ? JSON.parse(data.chairperson_contact)
              : data.chairperson_contact;
          setContactFields({
            Email: contact.Email || "",
            Phone: contact.Phone || "",
            Mobile: contact.Mobile || "",
          });
        }

        // Handle additional_information - parse if it's a string
        if (data.additional_information) {
          const additionalInfo =
            typeof data.additional_information === "string"
              ? JSON.parse(data.additional_information)
              : data.additional_information;
          setAdditionalInfo({
            "Our Mission": additionalInfo["Our Mission"] || "",
            "Our Vision": additionalInfo["Our Vision"] || "",
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: ChairpersonMessageType) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Add simple string fields
      formData.append("company_description", data.company_description);
      formData.append(
        "message_from_chairperson",
        data.message_from_chairperson
      );
      formData.append("chairperson_fullname", data.chairperson_fullname);

      // Handle additional_information (convert object to JSON string)
      formData.append("additional_information", JSON.stringify(additionalInfo));

      // Handle chairperson_contact (convert object to JSON string)
      formData.append("chairperson_contact", JSON.stringify(contactFields));

      // Handle image upload
      Object.entries(data).forEach(([key, value]) => {
        if (key === "chairperson_image" && typeof value === "string") {
          formData.append(key, "");
        } else if (
          key === "additional_information" &&
          JSON.stringify(value) !== pageData.additional_information
        ) {
          formData.append(key, JSON.stringify(value));
        } else if (
          key === "chairperson_contact" &&
          JSON.stringify(value) !== pageData.chairperson_contact
        ) {
          formData.append(key, JSON.stringify(value));
        } else if (value && typeof value === "object" && "size" in value) {
          formData.append(key, value as Blob);
        } else {
          formData.append(key, String(value));
        }
      });
      await axiosInstance.post(`/chairpersonmessage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showToast({
        description: "Updated Successfully",
        type: "success",
      });
    } catch (e) {
      console.log(e);
      showToast({
        description: "Failed",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Chairperson Message" },
      ]}
      title={`Chairperson Message`}
      activeSidebarItem="Chairperson Message"
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
        <CardRoot
          m="auto"
          maxWidth="800px"
          mt={8}
          boxShadow="lg"
          variant={"elevated"}
        >
          <CardBody>
            <Heading mb={6}>Chairperson Message</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack gap={4} align={"stretch"}>
                <Controller
                  name="chairperson_fullname"
                  rules={{ required: "Fullname is required" }}
                  control={control}
                  render={({ field }) => (
                    <Field label="Name">
                      <Input
                        {...field}
                        size="md"
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="Enter the chairperson name"
                      />
                      {errors.chairperson_fullname && (
                        <Text textStyle="sm" color="red">
                          {errors.chairperson_fullname.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="company_description"
                  rules={{ required: "Company Description is required" }}
                  control={control}
                  render={({ field }) => (
                    <Field label="Company Description">
                      <Textarea
                        {...field}
                        size="md"
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="Enter the company description"
                      />

                      {errors.company_description && (
                        <Text textStyle="sm" color="red">
                          {errors.company_description.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="message_from_chairperson"
                  rules={{ required: "Message is required" }}
                  control={control}
                  render={({ field }) => (
                    <Field label="Message">
                      <CommonEditor
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                      {errors.message_from_chairperson && (
                        <Text textStyle="sm" color="red">
                          {errors.message_from_chairperson.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="additional_information"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <Text fontWeight="medium" mb={2}>
                        Our Mission
                      </Text>
                      <Textarea
                        value={additionalInfo["Our Mission"]}
                        onChange={(e) => {
                          const newData = {
                            ...additionalInfo,
                            "Our Mission": e.target.value,
                          };
                          setAdditionalInfo(newData);
                          field.onChange(JSON.stringify(newData));
                        }}
                        minHeight="100px"
                        placeholder="Enter the mission statement"
                      />

                      <Text fontWeight="medium" mb={2}>
                        Our Vision
                      </Text>
                      <Textarea
                        value={additionalInfo["Our Vision"]}
                        onChange={(e) => {
                          const newData = {
                            ...additionalInfo,
                            "Our Vision": e.target.value,
                          };
                          setAdditionalInfo(newData);
                          field.onChange(JSON.stringify(newData));
                        }}
                        minHeight="100px"
                        placeholder="Enter the vision statement"
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="chairperson_contact"
                  control={control}
                  render={({ field }) => (
                    <Field label="Contact Information">
                      <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        p={4}
                        width="100%"
                      >
                        <Grid templateColumns="100px 1fr" gap={4}>
                          <GridItem display="flex" alignItems="center">
                            <Text fontWeight="medium">Email</Text>
                          </GridItem>
                          <GridItem>
                            <Input
                              value={contactFields.Email}
                              onChange={(e) => {
                                const newContact = {
                                  ...contactFields,
                                  Email: e.target.value,
                                };
                                setContactFields(newContact);
                                field.onChange(JSON.stringify(newContact));
                              }}
                              placeholder="info@example.com"
                            />
                          </GridItem>

                          <GridItem display="flex" alignItems="center">
                            <Text fontWeight="medium">Phone</Text>
                          </GridItem>
                          <GridItem>
                            <Input
                              value={contactFields.Phone}
                              onChange={(e) => {
                                const newContact = {
                                  ...contactFields,
                                  Phone: e.target.value,
                                };
                                setContactFields(newContact);
                                field.onChange(JSON.stringify(newContact));
                              }}
                              placeholder="+977-XXXXXXXXXX"
                            />
                          </GridItem>

                          <GridItem display="flex" alignItems="center">
                            <Text fontWeight="medium">Mobile</Text>
                          </GridItem>
                          <GridItem>
                            <Input
                              value={contactFields.Mobile}
                              onChange={(e) => {
                                const newContact = {
                                  ...contactFields,
                                  Mobile: e.target.value,
                                };
                                setContactFields(newContact);
                                field.onChange(JSON.stringify(newContact));
                              }}
                              placeholder="+977-XXXXXXXXXX"
                            />
                          </GridItem>
                        </Grid>
                      </Box>
                    </Field>
                  )}
                />
                <Controller
                  name="chairperson_image"
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
                        {(selectedImage || pageData.chairperson_image) && (
                          <Image
                            src={
                              selectedImage ||
                              (typeof pageData.chairperson_image === "string"
                                ? pageData.chairperson_image
                                : undefined)
                            }
                            alt="Uploaded or Existing Image"
                            objectFit="contain"
                            aspectRatio={2 / 1}
                            mt={4}
                          />
                        )}
                      </FileUploadRoot>
                      {errors.chairperson_image && (
                        <Text textStyle="sm" color="red">
                          {errors.chairperson_image.message}
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

export default ChairpersonMessage;
