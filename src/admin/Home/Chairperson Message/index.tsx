import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import CommonEditor from "@/common/Editor";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { compressImage } from "@/helper/imageCompressor";
import { ChairpersonMessageType } from "@/utils/types";
import {
  Box,
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Image,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface ContactFields {
  Email: string;
  Phone: string;
  Mobile: string;
}

interface AboutUsSection {
  name: string;
  desc: string;
}

interface AdditionalInformation {
  [key: string]: string; // Dynamic keys for sections
}

const ChairpersonMessage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(false);

  const [aboutUsData, setAboutUsData] = useState<AboutUsSection[]>([]);
  const [selectedSections, setSelectedSections] = useState<
    Record<string, boolean>
  >({});

  const handleSectionToggle = (sectionName: string) => {
    setSelectedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };
  const [pageData, setPageData] = useState<ChairpersonMessageType>({
    company_description: "",
    message_from_chairperson: "",
    additional_information: "",
    chairperson_fullname: "",
    chairperson_contact: "",
    chairperson_image: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const aboutRes = await axiosInstance.get("/aboutus");
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

        if (data.additional_information) {
          const additionalInfo =
            typeof data.additional_information === "string"
              ? JSON.parse(data.additional_information)
              : data.additional_information;
          setAdditionalInfo(additionalInfo);

          // Initialize selected sections based on existing additional info
          const initialSelected: Record<string, boolean> = {};
          Object.keys(additionalInfo).forEach((key) => {
            initialSelected[key] = true;
          });
          setSelectedSections(initialSelected);
        }

        // Handle about us data
        if (aboutRes.data.data && aboutRes.data.data.length > 0) {
          const sections = aboutRes.data.data[0].sections;
          setAboutUsData(sections);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // const onSubmit = async (data: ChairpersonMessageType) => {
  //   setIsLoading(true);
  //   try {
  //     const formData = new FormData();

  //     // Add simple string fields
  //     formData.append("company_description", data.company_description);
  //     formData.append(
  //       "message_from_chairperson",
  //       data.message_from_chairperson
  //     );
  //     formData.append("chairperson_fullname", data.chairperson_fullname);

  //     const additionalInfoData: Record<string, string> = {};

  //     // Add selected sections from About Us
  //     aboutUsData.forEach((section) => {
  //       if (selectedSections[section.name]) {
  //         additionalInfoData[section.name] = section.desc;
  //       }
  //     });

  //     // Add any existing additional info that might not be in aboutUsData
  //     Object.entries(additionalInfo).forEach(([key, value]) => {
  //       if (!aboutUsData.some((section) => section.name === key) && value) {
  //         additionalInfoData[key] = value;
  //       }
  //     });

  //     // Append as raw object (FormData will handle serialization)
  //     formData.append(
  //       "additional_information",
  //       JSON.stringify(additionalInfoData)
  //     );

  //     // Handle chairperson_contact (convert object to JSON string)
  //     formData.append("chairperson_contact", JSON.stringify(contactFields));

  //     // Handle image upload
  //     Object.entries(data).forEach(([key, value]) => {
  //       if (key === "chairperson_image" && typeof value === "string") {
  //         formData.append(key, "");
  //       } else if (
  //         key === "additional_information" &&
  //         JSON.stringify(value) !== pageData.additional_information
  //       ) {
  //         formData.append(key, JSON.stringify(value));
  //       } else if (
  //         key === "chairperson_contact" &&
  //         JSON.stringify(value) !== pageData.chairperson_contact
  //       ) {
  //         formData.append(key, JSON.stringify(value));
  //       } else if (value && typeof value === "object" && "size" in value) {
  //         formData.append(key, value as Blob);
  //       } else {
  //         formData.append(key, String(value));
  //       }
  //     });
  //     await axiosInstance.post(`/chairpersonmessage`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     showToast({
  //       description: "Updated Successfully",
  //       type: "success",
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     showToast({
  //       description: "Failed",
  //       type: "error",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit = async (data: ChairpersonMessageType) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append("company_description", data.company_description);
      formData.append(
        "message_from_chairperson",
        data.message_from_chairperson
      );
      formData.append("chairperson_fullname", data.chairperson_fullname);

      // ✅ Append additional information using `aboutUsData` + `additionalInfo`
      const additionalInfoData: Record<string, string> = {};

      aboutUsData.forEach((section) => {
        if (selectedSections[section.name]) {
          additionalInfoData[section.name] = section.desc;
        }
      });

      Object.entries(additionalInfo).forEach(([key, value]) => {
        if (!aboutUsData.some((section) => section.name === key) && value) {
          additionalInfoData[key] = value;
        }
      });

      formData.append(
        "additional_information",
        JSON.stringify(additionalInfoData)
      );

      // ✅ Append contact fields from local state
      formData.append("chairperson_contact", JSON.stringify(contactFields));

      // ✅ Handle image file from selectedImage (if available)
      const fileInput = fileInputRef.current?.files?.[0];
      if (fileInput) {
        const compressed = await compressImage(fileInput);
        formData.append("chairperson_image", compressed);
      }

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
      console.error(e);
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
                <HStack gap={6} align="start">
                  <Controller
                    name="chairperson_image"
                    control={control}
                    render={({ field }) => (
                      <Box position="relative">
                        {!field.value && !selectedImage ? (
                          <Box
                            width="250px"
                            height="250px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            border="2px dashed gray"
                            rounded="full"
                            cursor="pointer"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <FiPlus size={30} color="gray" />
                          </Box>
                        ) : (
                          <Image
                            src={
                              selectedImage ||
                              (typeof pageData.chairperson_image === "string"
                                ? pageData.chairperson_image
                                : undefined)
                            }
                            alt="Uploaded or Existing Image"
                            boxSize="250px"
                            rounded="full"
                            objectFit="cover"
                            cursor="pointer"
                            onClick={() => fileInputRef.current?.click()}
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          ref={fileInputRef}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
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
                        />
                      </Box>
                    )}
                  />
                  <VStack gap={4} flex="1" align="start">
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
                    <VStack align="start">
                      <Text fontSize={"md"} fontWeight={"semibold"}>
                        {" "}
                        Additional Information{" "}
                      </Text>
                      {aboutUsData.map((section) => (
                        <Box key={section.name} display="flex">
                          <input
                            type="checkbox"
                            checked={!!selectedSections[section.name]}
                            onChange={() => handleSectionToggle(section.name)}
                            style={{ marginRight: "8px" }}
                          />
                          <Text>{section.name}</Text>
                        </Box>
                      ))}
                    </VStack>
                  </VStack>
                </HStack>
                {/* <Controller
                  name="company_description"
                  rules={{ required: "Organisation Description is required" }}
                  control={control}
                  render={({ field }) => (
                    <Field label="Organisation Description">
                      <Textarea
                        {...field}
                        size="md"
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="Enter the organ description"
                      />

                      {errors.company_description && (
                        <Text textStyle="sm" color="red">
                          {errors.company_description.message}
                        </Text>
                      )}
                    </Field>
                  )}
                /> */}
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
