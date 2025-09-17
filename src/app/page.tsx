import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectsTable from "@/components/dashboard/Projects";

const Page = () => {
  return (
    <div className="bg-nano-deep-950 min-h-screen pt-8">
      <DashboardHeader />
      <ProjectsTable />
    </div>
  );
};

export default Page;
