import AdminLayout from "../Layout";
import InsightCard from "./InsightCard";
import DashboardMessageRequest from "./MessageRequestTable";
import GraphContainer from "./GraphContainer";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/api/axios";
import { ChartData } from "@/utils/types";

interface EventDashboardGraph extends ChartData {
  name: string;
  events: number;
}

interface WorkDashboardGraph extends ChartData {
  name: string;
  works: number;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const breadcrumbItems = [{ label: "Dashboard", link: "/admin" }];
  const [eventByProvince, setEventByProvince] = useState<EventDashboardGraph[]>(
    []
  );
  const [eventByCity, setEventByCity] = useState<EventDashboardGraph[]>([]);
  const [eventByDate, setEventByDate] = useState<EventDashboardGraph[]>([]);
  const [workByCity, setWorkByCity] = useState<WorkDashboardGraph[]>([]);
  const [workByProvince, setWorkByProvince] = useState<WorkDashboardGraph[]>(
    []
  );
  const [workByDate, setWorkByDate] = useState<WorkDashboardGraph[]>([]);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/graphs");
        const result = res.data.data;

        const eventDataByCity: EventDashboardGraph[] = Object.entries(
          result.event_location_counts_by_category
            .banner_location_cityordistrict
        ).map(([name, events]) => ({
          name,
          events: events as number,
        }));

        const eventDataByProvince: EventDashboardGraph[] = Object.entries(
          result.event_location_counts_by_category
            .banner_location_stateorprovince
        ).map(([name, events]) => ({
          name,
          events: events as number,
        }));

        const eventDataByDate: EventDashboardGraph[] = Object.entries(
          result.event_date_counts
        ).map(([name, events]) => ({
          name,
          events: events as number,
        }));

        const workDataByCity: WorkDashboardGraph[] = Object.entries(
          result.work_location_counts_by_category.banner_location_cityordistrict
        ).map(([name, events]) => ({
          name,
          works: events as number,
        }));

        const workDataByProvince: WorkDashboardGraph[] = Object.entries(
          result.work_location_counts_by_category
            .banner_location_stateorprovince
        ).map(([name, events]) => ({
          name,
          works: events as number,
        }));

        const workDataByDate: WorkDashboardGraph[] = Object.entries(
          result.work_date_counts
        ).map(([name, events]) => ({
          name,
          works: events as number,
        }));

        setEventByCity(eventDataByCity);
        setEventByProvince(eventDataByProvince);
        setEventByDate(eventDataByDate);
        setWorkByCity(workDataByCity);
        setWorkByProvince(workDataByProvince);
        setWorkByDate(workDataByDate);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
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
      <InsightCard />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "25px",
          width: "100%", // Ensure the container takes full width
        }}
      >
        <div
          style={{
            flex: "1 1 calc(50% - 10px)",
            marginBottom: "20px",
            minWidth: "300px",
          }}
        >
          <GraphContainer
            loading={loading}
            data={workByCity}
            dataKey="works"
            title="Works by City"
            yLabel="No. of Work"
          />
        </div>
        <div
          style={{
            flex: "1 1 calc(50% - 10px)",
            marginBottom: "20px",
            minWidth: "300px",
          }}
        >
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
          width: "100%", // Ensure the container takes full width
        }}
      >
        <div
          style={{
            flex: "1 1 calc(50% - 10px)",
            marginBottom: "20px",
            minWidth: "300px",
          }}
        >
          <GraphContainer
            loading={loading}
            data={workByProvince}
            dataKey="works"
            title="Works by Province"
            yLabel="No. of Work"
          />
        </div>
        <div
          style={{
            flex: "1 1 calc(50% - 10px)",
            marginBottom: "20px",
            minWidth: "300px",
          }}
        >
          <GraphContainer
            loading={loading}
            data={eventByProvince}
            dataKey="events"
            title="Event by Province"
            yLabel="No. of Events"
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "25px",
          width: "100%", // Ensure the container takes full width
        }}
      >
        <div
          style={{
            flex: "1 1 calc(50% - 10px)",
            marginBottom: "20px",
            minWidth: "300px",
          }}
        >
          <GraphContainer
            loading={loading}
            data={eventByCity}
            dataKey="events"
            title="Events by City"
            yLabel="No. of Events"
          />
        </div>
        <div
          style={{
            flex: "1 1 calc(50% - 10px)",
            marginBottom: "20px",
            minWidth: "300px",
          }}
        >
          <GraphContainer
            loading={loading}
            data={eventByDate}
            dataKey="events"
            title="Events by Date"
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
