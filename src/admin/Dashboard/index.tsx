import { ChartData } from "@/utils/types";
import AdminLayout from "../Layout";
import { useState } from "react";
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

const chartTypes = ["Bar", "Line", "Pie", "Table"];

const AdminDashboard = () => {
  // Set the default chartType to "Line"
  const [chartType, setChartType] = useState("Line");
  const breadcrumbItems = [{ label: "Dashboard", link: "/admin" }];

  const renderChart = (
    data: ChartData[],
    dataKey: string,
    xLabel: string,
    yLabel: string
  ) => {
    if (chartType === "Line") {
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
    }
    if (chartType === "Pie") {
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
    }
    if (chartType === "Table") {
      return (
        <table
          className="table table-bordered"
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
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                  {item.name}
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                  {item[dataKey]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return (
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          label={{ value: xLabel, position: "insideBottom", offset: -5 }}
        />
        <YAxis label={{ value: yLabel, angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill="#8884d8" />
      </BarChart>
    );
  };

  return (
    <AdminLayout
      breadcrumbItems={breadcrumbItems}
      title="Admin HomePage"
      activeSidebarItem="Dashboard"
    >
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "24px",
        }}
      >
        <select
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
            fontSize: "1rem",
          }}
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          {chartTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {/* Chart 1 and Chart 2 in the same row */}
        <div style={{ flex: "1 1 calc(50% - 10px)", marginBottom: "20px" }}>
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", marginBottom: "12px" }}>
              Projects by Province
            </h2>
            <div style={{ padding: "16px" }}>
              <ResponsiveContainer width="100%" height={300}>
                {renderChart(
                  projectDataByProvince,
                  "projects",
                  "",
                  "No. of Projects"
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ flex: "1 1 calc(50% - 10px)", marginBottom: "20px" }}>
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", marginBottom: "12px" }}>
              Events by City
            </h2>
            <div style={{ padding: "16px" }}>
              <ResponsiveContainer width="100%" height={300}>
                {renderChart(eventDataByCity, "events", "", "No. of Events")}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 3 and Chart 4 in the same row */}
        <div style={{ flex: "1 1 calc(50% - 10px)", marginBottom: "20px" }}>
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", marginBottom: "12px" }}>
              Events by Time
            </h2>
            <div style={{ padding: "16px" }}>
              <ResponsiveContainer width="100%" height={300}>
                {renderChart(eventDataByTime, "events", "", "No. of Events")}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
