import AdminLayout from "@/admin/Layout";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import CommonEditor from "@/common/Editor";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InternshipType } from "@/utils/types";
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

const VolunteerForm = () => {
  const [volunteerData, setVolunteerData] = useState<InternshipType>({
    title: "",
    description: "",
    apply_link: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("accessToken");
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const { showToast } = useCommonToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InternshipType>({
    values: {
      id: volunteerData?.id || undefined,
      title: volunteerData?.title || "",
      description: volunteerData?.description || "",
      apply_link: volunteerData?.apply_link || "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/volunteers/${id}`);
        setVolunteerData(res.data);
      } catch (e) {
        console.log(e);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const onSubmit = async (data: InternshipType) => {
    try {
      if (id) {
        const res = await axiosInstance.put(`/volunteers/${id}`, data);
        showToast({
          type: "success",
          description: res.data.message,
        });
      } else {
        const res = await axiosInstance.post("/volunteers", data);
        showToast({
          type: "success",
          description: res.data.message,
        });
      }
      navigate("/admin/volunteer");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Volunteer", link: "/admin/volunteer" },
        { label: `${id ? "Edit" : "Add"} Volunteer` },
      ]}
      activeSidebarItem="Volunteer"
      title={`${id ? "Edit" : "Add"} Volunteer`}
    >
      <CardRoot m="auto" maxWidth="800px" mt={8} boxShadow="lg">
        <CardBody>
          <Heading mb={6}>{id ? "Edit Volunteer" : "Add Volunteer"}</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} align={"stretch"}>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is requried" }}
                render={({ field }) => (
                  <Field label="Title">
                    <Input
                      {...field}
                      placeholder="Enter a title"
                      size={"md"}
                      onChange={(value) => field.onChange(value)}
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
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <Field label="Description">
                    <CommonEditor
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        // handleFieldChange("sub_title", value);
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
                name="apply_link"
                control={control}
                rules={{
                  required: "Apply link is required",
                  pattern: {
                    value: /^https:\/\/[\w.-]+\.[a-z]{2,6}([/\w.-]*)*\/?$/,
                    message:
                      "Please enter a valid URL (e.g., https://example.com)",
                  },
                }}
                render={({ field }) => (
                  <Field label="Apply Link">
                    <Input
                      {...field}
                      placeholder="Enter the link url"
                      size="md"
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    {errors.apply_link && (
                      <Text textStyle="sm" color="red">
                        {errors.apply_link.message}
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
    </AdminLayout>
  );
};

export default VolunteerForm;
