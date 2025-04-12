// components/ui/url-input.tsx

import { InputGroup, InputGroupProps } from "@/components/ui/input-group";
import { Input, InputProps } from "@chakra-ui/react";
import { forwardRef } from "react";

interface UrlInputProps extends InputProps {
  inputGroupProps?: InputGroupProps;
}

export const UrlInput = forwardRef<HTMLInputElement, UrlInputProps>(
  ({ inputGroupProps, value, onChange, ...props }, ref) => {
    const displayValue =
      typeof value === "string" ? value.replace(/^https?:\/\//i, "") : "";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const processedValue = inputValue.startsWith("http")
        ? inputValue
        : `https://${inputValue}`;

      if (onChange) {
        // Create a synthetic event with the processed value
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: processedValue,
          },
        };
        onChange(syntheticEvent);
      }
    };

    return (
      <InputGroup {...inputGroupProps}>
        <Input
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          ps="7.8ch"
          placeholder="example.com"
          {...props}
        />
      </InputGroup>
    );
  }
);

UrlInput.displayName = "UrlInput";
