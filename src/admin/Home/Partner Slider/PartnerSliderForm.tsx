import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { Switch } from "@/components/ui/switch";
import { PartnerSliderType } from "@/utils/types";
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

const PartnerSliderForm = () => {
  const { id } = useParams();
  console.log(id);

  const { showToast } = useCommonToast();
  const [sliderData, setSliderData] = useState<PartnerSliderType>({
    image: "",
    title: "",
    status: 1,
  });
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PartnerSliderType>({
    values: {
      id: sliderData.id,
      title: sliderData.title,
      image: sliderData.image,
      status: sliderData.status || 1,
    },
  });
  const token = localStorage.getItem("accessToken");
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const res = await axiosInstance.get(`/partner/${id}`);
        setSliderData(res.data.data);
      } catch (e) {
        console.error(e);
      }
    };
    if (id) {
      fetchSliderData();
    }
  }, [id]);

  const handleFieldChange = (
    field: keyof PartnerSliderType,
    value: string | number | boolean | File
  ) => {
    setSliderData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (sliderData: PartnerSliderType) => {
    try {
      if (id) {
        await axiosInstance.patch(`/slider/edit/${id}`, sliderData);
        showToast({
          description: "Slider updated successfully!",
          type: "success",
        });
        navigate("/admin/partners");
      } else {
        console.log(sliderData);
        const res = await axiosInstance.post(`/partner`, sliderData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showToast({
          description: res.data.message,
          type: "success",
        });
        navigate("/admin/partners");
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
        { label: "Partner Slider", link: "/admin/partners" },
        { label: id ? "Edit Partner" : "Add Partner" },
      ]}
      activeSidebarItem="Partner Slider"
      title={`${id ? "Edit" : "Add"} Partner Slider`}
    >
      <CardRoot m="auto" maxWidth="800px" mt={8} boxShadow="lg">
        <CardBody>
          <Heading mb={6}>
            {id ? "Edit Partner Slider" : "Add Partner Slider"}
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} align="stretch">
              <Controller
                name="title"
                control={control}
                rules={{ required: "Partner Name is required" }}
                render={({ field }) => (
                  <Field label="Parnter Name">
                    <Input
                      {...field}
                      placeholder="Enter partner name"
                      size="md"
                      onChange={(e) =>
                        handleFieldChange("title", e.target.value)
                      }
                    />
                    {errors.title && (
                      <Text textStyle="sm" color="red">
                        {errors.title.message}
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
                name="status"
                control={control}
                render={({ field }) => (
                  <Field>
                    <HStack justify="space-between" align="center">
                      <Text fontWeight="500" textStyle="md">
                        Show Image
                      </Text>
                      <Switch
                        checked={field.value === 1}
                        onCheckedChange={(value) => {
                          const numericValue = value ? 1 : 0; // Convert `true`/`false` to `1`/`0`
                          field.onChange(numericValue);
                          handleFieldChange("status", numericValue);
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
              <Button variant={"ghost"}> Cancel </Button>
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

export default PartnerSliderForm;
