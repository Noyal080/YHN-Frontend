import React, { useState, useEffect } from "react";
import { Box, Image } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageSliderProps } from "@/utils";

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box position="relative" height="300px" overflow="hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ x: "100%", rotateY: 90, opacity: 0 }}
          animate={{ x: 0, rotateY: 0, opacity: 1 }}
          exit={{ x: "-100%", rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: "auto",
            height: "100%",
            perspective: "1000px", // Adds a 3D perspective
          }}
        >
          <Image
            src={images[currentImage].path}
            alt={`Slide ${currentImage}`}
            width="auto"
            height="100%"
            objectFit="cover"
            borderRadius="md" // Optional: Adds rounded corners for a card-like feel
            boxShadow="lg" // Optional: Adds a shadow for depth
          />
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default ImageSlider;
