import AdminLayout from "../Layout";

import { Container } from "@chakra-ui/react";
import InsightCard from "./InsightCard";
import DashboardMessageRequest from "./MessageRequestTable";
import GraphContainer from "./GraphContainer";

const projectDataByProvince = [
  { name: "Bagmati", projects: 120 },
  { name: "Gandaki", projects: 80 },
  { name: "Lumbini", projects: 95 },
  { name: "Karnali", projects: 60 },
  { name: "Sudurpashchim", projects: 70 },
];

const eventDataByCity = [
  { name: "Kathmandu", events: 40 },
  { name: "Pokhara", events: 35 },
  { name: "Butwal", events: 25 },
  { name: "Biratnagar", events: 30 },
  { name: "Dhangadhi", events: 20 },
];

const eventDataByTime = [
  { name: "Past Events", events: 100 },
  { name: "Present Events", events: 50 },
  { name: "Future Events", events: 70 },
];

const AdminDashboard = () => {
  // Set the default chartType to "Line"
  const breadcrumbItems = [{ label: "Dashboard", link: "/admin" }];

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
            data={projectDataByProvince}
            dataKey="projects"
            title="Projects by Province"
            yLabel="No. of Projects"
          />
        </div>

        <div style={{ flex: "1 1 calc(50% - 10px)", marginBottom: "20px" }}>
          <GraphContainer
            data={eventDataByCity}
            dataKey="events"
            title="Events by City"
            yLabel="No. of Events"
          />
        </div>

        <div style={{ flex: "1 1 calc(50% - 10px)", marginBottom: "20px" }}>
          <GraphContainer
            data={eventDataByTime}
            dataKey="events"
            title="Events by Time"
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
