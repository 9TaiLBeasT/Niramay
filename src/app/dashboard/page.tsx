import DashboardNavbar from "@/components/dashboard-navbar";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import CitizenDashboard from "@/components/dashboards/citizen-dashboard";
import AdminDashboard from "@/components/dashboards/admin-dashboard";
import WorkerDashboard from "@/components/dashboards/worker-dashboard";
import RoleSetup from "@/components/role-setup";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user role
  const { data: userRole } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // If no role is set, show role setup
  if (!userRole) {
    return (
      <>
        <DashboardNavbar />
        <RoleSetup userId={user.id} />
      </>
    );
  }

  // Render appropriate dashboard based on role
  const renderDashboard = () => {
    switch (userRole.role) {
      case "citizen":
        return <CitizenDashboard user={user} userRole={userRole} />;
      case "admin":
        return <AdminDashboard user={user} userRole={userRole} />;
      case "worker":
        return <WorkerDashboard user={user} userRole={userRole} />;
      default:
        return <CitizenDashboard user={user} userRole={userRole} />;
    }
  };

  return (
    <>
      <DashboardNavbar />
      {renderDashboard()}
    </>
  );
}
