import {
  Box,
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import AdminLayout from "../Layout";
import { Controller, useForm } from "react-hook-form";
import CommonEditor from "@/common/Editor";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";

type AboutType = {
  description: string;
};

const Donations = () => {
  const [editorData, setEditorData] = useState<AboutType>({
    description: "",
  });
  const { showToast } = useCommonToast();
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AboutType>({
    values: {
      description: editorData.description || "",
    },
  });

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/donation");
        setEditorData(res.data.data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: AboutType) => {
    setIsLoading(true);
    try {
      await axiosInstance.put(`/donation`, data);
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

  const handleFieldChange = (field: keyof AboutType, value: string) => {
    setEditorData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Donation" },
      ]}
      title={`Donation`}
      activeSidebarItem="Donation"
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
            <Heading mb={6}>Donations</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack gap={4} align="stretch">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <>
                      <CommonEditor
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          handleFieldChange("description", value);
                        }}
                      />
                      {errors.description && (
                        <Text textStyle="sm" color="red">
                          {errors.description.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </VStack>
              <HStack justifyContent="flex-end" mt={4}>
                <Button type="submit" colorPalette={"blue"}>
                  {" "}
                  Save Changes
                </Button>
              </HStack>
            </form>
          </CardBody>
        </CardRoot>
      </Box>
    </AdminLayout>
  );
};

export default Donations;
