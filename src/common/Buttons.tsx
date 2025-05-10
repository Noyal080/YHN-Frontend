import React from "react";
import { Button, ButtonProps } from "@chakra-ui/react";

interface CommonButtonProps extends ButtonProps {
  label?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  className?: string;
  variant?:
  | "outline"
  | "solid"
  | "subtle"
  | "surface"
  | "ghost"
  | "plain"
  | undefined;
}


const CommonButton: React.FC<CommonButtonProps> = ({
  label,
  icon,
  onPress,
  className,
  variant,
  ...rest
}) => {
  return (
    <Button
      onClick={onPress}
      variant={variant}
      className={` flex items-center justify-center gap-2 ${className}`}
      {...rest}
    >
      {icon && <span className="icon">{icon}</span>}
      {label && <span className="label">{label}</span>}
    </Button>
  );
};

export default CommonButton;
