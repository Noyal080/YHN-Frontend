import React from "react";
import Select, { MenuListProps, SingleValue } from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { FixedSizeList as List } from "react-window";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Box, Text } from "@chakra-ui/react";

export interface IconOption {
  value: string;
  label: string;
  icon: IconDefinition;
  iconClass: string;
}

const iconList: IconOption[] = Object.keys(Icons)
  .filter((key) => key.startsWith("fa"))
  .map((key) => ({
    value: `fas fa-${key.replace("fa", "").toLowerCase()}`,
    label: key
      .replace("fa", "")
      .replace(/([A-Z])/g, " $1")
      .trim(),
    icon: (Icons as unknown as Record<string, IconDefinition>)[key],
    iconClass: `fas fa-${key.replace("fa", "").toLowerCase()}`,
  }));

const MenuList = (props: MenuListProps<IconOption>) => {
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * 35;
  const height = Math.min(maxHeight, options.length * 35);

  return (
    <List
      height={height}
      itemCount={Array.isArray(children) ? children.length : 0}
      itemSize={35}
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

interface IconSelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export const IconSelect = React.forwardRef<HTMLDivElement, IconSelectProps>(
  ({ value, onChange, error, placeholder = "Select an icon..." }, ref) => {
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredIcons = React.useMemo(() => {
      if (!searchQuery) return iconList;
      return iconList.filter((icon) =>
        icon.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [searchQuery]);

    const selectedValue = filteredIcons.find((icon) => icon.value === value);

    return (
      <Box ref={ref}>
        <Select<IconOption>
          options={filteredIcons}
          value={selectedValue || null}
          onChange={(selectedOption: SingleValue<IconOption>) => {
            onChange(selectedOption?.value || "");
          }}
          placeholder={placeholder}
          isSearchable
          components={{ MenuList }}
          onInputChange={setSearchQuery}
          styles={{
            container: (base) => ({
              ...base,
              width: "100%",
              zIndex: 1000,
            }),
            control: (base) => ({
              ...base,
              width: "100%",
              minWidth: "100%", // Add this line
              borderColor: error ? "red" : base.borderColor,
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon icon={icon} style={{ marginRight: "10px" }} />
              {label}
            </div>
          )}
        />
        {error && (
          <Text textStyle="sm" color="red">
            {error}
          </Text>
        )}
      </Box>
    );
  }
);
