import AdminLayout from "@/admin/Layout";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import Select from "react-select";

import {
  Box,
  HStack,
  IconButton,
  Input,
  VStack,
  CardRoot,
  CardBody,
  Heading,
  Flex,
  Spinner,
  Text,
} from "@chakra-ui/react";

import { FiPlus, FiTrash } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { Tooltip } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";

interface ContactField {
  id?: string;
  name: string;
  value: string;
}

interface SocialMediaField {
  id?: string;
  platform: string;
  value: string;
}

interface FormValues {
  emails: ContactField[];
  phones: ContactField[];
  social_media: SocialMediaField[];
  address: string;
  map_url: string;
}

const ContactUsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<FormValues | null>(null);

  const { showToast } = useCommonToast();

  const platformOptions = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter" },
    { value: "youtube", label: "YouTube" },
  ];

  const defaultValues: FormValues = {
    emails: [{ name: "", value: "" }],
    phones: [{ name: "", value: "" }],
    social_media: [{ platform: "facebook", value: "" }],
    address: "",
    map_url: "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FormValues>({
    defaultValues,
    values: {
      emails: initialData?.emails || [{ name: "", value: "" }],
      phones: initialData?.phones || [{ name: "", value: "" }],
      social_media: initialData?.social_media || [
        { platform: "facebook", value: "" },
      ],
      address: initialData?.address || "",
      map_url: initialData?.map_url || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        address: data.address || "string",
        email: data.emails,
        phone: data.phones,
        social_media: data.social_media,
        map_url: data.map_url?.replace(/"/g, "'") || "",
      };

      await axiosInstance.patch("/contactus/1", payload);
      showToast({
        description: "Contact Information updated successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Update failed:", error);
      showToast({
        description: "Error while updating Contact Information",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/contactus/1"); // Adjust endpoint as needed
        const resData = response.data.data.contact;

        setInitialData(resData);
      } catch (error) {
        console.error("Failed to fetch contact data:", error);
        // Fallback to default values if API fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactData();
  }, []);

  // Helper to generate temporary keys for rendering
  const getTempKey = (item: { id?: string }, index: number) =>
    item.id ? item.id : `temp-${index}`;

  // Generic handler for adding fields
  const handleAddField = (fieldName: "emails" | "phones") => {
    const currentFields = getValues(fieldName);
    setValue(fieldName, [...currentFields, { name: "", value: "" }]);
  };

  const handleAddSocialMedia = () => {
    const currentValues = getValues("social_media");
    setValue(
      "social_media",
      [...currentValues, { platform: "facebook", value: "" }],
      {
        shouldDirty: true,
      }
    );
  };

  // Generic handler for deleting fields
  const handleDeleteField = (fieldName: string, index: number) => {
    const currentFields = getValues(
      fieldName as "emails" | "phones" | "social_media"
    );
    const updatedFields = currentFields.filter((_, i) => i !== index);
    if (fieldName === "emails" || fieldName === "phones") {
      setValue(fieldName, updatedFields as ContactField[], {
        shouldDirty: true,
      });
    } else if (fieldName === "social_media") {
      setValue(fieldName, updatedFields as SocialMediaField[], {
        shouldDirty: true,
      });
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Contact Information" },
      ]}
      title="Contact Information"
      activeSidebarItem="Contact Information"
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
            <Heading mb={6}>Contact Information</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack gap={4} align="stretch">
                {/* Email Section */}
                <Box>
                  <Field fontWeight={"semibold"}>Emails</Field>
                  <Controller
                    name="emails"
                    control={control}
                    render={({ field }) => (
                      <>
                        {field.value.map((item, index) => (
                          <HStack key={getTempKey(item, index)} mb={2}>
                            <Input
                              value={item.name}
                              onChange={(e) => {
                                const updatedEmails = [...field.value];
                                updatedEmails[index].name = e.target.value;
                                field.onChange(updatedEmails);
                              }}
                              placeholder="Email Label"
                            />
                            <Input
                              value={item.value}
                              onChange={(e) => {
                                const updatedEmails = [...field.value];
                                updatedEmails[index].value = e.target.value;
                                field.onChange(updatedEmails);
                              }}
                              placeholder="Email Address"
                            />
                            <IconButton
                              variant={"outline"}
                              colorPalette={"red"}
                              aria-label="Delete email"
                              onClick={() => handleDeleteField("emails", index)}
                            >
                              <FiTrash />
                            </IconButton>
                          </HStack>
                        ))}
                        {errors.emails && (
                          <Text textStyle="sm" color="red">
                            {errors.emails.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                  <Tooltip content="Add Email">
                    <IconButton
                      borderRadius={"2xl"}
                      size={"xs"}
                      variant={"subtle"}
                      colorPalette={"blue"}
                      onClick={() => handleAddField("emails")}
                      type="button"
                    >
                      <FiPlus />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Phone Section */}
                <Box>
                  <Field fontWeight={"semibold"}>Phone Numbers</Field>
                  <Controller
                    name="phones"
                    control={control}
                    render={({ field }) => (
                      <>
                        {field.value.map((item, index) => (
                          <HStack key={getTempKey(item, index)} mb={2}>
                            <Input
                              value={item.name}
                              onChange={(e) => {
                                const updatedPhones = [...field.value];
                                updatedPhones[index].name = e.target.value;
                                field.onChange(updatedPhones);
                              }}
                              placeholder="Phone Label"
                            />
                            <Input
                              value={item.value}
                              onChange={(e) => {
                                const updatedPhones = [...field.value];
                                updatedPhones[index].value = e.target.value;
                                field.onChange(updatedPhones);
                              }}
                              placeholder="Phone Number"
                            />
                            <IconButton
                              variant={"outline"}
                              colorPalette={"red"}
                              aria-label="Delete phone"
                              onClick={() => handleDeleteField("phones", index)}
                            >
                              <FiTrash />
                            </IconButton>
                          </HStack>
                        ))}

                        {errors.phones && (
                          <Text textStyle="sm" color="red">
                            {errors.phones.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                  <Tooltip content=" Add Phone">
                    <IconButton
                      borderRadius={"2xl"}
                      size={"xs"}
                      variant={"subtle"}
                      colorPalette={"blue"}
                      onClick={() => handleAddField("phones")}
                      type="button"
                    >
                      <FiPlus />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Social Media Section */}
                <Box>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Field fontWeight={"semibold"}>Social Media</Field>
                  </Flex>

                  <Controller
                    name="social_media"
                    control={control}
                    render={({ field }) => (
                      <>
                        {field.value.map((item, index) => (
                          <HStack
                            key={getTempKey(item, index)}
                            mb={2}
                            alignItems="center"
                          >
                            <Box width="100%">
                              <Select
                                value={platformOptions.find(
                                  (opt) => opt.value === item.platform
                                )}
                                onChange={(selectedOption) => {
                                  const updatedSocialMedia = [...field.value];
                                  updatedSocialMedia[index].platform =
                                    selectedOption?.value || "facebook";
                                  field.onChange(updatedSocialMedia);
                                }}
                                options={platformOptions}
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    minHeight: "40px",
                                    height: "40px",
                                  }),
                                  singleValue: (base) => ({
                                    ...base,
                                    color: "inherit",
                                  }),
                                }}
                                placeholder="Select platform..."
                              />
                            </Box>
                            <Input
                              value={item.value}
                              onChange={(e) => {
                                const updatedSocialMedia = [...field.value];
                                updatedSocialMedia[index].value =
                                  e.target.value;
                                field.onChange(updatedSocialMedia);
                              }}
                              placeholder="URL"
                            />
                            <IconButton
                              variant={"outline"}
                              colorPalette={"red"}
                              aria-label="Delete social media"
                              onClick={() =>
                                handleDeleteField("social_media", index)
                              }
                            >
                              <FiTrash />
                            </IconButton>
                          </HStack>
                        ))}
                        {errors.social_media && (
                          <Text textStyle="sm" color="red">
                            {errors.social_media.message}
                          </Text>
                        )}
                        <Tooltip content="Add Social Media">
                          <IconButton
                            borderRadius={"2xl"}
                            size={"xs"}
                            variant={"subtle"}
                            colorPalette={"blue"}
                            onClick={handleAddSocialMedia}
                            type="button"
                          >
                            <FiPlus />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  />
                </Box>

                <Box>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Field fontWeight={"semibold"}>Address</Field>
                  </Flex>

                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        />{" "}
                        {errors.address && (
                          <Text textStyle="sm" color="red">
                            {errors.address.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </Box>
                <Box>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Field fontWeight={"semibold"}>Map Url</Field>
                  </Flex>

                  <Controller
                    name="map_url"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        />
                        {errors.map_url && (
                          <Text textStyle="sm" color="red">
                            {errors.map_url.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </Box>
                {/* Submit Button */}
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

export default ContactUsPage;
