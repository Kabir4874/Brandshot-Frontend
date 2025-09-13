import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectsTable from "@/components/dashboard/Projects";
import React from "react";

const Page = () => {
  return (
    <div>
      <DashboardHeader />
      <ProjectsTable/>
    </div>
  );
};

export default Page;
