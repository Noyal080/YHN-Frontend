import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import CommonEditor from "@/common/Editor";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import CreatableSelect from "react-select/creatable";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { Switch } from "@/components/ui/switch";
import { TestimonialInput } from "@/utils/types";
import {
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const TestimonialForm = () => {
  const { id } = useParams();
  const { showToast } = useCommonToast();
  const navigate = useNavigate();
  const [sliderData, setSliderData] = useState<TestimonialInput>({
    status: true,
    image: "",
    name: "",
    description: "",
    designation: "",
    usercategory: "",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TestimonialInput>({
    values: {
      id: sliderData.id,
      name: sliderData.name,
      description: sliderData.description,
      image: sliderData.image,
      designation: sliderData.designation,
      usercategory: sliderData.usercategory,
      status: sliderData.status,
    },
  });
  const token = localStorage.getItem("accessToken");
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const res = await axiosInstance.get(`/slider/${id}`);
        setSliderData(res.data.payload);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSliderData();
  }, [id]);

  const handleFieldChange = (
    field: keyof TestimonialInput,
    value: string | number | boolean | File
  ) => {
    setSliderData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (sliderData: TestimonialInput) => {
    try {
      if (id) {
        await axiosInstance.patch(`/slider/edit/${id}`, sliderData);
        showToast({
          description: "Slider updated successfully!",
          type: "success",
        });
      } else {
        await axiosInstance.post(`/slider/add`, sliderData);
        showToast({
          description: " Slider added successfully",
          type: "success",
        });
      }
    } catch (e) {
      console.error(e);
      if (id) {
        showToast({
          description: "Failed to update the slider",
          type: "error",
        });
      } else {
        showToast({
          description: "Failed to add the slider",
          type: "error",
        });
      }
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Testimonial", link: "/admin/testimonials" },
        { label: `${id ? "Edit" : "Add"} Testimonial` },
      ]}
      activeSidebarItem="Testimonial"
      title={`${id ? "Edit" : "Add"} Testimonial`}
    >
      <CardRoot m="auto" maxWidth="800px" mt={8} boxShadow="lg">
        <CardBody>
          <Heading mb={6}>
            {id ? "Edit Testimonial" : "Add Testimonial"}
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} align="stretch">
              <Controller
                name="name"
                control={control}
                rules={{ required: "Testimonial Name is required" }}
                render={({ field }) => (
                  <Field label="Testimonial Name">
                    <Input
                      {...field}
                      placeholder="Enter testimonial name"
                      size="md"
                      onChange={(e) =>
                        handleFieldChange("name", e.target.value)
                      }
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
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <Field label="Description">
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
                  </Field>
                )}
              />
              <Controller
                name="image"
                control={control}
                rules={{ required: "Image URL is required" }}
                render={({ field }) => (
                  <Field label="Image URL">
                    <FileUploadRoot
                      alignItems="stretch"
                      maxFiles={1}
                      accept={["image/*"]}
                      onFileAccept={(value) => {
                        const file = value.files[0];
                        field.onChange(file);
                        handleFieldChange("image", file);
                      }}
                    >
                      <FileUploadDropzone
                        value={field.value}
                        label="Drag and drop here to upload"
                        description=".png, .jpg up to 5MB"
                      />
                      <FileUploadList />
                    </FileUploadRoot>
                    {errors.image && (
                      <Text textStyle="sm" color="red">
                        {errors.image.message}
                      </Text>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="designation"
                control={control}
                rules={{ required: "User Designation is required" }}
                render={({ field }) => (
                  <Field label="User Designation">
                    <CreatableSelect
                      {...field}
                      // options={designationOptions}
                      placeholder="Enter or select user designation"
                      // onChange={(selectedOption) => {
                      //   const value = selectedOption?.value || "";
                      //   field.onChange(value);
                      //   handleFieldChange("designation", value);
                      // }}
                      // onBlur={field.onBlur}
                      styles={{
                        container: (base) => ({
                          ...base,
                          width: "100%",
                        }),
                        control: (base) => ({
                          ...base,
                          width: "100%",
                          borderColor: errors.designation
                            ? "red"
                            : base.borderColor,
                        }),
                        menu: (base) => ({
                          ...base,
                          width: "100%",
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          width: "100%",
                        }),
                        input: (base) => ({
                          ...base,
                          width: "100%",
                        }),
                      }}
                    />
                    {errors.designation && (
                      <Text textStyle="sm" color="red">
                        {errors.designation.message}
                      </Text>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="usercategory"
                control={control}
                rules={{ required: "User Category is required" }}
                render={({ field }) => (
                  <Field label="User Category">
                    <Input
                      {...field}
                      placeholder="Enter user category"
                      size="md"
                      onChange={(e) =>
                        handleFieldChange("usercategory", e.target.value)
                      }
                    />
                    {errors.usercategory && (
                      <Text textStyle="sm" color="red">
                        {errors.usercategory.message}
                      </Text>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Field>
                    <HStack justify="space-between" align="center">
                      <Text fontWeight="500" textStyle="md">
                        Show Image
                      </Text>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(value) => {
                          field.onChange(value);
                          handleFieldChange("status", value.checked);
                        }}
                        color="black"
                        colorPalette="blue"
                      />
                    </HStack>
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
    </AdminLayout>
  );
};

export default TestimonialForm;
