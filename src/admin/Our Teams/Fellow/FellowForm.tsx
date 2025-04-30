import AdminLayout from "@/admin/Layout";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { compressImage } from "@/helper/imageCompressor";
import { FellowInternInput } from "@/utils/types";
import {
  Box,
  CardBody,
  CardRoot,
  HStack,
  Spinner,
  Heading,
  Text,
  VStack,
  Image,
  Input,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const FellowForms = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fellowData, setFellowData] = useState<FellowInternInput>({
    name: "",
    image: "",
    joined_date: "",
    completion_date: "",
    status: 1,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FellowInternInput>({
    values: {
      name: fellowData.name,
      image: fellowData.image,
      joined_date: fellowData.joined_date,
      completion_date: fellowData.completion_date,
      status: fellowData.status,
    },
  });

  const onSubmit = (data: FellowInternInput) => {
    console.log(data);
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Fellows", link: "/admin/fellows" },
        { label: "Add Fellow" },
      ]}
      title={`Add Fellow`}
      activeSidebarItem="Fellows"
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
              <HStack justifyContent="space-between" alignItems="center">
                <Heading mb={6}> {id ? "Edit" : "Add"} Fellows</Heading>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <HStack>
                      <Text fontWeight="500" textStyle="md">
                        {field.value === 1 ? "Active" : "Inactive"}
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
              <VStack gap={4} align="stretch">
                <HStack gap={6} align="start">
                  <Controller
                    name="image"
                    control={control}
                    rules={!id ? { required: "Image URL is required" } : {}}
                    render={({ field }) => (
                      <Box position="relative">
                        {!field.value && !selectedImage && !fellowData.image ? (
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
                              (typeof fellowData.image === "string"
                                ? fellowData.image
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
                  <VStack flex={1}>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: "Name is required" }}
                      render={({ field }) => (
                        <Field label="Name">
                          <Input
                            {...field}
                            placeholder="Enter fellow name"
                            size={"md"}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          {errors.name && (
                            <Text textStyle="sm" color="red">
                              {errors.name.message}
                            </Text>
                          )}
                        </Field>
                      )}
                    />
                  </VStack>
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
      </Box>
    </AdminLayout>
  );
};

export default FellowForms;
