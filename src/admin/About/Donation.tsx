import {
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import AdminLayout from "../Layout";
import { Controller, useForm } from "react-hook-form";
import CommonEditor from "@/common/Editor/CommonEditor";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/api/axios";
import { useState } from "react";

const Donations = () => {
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
        { label: "Donation" },
      ]}
      title={`Donation`}
      activeSidebarItem="Donation"
    >
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

export default Donations;
