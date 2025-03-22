import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../Layout";
import React, { useMemo, useState } from "react";
import useCommonToast from "@/common/CommonToast";
import { ServicesType } from "@/utils/types";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  CardBody,
  CardRoot,
  Heading,
  HStack,
  Input,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import Select, { MenuListProps, SingleValue } from "react-select";
import { IconOption } from "@/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { Switch } from "@/components/ui/switch";
import useDebounce from "@/helper/debounce";
import { FixedSizeList as List } from "react-window";

const iconList: IconOption[] = Object.keys(Icons)
  .filter((key) => key.startsWith("fa")) // Filter only icon keys
  .map((key) => ({
    value: `fa-solid ${key}`, // Format value as "fa-solid fa-icon-name"
    label: key, // Display the icon name as the label
    icon: Icons[key], // Store the icon for display
  }));

const MenuList = (props: MenuListProps<IconOption>) => {
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * 35; // Adjust based on your item height
  const height = Math.min(maxHeight, options.length * 35);

  return (
    <List
      height={height}
      itemCount={Array.isArray(children) ? children.length : 0}
      itemSize={35} // Adjust based on your item height
      width="100%"
      initialScrollOffset={initialOffset}
    >
      {({ index, style }: { index: number; style: React.CSSProperties }) => (
        <div style={style}>
          {Array.isArray(children) &&
          children[index] &&
          React.isValidElement(children[index])
            ? React.cloneElement(children[index], {
                key: (options[index] as IconOption).value,
              })
            : null}
        </div>
      )}
    </List>
  );
};

const ServiceForms = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useCommonToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300); // Debounce search input

  // Filter icons based on the debounced search query
  const filteredIcons = useMemo(() => {
    if (!debouncedSearchQuery) return iconList;
    return iconList.filter((icon) =>
      icon.label.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery]);
  const [pageData, setPageData] = useState<ServicesType>({
    title: "",
    description: "",
    icon: "",
    status: 1,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ServicesType>({
    values: {
      id: pageData.id,
      title: pageData.title,
      description: pageData.description,
      icon: pageData.icon,
      status: pageData.status || 1,
    },
  });

  const onSubmit = (data: ServicesType) => {
    console.log(data);
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Services", link: "/admin/services" },
        { label: `${id ? "Edit" : "Add"} Services` },
      ]}
      title={`Our Services`}
      activeSidebarItem="Services"
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
            <Heading mb={6}>{id ? "Edit" : "Add"} Services</Heading>
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
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
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
                      <Textarea
                        resize={"vertical"}
                        autoresize
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          //   handleFieldChange("sub_title", e.target.value);
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
                  name="icon"
                  control={control}
                  rules={{ required: "Icon is required" }}
                  render={({ field }) => (
                    <Field label="Icon">
                      <Select<IconOption>
                        options={filteredIcons}
                        value={
                          filteredIcons.find(
                            (icon) => icon.value === field.value
                          ) || null
                        }
                        onChange={(selectedOption: SingleValue<IconOption>) => {
                          field.onChange(selectedOption?.value); // Update form value with the icon's class name
                        }}
                        placeholder="Select an icon..."
                        isSearchable
                        components={{ MenuList }}
                        onInputChange={(inputValue) =>
                          setSearchQuery(inputValue)
                        }
                        styles={{
                          container: (base) => ({
                            ...base,
                            width: "100%",
                          }),
                          control: (base) => ({
                            ...base,
                            width: "100%",
                            borderColor: errors.icon ? "red" : base.borderColor,
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
                        formatOptionLabel={({ label, icon }) => (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FontAwesomeIcon
                              icon={icon}
                              style={{ marginRight: "10px" }}
                            />
                            {label}
                          </div>
                        )}
                      />
                      {errors.icon && (
                        <Text textStyle="sm" color="red">
                          {typeof errors.icon?.message === "string" &&
                            errors.icon.message}
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
                          Show Service
                        </Text>
                        <Switch
                          checked={field.value === 1}
                          onCheckedChange={(value) => {
                            const statusValue = value.checked ? 1 : 0;
                            field.onChange(statusValue);
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
      </Box>
    </AdminLayout>
  );
};

export default ServiceForms;
