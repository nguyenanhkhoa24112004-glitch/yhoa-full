import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import mongoose from "mongoose";

export const revalidate = 0;

export default async function UsersManagementPage() {
  await dbConnect();

  const users = await User.find({}, "name email role createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const conn = mongoose.connection;
  const dbName = conn.name;
  const host = (conn as any).host ?? "unknown";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Người dùng đã đăng ký</h1>
      <p className="mb-6 text-sm text-gray-600">DB: <code>{host}/{dbName}</code></p>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b p-3 text-left">Tên</th>
              <th className="border-b p-3 text-left">Email</th>
              <th className="border-b p-3 text-left">Vai trò</th>
              <th className="border-b p-3 text-left">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={String(u._id)} className="odd:bg-white even:bg-gray-50">
                <td className="border-b p-3">{u.name || "(Không có tên)"}</td>
                <td className="border-b p-3">{u.email}</td>
                <td className="border-b p-3">{u.role}</td>
                <td className="border-b p-3">
                  {new Date(u.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-600">
                  Chưa có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-gray-700">
        Đường dẫn trang: <code>/quan-ly/nguoi-dung</code>
      </p>
    </div>
  );
}