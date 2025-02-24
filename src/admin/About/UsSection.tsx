import {
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import AdminLayout from "../Layout";
import CommonEditor from "@/common/Editor";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "@/api/axios";
import { Button } from "@/components/ui/button";
import useCommonToast from "@/common/CommonToast";

type AboutType = {
  description: string;
};

const UsSection = () => {
  const [editorData, setEditorData] = useState<AboutType>({
    description: "",
  });
  const { showToast } = useCommonToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AboutType>({
    values: {
      description: editorData.description || "",
    },
  });
  const token = localStorage.getItem("accessToken");
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/aboutus/1");
        setEditorData(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [token]);

  const onSubmit = async (data: AboutType) => {
    try {
      const res = await axiosInstance.put(`/aboutus/1`, data);
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
    }
  };

  const handleFieldChange = (field: keyof AboutType, value: string) => {
    setEditorData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Who are we" },
      ]}
      title={`Who are we`}
      activeSidebarItem="Who are we"
    >
      <CardRoot
        m="auto"
        maxWidth="800px"
        mt={8}
        boxShadow="lg"
        variant={"elevated"}
      >
        <CardBody>
          <Heading mb={6}>Who are we Section</Heading>
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
    </AdminLayout>
  );
};

export default UsSection;
