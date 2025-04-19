import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import { IconSelect } from "@/common/IconSelect";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { OurImpactType } from "@/utils/types";
import {
  Box,
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
const OurImpactForm = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useCommonToast();
  const navigate = useNavigate();

  const [pageData, setPageData] = useState<OurImpactType>({
    name: "",
    number: "",
    icon: "",
    status: 1,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OurImpactType>({
    values: {
      id: pageData.id,
      name: pageData.name,
      number: pageData.number,
      icon: pageData.icon,
      status: pageData.status,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/ourimpact/${id}`);
        setPageData(res.data.data.ourimpact);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const onSubmit = async (data: OurImpactType) => {
    setIsLoading(true);
    try {
      if (id) {
        await axiosInstance.patch(`/ourimpact/${id}`, data);
        showToast({
          description: "Impact data updated successfully!",
          type: "success",
        });
      } else {
        await axiosInstance.post(`/ourimpact`, data);
        showToast({
          description: "Impact data added successfully",
          type: "success",
        });
      }
      navigate("/admin/our-impact");
    } catch (e) {
      console.error(e);
      if (id) {
        showToast({
          description: "Failed to update the Impact data",
          type: "error",
        });
      } else {
        showToast({
          description: "Failed to add the Impact data",
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Our Impact", link: "/admin/our-impact" },
        { label: id ? "Edit Impact" : "Add Impact" },
      ]}
      title={`${id ? "Edit" : "Add"} Impact`}
      activeSidebarItem="Our Impact"
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
              <HStack mb={4} justifyContent="space-between">
                <Heading mb={6}>{id ? "Edit" : "Add"} Impact</Heading>

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <HStack justify="space-between" align="center">
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
              <VStack gap={4} align={"stretch"}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Impact name is requried" }}
                  render={({ field }) => (
                    <Field label="Impact name">
                      <Input
                        {...field}
                        placeholder="Enter a Impact name"
                        size={"md"}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                      {errors.name && (
                        <Text textStyle="sm" color="red">
                          {errors.name.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="number"
                  control={control}
                  rules={{ required: "Impact number is requried" }}
                  render={({ field }) => (
                    <Field label="Impact number">
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter a Impact number"
                        size={"md"}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                      {errors.name && (
                        <Text textStyle="sm" color="red">
                          {errors.name.message}
                        </Text>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="icon"
                  control={control}
                  rules={{ required: "Icon is required" }}
                  render={({ field }) => (
                    <Field label="Icon" w={"100%"}>
                      <Box width="100%">
                        <IconSelect
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.icon?.message}
                        />
                      </Box>
                    </Field>
                  )}
                />
                {/* <Controller
                  name="number"
                  control={control}
                  rules={{ required: "Impact Number is required" }}
                  render={({ field }) => (
                    <Field label="Impact Number">
                      {errors.number && (
                        <Text textStyle="sm" color="red">
                          {errors.number.message}
                        </Text>
                      )}
                    </Field>
                  )}
                /> */}
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

export default OurImpactForm;
