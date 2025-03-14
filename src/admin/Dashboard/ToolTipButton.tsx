import { Tooltip } from "@/components/ui/tooltip";
import { IconButton } from "@chakra-ui/react";
import { ReactNode } from "react";

interface TooltipButtonProps {
  type: string; // Button type (e.g., "Bar", "Line", "Pie", "Table")
  icon: ReactNode; // Icon to display in the button
  isActive: boolean; // Whether the button is active
  onClick: () => void; // Click handler
}

const TooltipButton = ({
  type,
  icon,
  isActive,
  onClick,
}: TooltipButtonProps) => {
  return (
    <Tooltip content={type} openDelay={200}>
      <IconButton
        aria-label={type}
        variant="outline"
        size="sm"
        colorScheme={isActive ? "blue" : "gray"}
        onClick={onClick}
        _hover={{
          transform: "scale(1.1)",
          transition: "transform 0.2s",
        }}
        borderColor={isActive ? "blue.500" : "gray.200"}
        borderWidth={isActive ? "2px" : "1px"}
        color={isActive ? "blue.500" : "gray.500"}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default TooltipButton;
