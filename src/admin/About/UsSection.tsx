import {
  Box,
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
  IconButton,
  Stack,
  Input,
} from "@chakra-ui/react";
import AdminLayout from "../Layout";
import CommonEditor from "@/common/Editor";
import { useEffect, useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { axiosInstance } from "@/api/axios";
import { Button } from "@/components/ui/button";
import useCommonToast from "@/common/CommonToast";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Field } from "@/components/ui/field";

type SectionType = {
  name: string;
  desc: string;
};

type AboutType = {
  sections: SectionType[];
};

const UsSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useCommonToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AboutType>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/aboutus");
        // Assuming the API returns data in the format you provided
        reset({ sections: res.data.data[0].sections });
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  const onSubmit = async (data: AboutType) => {
    setIsLoading(true);
    try {
      await axiosInstance.patch(`/aboutus/1`, { sections: data.sections });
      showToast({
        description: "Updated Successfully",
        type: "success",
      });
    } catch (e) {
      console.log(e);
      // showToast({
      //   description: "Failed to update",
      //   type: "error",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const addNewSection = () => {
    append({ name: "", desc: "" });
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Who we are" },
      ]}
      title={`Who we are`}
      activeSidebarItem="Who we are"
    >
      <Box position="relative">
        {isLoading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(255, 255, 255, 0.8)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1}
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
            <Heading mb={6}>Who we are Section</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack gap={6} align="stretch">
                {fields.map((field, index) => (
                  <Stack key={field.id} position="relative">
                    <IconButton
                      aria-label="Delete section"
                      onClick={() => remove(index)}
                      position="absolute"
                      right={2}
                      top={-4}
                      size="sm"
                      colorScheme="red"
                      variant={"outline"}
                      colorPalette={"red"}
                    >
                      <FaTrash />
                    </IconButton>
                    <Controller
                      name={`sections.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <Field label="Title">
                          <Input
                            {...field}
                            size={"md"}
                            placeholder="Enter section name"
                          />
                          {errors.sections?.[index]?.name && (
                            <Text color="red.500" fontSize="sm">
                              {errors.sections[index]?.name?.message}
                            </Text>
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name={`sections.${index}.desc`}
                      control={control}
                      render={({ field }) => (
                        <Field label="Description">
                          <CommonEditor
                            value={field.value}
                            onChange={field.onChange}
                          />
                          {errors.sections?.[index]?.desc && (
                            <Text color="red.500" fontSize="sm">
                              {errors.sections[index]?.desc?.message}
                            </Text>
                          )}
                        </Field>
                      )}
                    />
                  </Stack>
                ))}
                <IconButton
                  aria-label="Add new section"
                  onClick={addNewSection}
                  colorScheme="blue"
                  variant="outline"
                >
                  <FaPlus />
                </IconButton>
              </VStack>
              <HStack justifyContent="flex-end" mt={4}>
                <Button type="submit" colorPalette="blue">
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

export default UsSection;
