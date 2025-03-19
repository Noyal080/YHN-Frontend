import React, { useState } from "react";
import Select from "react-select";
import nepalData from "./cities.json";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { Control, Controller, FieldErrors } from "react-hook-form";

interface StateCitySelectProps {
  control: Control<any>; // Use `any` or a more specific type
  errors: FieldErrors<any>; // Use `any` or a more specific type
}

const StateCitySelector: React.FC<StateCitySelectProps> = ({
  control,
  errors,
}) => {
  const stateOptions = nepalData.map((item) => ({
    value: item.state,
    label: item.state,
  }));

  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Handle state selection
  const handleStateChange = (
    selectedOption: { value: string; label: string } | null,
    onChange: (value: string | undefined) => void
  ) => {
    onChange(selectedOption?.value || "");
    setCityOptions(
      selectedOption
        ? nepalData
            .find((item) => item.state === selectedOption.value)
            ?.cities.map((city) => ({ value: city, label: city })) || []
        : []
    );
  };

  return (
    <Flex gap={4}>
      {/* State Selection */}
      <Box flex={1}>
        <Field fontSize="lg" fontWeight="bold">
          State
        </Field>
        <Controller
          name={"banner_location_stateorprovince"}
          control={control}
          rules={{ required: "State is required" }}
          render={({ field }) => (
            <Select
              {...field}
              options={stateOptions}
              value={stateOptions.find(
                (option) => option.value === field.value
              )}
              onChange={(selectedOption) =>
                handleStateChange(selectedOption, field.onChange)
              }
              placeholder="Select State"
            />
          )}
        />
        {errors.banner_location_stateorprovince && (
          <Text textStyle="sm" color="red">
            {errors.banner_location_stateorprovince.message}
          </Text>
        )}
      </Box>

      {/* City Selection */}
      <Box flex={1}>
        <Field fontSize="lg" fontWeight="bold">
          City
        </Field>
        <Controller
          name={"banner_location_cityordistrict"}
          control={control}
          rules={{ required: "City is required" }}
          render={({ field }) => (
            <Select
              {...field}
              options={cityOptions}
              value={cityOptions.find((option) => option.value === field.value)}
              onChange={(selectedOption) =>
                field.onChange(selectedOption?.value || "")
              }
              placeholder="Select City"
              isDisabled={cityOptions.length === 0}
            />
          )}
        />
        {errors.banner_location_cityordistrict && (
          <Text textStyle="sm" color="red">
            {errors.banner_location_cityordistrict.message}
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default StateCitySelector;
