import React from "react";
import { Box, Flex, Skeleton } from "@chakra-ui/react";
import { useColorModeValue } from "./components/ui/color-mode";

const SkeletonLoading: React.FC = () => {
  const sidebarBg = useColorModeValue("white.100", "white.700");
  const contentBg = useColorModeValue("white", "white.800");
  const skeletonColor = useColorModeValue("white.200", "white.600");

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Sidebar Skeleton */}
      <Box
        w="80px"
        bg={sidebarBg}
        transition="width 0.3s ease"
        flexShrink={0}
        p={4}
      >
        {[...Array(6)].map((_, i) => (
          <Skeleton
            key={i}
            h="40px"
            w="100%"
            mb={4}
            borderRadius="md"
            css={{
              "--start-color": skeletonColor,
              "--end-color": skeletonColor,
            }}
          />
        ))}
      </Box>

      {/* Main Content Area */}
      <Flex flex={1} flexDirection="column" overflow="hidden">
        {/* Navbar Skeleton */}
        <Box p={4} borderBottomWidth="1px" bg={contentBg}>
          <Flex justifyContent="space-between" alignItems="center">
            <Skeleton
              h="30px"
              w="200px"
              css={{
                "--start-color": skeletonColor,
                "--end-color": skeletonColor,
              }}
            />
            <Flex alignItems="center">
              <Skeleton
                h="40px"
                w="40px"
                borderRadius="full"
                mr={4}
                css={{
                  "--start-color": skeletonColor,
                  "--end-color": skeletonColor,
                }}
              />
              <Skeleton
                h="30px"
                w="100px"
                css={{
                  "--start-color": skeletonColor,
                  "--end-color": skeletonColor,
                }}
              />
            </Flex>
          </Flex>
          {/* Breadcrumb Skeleton */}
          <Flex mt={4}>
            {[...Array(3)].map((_, i) => (
              <React.Fragment key={i}>
                <Skeleton
                  h="20px"
                  w="60px"
                  mr={2}
                  css={{
                    "--start-color": skeletonColor,
                    "--end-color": skeletonColor,
                  }}
                />
                {i < 2 && (
                  <Skeleton
                    h="20px"
                    w="20px"
                    mr={2}
                    css={{
                      "--start-color": skeletonColor,
                      "--end-color": skeletonColor,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </Flex>
        </Box>

        {/* Content Skeleton */}
        <Box flex={1} p={4} bg={contentBg} overflow="auto">
          {/* Page Title Skeleton */}
          <Skeleton
            h="40px"
            w="300px"
            mb={6}
            css={{
              "--start-color": skeletonColor,
              "--end-color": skeletonColor,
            }}
          />

          {/* Content Grid Skeleton */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
            gap={6}
          >
            {[...Array(6)].map((_, i) => (
              <Box key={i} borderWidth="1px" borderRadius="lg" p={4}>
                <Skeleton
                  h="150px"
                  w="100%"
                  mb={4}
                  borderRadius="md"
                  css={{
                    "--start-color": skeletonColor,
                    "--end-color": skeletonColor,
                  }}
                />
                <Skeleton
                  h="20px"
                  w="80%"
                  mb={2}
                  css={{
                    "--start-color": skeletonColor,
                    "--end-color": skeletonColor,
                  }}
                />
                <Skeleton
                  h="20px"
                  w="60%"
                  css={{
                    "--start-color": skeletonColor,
                    "--end-color": skeletonColor,
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default SkeletonLoading;
