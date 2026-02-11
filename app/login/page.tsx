'use client';
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Gọi hàm signIn của NextAuth
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: true,
      redirectTo: "/dashboard",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-10">
      <input name="email" type="email" placeholder="Email" className="border p-2" />
      <input name="password" type="password" placeholder="Password" className="border p-2" />
      <button type="submit" className="bg-blue-500 text-white p-2">Đăng nhập</button>
    </form>
  );
}