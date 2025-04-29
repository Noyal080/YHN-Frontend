import { axiosInstance } from "@/api/axios";
import { ImageInputTypes, ViewWorkandEventType } from "@/utils/types";
import {
  Box,
  Container,
  Heading,
  Image,
  Spinner,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface EventDetailsProps {
  event: ViewWorkandEventType;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const [galleryData, setGalleryData] = useState<ImageInputTypes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (event.gallery_id == null) {
      setLoading(false); // Ensure loading is set to false if we're not fetching
      return;
    }

    const fetchImageData = async () => {
      try {
        const res = await axiosInstance.get(`/gallery/${event.gallery_id}`);
        setGalleryData(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchImageData();
  }, [event.gallery_id]);

  return (
    <Container maxW="container.xl" py={10}>
      {/* Banner Image */}
      <Box
        position="relative"
        width="full"
        height={{ base: "250px", md: "400px" }}
        overflow="hidden"
        borderRadius="lg"
      >
        <Image
          src={
            typeof event.banner_image === "string"
              ? event.banner_image
              : URL.createObjectURL(event.banner_image)
          }
          alt={event.title}
          objectFit="cover"
          width="full"
          height="full"
        />
        {/* Event Date and Location Inside Image */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          bg="white"
          color="black"
          px={3}
          py={1}
        >
          <Text fontSize="lg">
            {event.banner_start_date && <>📅 {event.banner_start_date}</>} | 📍{" "}
            {event.banner_location_state}, {event.banner_location_district} ,
            {event.banner_location_city}
          </Text>
        </Box>
      </Box>

      {/* Event Title and Details */}
      <Box textAlign="left" mt={6}>
        <Heading as="h2" size="2xl" fontWeight="bold">
          {event.title}
        </Heading>
        <div
          dangerouslySetInnerHTML={{
            __html: event.description,
          }}
        />
      </Box>

      {/* Tabs for Objectives and Activities */}
      {(event.activities || event.objectives) && (
        <Box mt={10}>
          <Tabs.Root
            defaultValue="objectives"
            variant={"subtle"}
            colorScheme="blue.500"
          >
            <Tabs.List>
              <Tabs.Trigger value="objectives">Objectives</Tabs.Trigger>
              <Tabs.Trigger value="activities">Activities</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="objectives">
              <div
                dangerouslySetInnerHTML={{
                  __html: event.objectives || "",
                }}
              />
            </Tabs.Content>
            <Tabs.Content value="activities">
              <div
                dangerouslySetInnerHTML={{
                  __html: event.activities || "",
                }}
              />
            </Tabs.Content>
          </Tabs.Root>
        </Box>
      )}

      {/* Gallery Section */}
      {event.gallery_id && (
        <>
          <Heading as="h2" size="xl" mt={8} textAlign="left">
            Gallery
          </Heading>
          {loading ? (
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
                <Spinner size="xl" color="blue.500" borderWidth="4px" />
              </VStack>
            </Box>
          ) : (
            <Box display="flex" flexWrap="wrap" gap={4} mt={4}>
              {galleryData &&
                galleryData.images.map((image) => (
                  <Box key={image.id} position="relative">
                    <Image
                      src={image.path}
                      alt={`Gallery Image ${image.id}`}
                      boxSize="200px"
                      objectFit="cover"
                      rounded="md"
                    />
                  </Box>
                ))}
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default EventDetails;
