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
} from "@chakra-ui/react";

import { FiPlus, FiTrash } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { Tooltip } from "@/components/ui/tooltip";

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
  email: ContactField[];
  phone: ContactField[];
  social_media: SocialMediaField[];
}

const ContactUsPage = () => {
  const platformOptions = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "twitter", label: "Twitter" },
    { value: "youtube", label: "YouTube" },
  ];

  const defaultValues: FormValues = {
    email: [
      { id: "1", name: "Personal Email", value: "abcd@gmail.com" },
      { id: "2", name: "Work Email", value: "efgh@gmail.com" },
    ],
    phone: [
      { id: "1", name: "Work Phone", value: "123456789" },
      { id: "2", name: "Phone", value: "123456789" },
    ],
    social_media: [
      {
        id: "1",
        platform: "facebook",
        value: "https://www.facebook.com/",
      },
      {
        id: "2",
        platform: "instagram",
        value: "https://www.instagram.com/",
      },
      {
        id: "3",
        platform: "twitter",
        value: "https://www.twitter.com/",
      },
    ],
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FormValues>({
    defaultValues,
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
  };

  // Helper to generate temporary keys for rendering
  const getTempKey = (item: { id?: string }, index: number) =>
    item.id ? item.id : `temp-${index}`;

  // Generic handler for adding fields
  const handleAddField = (fieldName: "email" | "phone") => {
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
      fieldName as "email" | "phone" | "social_media"
    );
    const updatedFields = currentFields.filter((_, i) => i !== index);
    if (fieldName === "email" || fieldName === "phone") {
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
        { label: "Contact Us" },
      ]}
      title="Contact Us"
      activeSidebarItem="Contact Us"
    >
      <CardRoot m="auto" maxWidth="1000px" mt={8} boxShadow="lg">
        <CardBody>
          <Heading mb={6}>Contact Us</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} align="stretch">
              {/* Email Section */}
              <Box>
                <Field fontWeight={"semibold"}>Emails</Field>
                <Controller
                  name="email"
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
                            onClick={() => handleDeleteField("email", index)}
                          >
                            <FiTrash />
                          </IconButton>
                        </HStack>
                      ))}
                    </>
                  )}
                />
                <Tooltip content="Add Email">
                  <IconButton
                    borderRadius={"2xl"}
                    size={"xs"}
                    variant={"subtle"}
                    colorPalette={"blue"}
                    onClick={() => handleAddField("email")}
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
                  name="phone"
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
                            onClick={() => handleDeleteField("phone", index)}
                          >
                            <FiTrash />
                          </IconButton>
                        </HStack>
                      ))}
                    </>
                  )}
                />
                <Tooltip content=" Add Phone">
                  <IconButton
                    borderRadius={"2xl"}
                    size={"xs"}
                    variant={"subtle"}
                    colorPalette={"blue"}
                    onClick={() => handleAddField("phone")}
                    type="button"
                  >
                    <FiPlus />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Social Media Section */}
              <Box>
                <Flex justifyContent="space-between" alignItems="center" mb={2}>
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
                              updatedSocialMedia[index].value = e.target.value;
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
              <HStack justifyContent="flex-end" mt={4}>
                <Button variant={"ghost"}> Cancel </Button>
                <Button type="submit" colorPalette={"blue"}>
                  {" "}
                  Submit
                </Button>
              </HStack>
              {/* Submit Button */}
            </VStack>
          </form>
        </CardBody>
      </CardRoot>
    </AdminLayout>
  );
};

export default ContactUsPage;
