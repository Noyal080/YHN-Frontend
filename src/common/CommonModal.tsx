import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { CommonModalProps } from "@/utils";
import CommonButton from "./Buttons";
import { Separator } from "@chakra-ui/react";

const CommonModal: React.FC<CommonModalProps> = ({
  open,
  onOpenChange,
  children,
  title,
  onButtonClick,
  buttonName,
  loading,
  type = "danger",
}) => {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange} size={"lg"}>
      <DialogContent>
        <DialogHeader>
          {" "}
          <DialogTitle>{title}</DialogTitle>{" "}
        </DialogHeader>
        <Separator size={"lg"} />
        <DialogBody>{children}</DialogBody>
        <DialogCloseTrigger />
        <DialogFooter>
          <DialogActionTrigger asChild>
            <CommonButton label="Close" variant="outline" color={"gray"} />
          </DialogActionTrigger>
          <CommonButton
            label={buttonName || "Delete"}
            variant="subtle"
            bgColor={type === "danger" ? "red.600" : "blue.500"}
            color={"white"}
            onPress={onButtonClick}
            loading={loading}
            disabled={loading}
          />
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default CommonModal;
