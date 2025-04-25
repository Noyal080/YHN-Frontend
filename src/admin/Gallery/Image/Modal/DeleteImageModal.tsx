import CommonModal from "@/common/CommonModal";
import { Image, Text } from "@chakra-ui/react";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";
import { Gallery } from "@/utils/types";

interface DeleteImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImage?: Gallery;
  galleryId?: string;
  onSuccess: () => void;
}

const DeleteImageModal = ({
  isOpen,
  onClose,
  selectedImage,
  galleryId,
  onSuccess,
}: DeleteImageModalProps) => {
  const { showToast } = useCommonToast();

  const handleDeleteImage = async () => {
    try {
      await axiosInstance.delete(
        `/gallery/${galleryId}/image/${selectedImage?.id}`
      );
      onSuccess();
      onClose();
      showToast({ description: "Image deleted successfully", type: "success" });
    } catch (e) {
      console.log(e);
      // showToast({ description: "Error while deleting image", type: "error" });
    }
  };

  return (
    <CommonModal
      open={isOpen}
      onOpenChange={onClose}
      title={"Delete Image"}
      onButtonClick={handleDeleteImage}
    >
      <Text fontSize={"md"} fontWeight={"semi-bold"} mb={2}>
        Are you sure you want to delete this image?
      </Text>
      <Image
        boxSize="200px"
        objectFit="cover"
        rounded="md"
        src={selectedImage?.path}
      />
    </CommonModal>
  );
};

export default DeleteImageModal;
