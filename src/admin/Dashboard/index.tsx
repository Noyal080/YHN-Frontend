import AdminLayout from "../Layout";

import { Container } from "@chakra-ui/react";
import InsightCard from "./InsightCard";
import DashboardMessageRequest from "./MessageRequestTable";
import GraphContainer from "./GraphContainer";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/api/axios";
import { ChartData } from "@/utils/types";

interface DashboardGraph extends ChartData {
  name: string;
  events: number;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  // Set the default chartType to "Line"
  const breadcrumbItems = [{ label: "Dashboard", link: "/admin" }];
  const [eventByCity, setEventByCity] = useState<DashboardGraph[]>([]);
  const [eventByDate, setEventByDate] = useState<DashboardGraph[]>([]);
  const [workByCity, setWorkByCity] = useState<DashboardGraph[]>([]);
  const [workByDate, setWorkByDate] = useState<DashboardGraph[]>([]);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/graphs");
        const result = res.data.data;
        const eventLocationCounts = result.event_location_counts;
        const eventDateCounts = result.event_date_counts;
        const workLocationCounts = result.work_location_counts;
        const workDateCounts = result.work_date_counts;
        // Transform the data into the desired format
        const eventDataByCity: DashboardGraph[] = Object.entries(
          eventLocationCounts
        ).map(([name, events]) => ({
          name,
          events: events as number, // Ensure events is treated as a number
        }));

        const eventDataByDate: DashboardGraph[] = Object.entries(
          eventDateCounts
        ).map(([name, events]) => ({
          name,
          events: events as number, // Ensure events is treated as a number
        }));

        const workDataByDate: DashboardGraph[] = Object.entries(
          workDateCounts
        ).map(([name, events]) => ({
          name,
          events: events as number, // Ensure events is treated as a number
        }));

        const workDataByLocation: DashboardGraph[] = Object.entries(
          workLocationCounts
        ).map(([name, events]) => ({
          name,
          events: events as number, // Ensure events is treated as a number
        }));

        // Set the state with the transformed data
        setEventByCity(eventDataByCity);
        setEventByDate(eventDataByDate);
        setWorkByCity(workDataByLocation);
        setWorkByDate(workDataByDate);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchGraphData();
  }, []);

  return (
    <AdminLayout
      breadcrumbItems={breadcrumbItems}
      title="Admin HomePage"
      activeSidebarItem="Dashboard"
    >
      <Container maxW="container.xl">
        <InsightCard />
      </Container>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "25px",
        }}
      >
        <div style={{ flex: "1 1 calc(50% - 10px)", marginBottom: "20px" }}>
          <GraphContainer
            loading={loading}
            data={workByCity}
            dataKey="works"
            title="Works by Province"
            yLabel="No. of Work"
          />
        </div>
        <div style={{ flex: "1 1 calc(50% - 10px)", marginBottom: "20px" }}>
          <GraphContainer
            loading={loading}
            data={workByDate}
            dataKey="works"
            title="Works by Date"
            yLabel="No. of Work"
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "25px",
        }}
      >
        <div style={{ flex: "1 1 calc(50% - 10px)", marginBottom: "20px" }}>
          <GraphContainer
            loading={loading}
            data={eventByDate}
            dataKey="events"
            title="Events by Date"
            yLabel="No. of Events"
          />
        </div>
        <div style={{ flex: "1 1 calc(50% - 10px)", marginBottom: "20px" }}>
          <GraphContainer
            loading={loading}
            data={eventByCity}
            dataKey="events"
            title="Events by City"
            yLabel="No. of Events"
          />
        </div>
      </div>

      <div>
        <DashboardMessageRequest />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
