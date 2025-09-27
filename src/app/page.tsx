import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectsTable from "@/components/dashboard/Projects";
import RequireAuth from "@/guards/RequireAuth";

const Page = () => {
  return (
    <RequireAuth>
      <div className="bg-nano-deep-950 min-h-screen pt-8">
        <DashboardHeader />
        <ProjectsTable />
      </div>
    </RequireAuth>
  );
};

export default Page;
