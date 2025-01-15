import { Box, Heading, HStack } from "@chakra-ui/react";

const SliderFilter = () => {
  return (
    <Box justifyItems="start">
      <HStack gap={8}>
        <Heading size={"md"}> Filter: </Heading>
        <Heading> Filter: </Heading>

        <Heading> Filter: </Heading>
      </HStack>
    </Box>
  );
};
export default SliderFilter;
