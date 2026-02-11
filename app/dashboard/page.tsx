import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth(); // Lấy session ở Server Side

  return (
    <div className="p-10">
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      {/* Kiểm tra xem có session.user.id và session.user.role không */}
    </div>
  );
}