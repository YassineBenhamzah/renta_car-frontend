import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./admin/AdminDashboard";
import AgentDashboard from "./agent/AgentDashboard"; // Create this file or inline valid component
import UserDashboard from "./user/UserDashboard"; // <--- Import the REAL UserDashboard

export default function Dashboard() {
  const { user } = useAuth(); // Assuming useAuth provides the user object

  if (!user) {
    return <div>Loading...</div>; // Or redirect
  }

  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user.role === 'agent') {
    return <AgentDashboard />;
  }

  return <UserDashboard />;
}