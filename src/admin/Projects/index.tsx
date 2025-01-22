import { CardBody, CardRoot, Tabs } from "@chakra-ui/react";
import AdminLayout from "../Layout";
import { useState } from "react";

const ProjectSection = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const renderContent = () => {
    switch (activeTab) {
      case "all":
        return <h1> All </h1>;
      case "past":
        return <h1> PAst </h1>;
      case "ongoing":
        return <h1> On </h1>;
      case "upcoming":
        return <h1> Up </h1>;
    }
  };

  return (
    <AdminLayout
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Projects" },
      ]}
      title={`Projects Section`}
      activeSidebarItem="Projects"
    >
      <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
        <Tabs.List>
          <Tabs.Trigger value="all"> All Projects </Tabs.Trigger>
          <Tabs.Trigger value="past"> Past Projects </Tabs.Trigger>
          <Tabs.Trigger value="ongoing"> Ongoing Projects </Tabs.Trigger>
          <Tabs.Trigger value="upcoming"> Upcoming Projects</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value={activeTab}>
          <CardRoot>
            <CardBody>{renderContent()}</CardBody>
          </CardRoot>
        </Tabs.Content>
      </Tabs.Root>
    </AdminLayout>
  );
};

export default ProjectSection;
