import { axiosInstance } from "@/api/axios";
import {
  Box,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Text,
  Skeleton,
  useBreakpointValue,
  CardRoot,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiBriefcase, FiCalendar, FiMail, FiUsers } from "react-icons/fi";
import { LuQuote } from "react-icons/lu";

interface InsightData {
  counts: {
    works: number;
    events: number;
    teams: number;
    testimonials: number;
    messages: number;
  };
}

// Framer Motion variants for scaling animation
const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

const InsightCard = () => {
  const [insightData, setInsightData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchInsightData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get<{ data: InsightData }>(
          "/dashboard/count"
        );
        setInsightData(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchInsightData();
  }, []);

  // Capitalize the first word of a string
  const capitalizeFirstWord = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Responsive columns for the grid
  const columns = useBreakpointValue({ base: 1, md: 3, lg: 5 });

  const iconMap: Record<string, JSX.Element> = {
    works: <FiBriefcase size={24} />,
    events: <FiCalendar size={24} />,
    teams: <FiUsers size={24} />,
    testimonials: <LuQuote size={24} />,
    messages: <FiMail size={24} />,
  };

  return (
    <Box>
      <Heading mb={5}>Dashboard Insights</Heading>
      <SimpleGrid columns={columns} gap={5}>
        {loading
          ? // Show skeleton loading while data is being fetched
            Array.from({ length: 5 }).map((_, index) => (
              <CardRoot key={index} textAlign="center" p={4}>
                <CardHeader>
                  <Skeleton height="20px" width="80%" mx="auto" />
                </CardHeader>
                <CardBody>
                  <Skeleton height="30px" width="60%" mx="auto" />
                </CardBody>
              </CardRoot>
            ))
          : // Render actual data once loaded
            insightData &&
            Object.entries(insightData.counts).map(([key, value]) => (
              <motion.div
                key={key}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5 }}
              >
                <CardRoot textAlign="center" p={4}>
                  <CardHeader>
                    <HStack justify="center" gap={2}>
                      {iconMap[key]} {/* Icon beside heading */}
                      <Heading size="md">{capitalizeFirstWord(key)}</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <Text fontSize="xl" fontWeight="bold">
                      {value}
                    </Text>
                  </CardBody>
                </CardRoot>
              </motion.div>
            ))}
      </SimpleGrid>
    </Box>
  );
};

export default InsightCard;
