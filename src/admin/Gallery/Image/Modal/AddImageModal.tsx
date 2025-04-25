import { useState } from "react";
import CommonModal from "@/common/CommonModal";
import {
  FileUploadDropzone,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { compressMultiImage } from "@/helper/imageCompressor";
import {
  Box,
  Image,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { axiosInstance } from "@/api/axios";
import useCommonToast from "@/common/CommonToast";

interface AddImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  galleryId?: string;
  onSuccess: () => void;
}

const AddImageModal = ({
  isOpen,
  onClose,
  galleryId,
  onSuccess,
}: AddImageModalProps) => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageData, setImageData] = useState<{ images: File[] }>({
    images: [],
  });
  const [miniLoading, setMiniLoading] = useState(false);
  const { showToast } = useCommonToast();

  const handleImageUpload = async (files: File[]) => {
    try {
      setMiniLoading(true);
      const compressionPromises = files.map((file) => compressMultiImage(file));
      const compressedFiles = await Promise.all(compressionPromises);

      const newPreviewUrls = compressedFiles.map((file) =>
        URL.createObjectURL(file as Blob)
      );
      setPreviewImages(newPreviewUrls);
      setImageData((prev) => ({ ...prev, images: compressedFiles }));
    } catch (error) {
      console.error("Compression error:", error);
    } finally {
      setMiniLoading(false);
    }
  };

  const handleAddImage = async () => {
    try {
      const formData = new FormData();
      imageData.images.forEach((file) => {
        formData.append("images[]", file);
      });
      await axiosInstance.post(`/gallery/${galleryId}/add-images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess();
      onClose();
      handleModalClose();
      showToast({ description: "Images added successfully", type: "success" });
    } catch (e) {
      console.log(e);
      // showToast({ description: "Error while adding images", type: "error" });
    }
  };

  const handleModalClose = () => {
    setImageData({ images: [] });
    setPreviewImages([]);
  };

  return (
    <CommonModal
      open={isOpen}
      onOpenChange={() => {
        onClose();
        handleModalClose();
      }}
      title={"Add Image"}
      onButtonClick={handleAddImage}
      type="primary"
      buttonName="Add Image"
    >
      <FileUploadRoot
        alignItems="stretch"
        maxFiles={20}
        accept={["image/*"]}
        onFileAccept={(value) => handleImageUpload(value.files)}
      >
        <FileUploadDropzone label="Drag and drop images here to upload" />
      </FileUploadRoot>
      {miniLoading ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="200px"
          width="100%"
          bg="gray.50"
          borderRadius="md"
          mt={4}
        >
          <VStack gap={4}>
            <Spinner size="lg" color="blue.500" borderWidth="4px" />
            <Text fontSize="md" color="gray.600">
              Uploading...
            </Text>
          </VStack>
        </Box>
      ) : (
        previewImages.length > 0 && (
          <SimpleGrid columns={[2, 3, 5]} gap={4} mt={4}>
            {previewImages.map((src, index) => (
              <Box
                key={index}
                position="relative"
                borderRadius="md"
                overflow="hidden"
                bg="gray.100"
                _hover={{
                  transform: "scale(1.02)",
                  transition: "transform 0.2s",
                }}
              >
                <Image
                  src={src}
                  alt={`Preview ${index + 1}`}
                  objectFit="cover"
                  height="150px"
                  width="100%"
                />
              </Box>
            ))}
          </SimpleGrid>
        )
      )}
    </CommonModal>
  );
};

export default AddImageModal;
