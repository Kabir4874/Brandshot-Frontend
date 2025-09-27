import RequireAuth from "@/guards/RequireAuth";

const layout = ({ children }: any) => {
  return <RequireAuth>{children}</RequireAuth>;
};

export default layout;
