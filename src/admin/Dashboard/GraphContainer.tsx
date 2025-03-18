import {
  BarChart,
  LineChart,
  PieChart,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState } from "react";
import { Box, Heading, Flex, VStack, Text } from "@chakra-ui/react";
import { ChartData } from "@/utils/types";
import { FiBarChart2, FiPieChart, FiTable } from "react-icons/fi";
import { LuChartLine } from "react-icons/lu";
import TooltipButton from "./ToolTipButton";
import { Skeleton } from "@/components/ui/skeleton";
import { HiSwatch } from "react-icons/hi2";

interface GraphContainerProps {
  data: ChartData[];
  dataKey: string;
  title: string | React.ReactNode;
  xLabel?: string;
  yLabel?: string;
  loading: boolean;
}

const GraphContainer = ({
  data,
  dataKey,
  title,
  xLabel,
  yLabel,
  loading = false,
}: GraphContainerProps) => {
  const [chartType, setChartType] = useState<"Bar" | "Line" | "Pie" | "Table">(
    "Bar"
  );
  console.log(data);

  const renderChart = () => {
    if (loading) {
      return (
        <Box textAlign="center" py={10}>
          <VStack gap={4} align="stretch">
            <Skeleton height="20px" />
            <Skeleton height="200px" />
            <Skeleton height="20px" />
          </VStack>
        </Box>
      );
    }

    if (data.length === 0) {
      return (
        <Box textAlign="center" py={10}>
          <Box
            as={HiSwatch} // Use the HISwatch icon component
            boxSize="50px"
            opacity={0.5}
            mx="auto"
            mb={4}
          />
          <Text fontSize="lg" color="gray.500">
            No data found.
          </Text>
        </Box>
      );
    }

    switch (chartType) {
      case "Line":
        return (
          <LineChart data={data}>
            <XAxis
              dataKey="name"
              label={{ value: xLabel, position: "insideBottom", offset: -5 }}
            />
            <YAxis
              label={{ value: yLabel, angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
          </LineChart>
        );
      case "Pie":
        return (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            />
          </PieChart>
        );
      case "Table":
        return (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "left",
                    backgroundColor: "#f4f4f4",
                  }}
                >
                  Category
                </th>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "left",
                    backgroundColor: "#f4f4f4",
                  }}
                >
                  {yLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.name}>
                  <td
                    style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                  >
                    {item.name}
                  </td>
                  <td
                    style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                  >
                    {item[dataKey]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return (
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              label={{ value: xLabel, position: "insideBottom", offset: -5 }}
            />
            <YAxis
              label={{ value: yLabel, angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill="#8884d8" />
          </BarChart>
        );
    }
  };

  return (
    <Box
      background="white"
      borderRadius="8px"
      padding="16px"
      boxShadow="0 2px 4px rgba(0,0,0,0.1)"
      marginBottom="20px"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">{title}</Heading>
        <Flex gap={2}>
          {[
            { type: "Bar", icon: <FiBarChart2 size={18} /> },
            { type: "Line", icon: <LuChartLine size={18} /> },
            { type: "Pie", icon: <FiPieChart size={18} /> },
            { type: "Table", icon: <FiTable size={18} /> },
          ].map(({ type, icon }) => (
            <>
              <TooltipButton
                key={type}
                type={type}
                icon={icon}
                isActive={chartType === type}
                onClick={() =>
                  setChartType(type as "Bar" | "Line" | "Pie" | "Table")
                }
              />
            </>
          ))}
        </Flex>
      </Flex>
      <Box padding="16px">
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default GraphContainer;
