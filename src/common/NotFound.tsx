import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionButton = motion(Button);

// FlipNumber Component with bounce effect
const FlipNumber = ({ number }: { number: string }) => {
  return (
    <MotionBox
      w="100px"
      h="120px"
      bg="gray.200"
      borderRadius="2xl"
      boxShadow="lg"
      border="2px solid gray"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="4xl"
      fontWeight="bold"
      textAlign="center"
      initial={{ rotateX: 90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.1, boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.2)" }}
      whileTap={{ scale: 0.95 }}
    >
      {number}
    </MotionBox>
  );
};

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      h="100vh"
      w="100vw"
      position="relative"
      overflow="hidden"
      bg="gray.50"
    >
      <MotionText
        fontFamily={"sans-serif"}
        fontWeight="bold"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        The page you are looking for cannot be found.
      </MotionText>
      {/* Animated Background */}
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="linear(to-r, teal.200, pink.200)"
        zIndex={-1}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Flip Numbers */}
      <Flex gap={3} p={5} bg="white" borderRadius="lg" boxShadow="xl">
        <FlipNumber number="4" />
        <FlipNumber number="0" />
        <FlipNumber number="4" />
      </Flex>

      {/* Enlarged Page Not Found Text */}

      {/* Back Home Button */}
      <MotionButton
        mt={4}
        colorScheme="teal"
        size="lg"
        onClick={() => navigate("/")}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Go Back Home
      </MotionButton>
    </Flex>
  );
};

export default NotFoundPage;
