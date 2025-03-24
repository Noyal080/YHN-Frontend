import AdminLayout from "@/admin/Layout";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  Box,
  HStack,
  IconButton,
  Input,
  VStack,
  CardRoot,
  CardBody,
  Heading,
  Text,
} from "@chakra-ui/react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";

interface ContactField {
  id?: string;
  name: string;
  value: string;
}

interface SocialMediaField {
  id?: string;
  value: string;
}

interface FormValues {
  email: ContactField[];
  phone: ContactField[];
  social_media: {
    Facebook: SocialMediaField[];
    Instagram: SocialMediaField[];
    Twitter: SocialMediaField[];
  };
}

const ContactUsPage = () => {
  const defaultValues: FormValues = {
    email: [
      { id: "1", name: "Personal Email", value: "abcd@gmail.com" },
      { id: "2", name: "Work Email", value: "efgh@gmail.com" },
    ],
    phone: [
      { id: "1", name: "Work Phone", value: "123456789" },
      { id: "2", name: "Phone", value: "123456789" },
    ],
    social_media: {
      Facebook: [{ id: "1", value: "YHN" }],
      Instagram: [],
      Twitter: [],
    },
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

  const handleAddSocialMedia = (platform: keyof FormValues["social_media"]) => {
    const currentValues = getValues("social_media");

    setValue(
      "social_media",
      {
        ...currentValues,
        [platform]: [...currentValues[platform], { value: "" }],
      },
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }
    );
  };

  // Generic handler for deleting fields
  const handleDeleteField = (
    fieldName: string,
    index: number,
    platform?: keyof FormValues["social_media"]
  ) => {
    if (platform) {
      const currentFields = getValues(`social_media.${platform}`);
      const updatedFields = currentFields.filter((_, i) => i !== index);
      setValue(`social_media.${platform}`, updatedFields, {
        shouldDirty: true,
      });
    } else {
      const currentFields = getValues(fieldName as "email" | "phone");
      const updatedFields = currentFields.filter((_, i) => i !== index);
      setValue(fieldName as "email" | "phone", updatedFields, {
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

                <Button
                  w={"full"}
                  variant={"subtle"}
                  colorPalette={"blue"}
                  onClick={() => handleAddField("email")}
                  type="button"
                >
                  <FiPlus /> Add Email
                </Button>
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
                <Button
                  w={"full"}
                  variant={"subtle"}
                  colorPalette={"blue"}
                  onClick={() => handleAddField("phone")}
                  type="button"
                >
                  <FiPlus /> Add Phone
                </Button>
              </Box>

              {/* Social Media Section */}
              <Box>
                <Field fontWeight={"semibold"}>Social Media</Field>
                <Controller
                  name="social_media"
                  control={control}
                  render={({ field }) => (
                    <>
                      {(["Facebook", "Instagram", "Twitter"] as const).map(
                        (platform) => (
                          <Box key={platform} mb={4} p="4" borderWidth="1px">
                            <HStack mb={2}>
                              <Text>
                                {platform.charAt(0).toUpperCase() +
                                  platform.slice(1)}
                              </Text>
                            </HStack>
                            {field.value[platform].map((item, index) => (
                              <HStack key={getTempKey(item, index)} mb={2}>
                                <Input
                                  value={item.value}
                                  onChange={(e) => {
                                    const updatedPlatform = [
                                      ...field.value[platform],
                                    ];
                                    updatedPlatform[index].value =
                                      e.target.value;
                                    field.onChange({
                                      ...field.value,
                                      [platform]: updatedPlatform,
                                    });
                                  }}
                                  placeholder={`${platform} URL`}
                                />
                                <IconButton
                                  aria-label={`Delete ${platform}`}
                                  variant={"outline"}
                                  colorPalette={"red"}
                                  onClick={() =>
                                    handleDeleteField(
                                      "social_media",
                                      index,
                                      platform
                                    )
                                  }
                                >
                                  <FiTrash />
                                </IconButton>
                              </HStack>
                            ))}
                            <Button
                              w={"full"}
                              variant={"subtle"}
                              colorPalette={"blue"}
                              onClick={() => handleAddSocialMedia(platform)}
                              mt={2}
                              type="button"
                            >
                              <FiPlus /> Add{" "}
                              {platform.charAt(0).toUpperCase() +
                                platform.slice(1)}
                            </Button>
                          </Box>
                        )
                      )}
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
