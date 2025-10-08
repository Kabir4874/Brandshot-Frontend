import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectsTable from "@/components/dashboard/Projects";
import RequireAuth from "@/guards/RequireAuth";

const Page = () => {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-white text-nano-deep-900 dark:bg-nano-deep-950 dark:text-nano-white pt-8">
        <DashboardHeader />
        <ProjectsTable />
      </div>
    </RequireAuth>
  );
};

export default Page;
