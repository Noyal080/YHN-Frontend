import { Box, Center, Spinner } from "@chakra-ui/react";

const LoadingOverlay = () => {
  return (
    <Box pos="absolute" inset="0" bg="bg/80" zIndex={100}>
      <Center h="full">
        <Spinner color="black.500" />
      </Center>
    </Box>
  );
};

export default LoadingOverlay;
