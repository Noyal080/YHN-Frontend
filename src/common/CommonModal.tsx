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
            <CommonButton
              label="Close"
              variant="outline"
              colorPalette={"gray.500"}
            />
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default CommonModal;
