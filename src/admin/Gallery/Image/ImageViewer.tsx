import { Gallery } from "@/utils/types";
import { Box, IconButton, Image } from "@chakra-ui/react";
import { useState } from "react";
import { FiTrash2, FiPlus } from "react-icons/fi";
import Viewer from "react-viewer";
import "viewerjs/dist/viewer.css";

interface ImageViewerProps {
  images: Gallery[];
  onDelete: (image: Gallery) => void;
  onAddImage: () => void;
}

const ImageViewer = ({ images, onDelete, onAddImage }: ImageViewerProps) => {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openImageViewer = (index: number) => {
    setActiveIndex(index);
    setVisible(true);
  };

  return (
    <Box display="flex" flexWrap="wrap" gap={4} mt={4}>
      {images.map((image, index) => (
        <Box key={image.id} position="relative">
          <Image
            src={image.path}
            alt={`Gallery Image ${image.id}`}
            boxSize="200px"
            objectFit="cover"
            rounded="md"
            cursor="pointer"
            onClick={() => openImageViewer(index)}
          />
          <IconButton
            size="xs"
            colorPalette={"red"}
            variant={"surface"}
            position="absolute"
            top="5%"
            right="5px"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image);
            }}
          >
            <FiTrash2 />
          </IconButton>
        </Box>
      ))}

      <Box
        width="200px"
        height="200px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        border="2px dashed gray"
        rounded="md"
        cursor="pointer"
        onClick={onAddImage}
      >
        <FiPlus size={40} color="gray" />
      </Box>

      <Viewer
        visible={visible}
        onClose={() => setVisible(false)}
        images={images.map((img) => ({ src: img.path }))}
        activeIndex={activeIndex}
        onChange={(_, index) => setActiveIndex(index)}
        zoomable={true}
        rotatable={true}
        scalable={true}
        noNavbar={false}
      />
    </Box>
  );
};

export default ImageViewer;
