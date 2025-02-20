import { ProtectedRoute } from "@/components/ProtectedRoute";


export default function Dashboard() {
  return (
    <ProtectedRoute roles={['user', 'admin']}>
      <div>User Dashboard</div>
    </ProtectedRoute>
  );
}