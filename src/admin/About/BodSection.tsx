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
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "@/api/axios";
import { Button } from "@/components/ui/button";

const BodSection = () => {
  const [editorData, setEditorData] = useState<string>("");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      editorData: editorData || "",
    },
  });
  const token = localStorage.getItem("accessToken");
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const onSubmit = () => {
    console.log("posted");
  };
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Board of Directors" },
      ]}
      title={`Board of Directors`}
      activeSidebarItem="Board of Directors"
    >
      <CardRoot
        m="auto"
        maxWidth="800px"
        mt={8}
        boxShadow="lg"
        variant={"elevated"}
      >
        <CardBody>
          <Heading mb={6}>Board of Directors Section</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} align="stretch">
              <Controller
                name="editorData"
                control={control}
                render={({ field }) => (
                  <>
                    <CommonEditor
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        setEditorData(value);
                      }}
                    />
                    {errors.editorData && (
                      <Text textStyle="sm" color="red">
                        {errors.editorData.message}
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

export default BodSection;
