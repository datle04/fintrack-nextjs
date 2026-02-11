// proxy.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req: any) => {
  const isLoggedIn = !!req.auth; // Kiểm tra xem đã đăng nhập chưa
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");
  const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");

  // 1. Nếu đang ở trang login/register mà đã đăng nhập -> Redirect về dashboard
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // 2. Nếu chưa đăng nhập mà truy cập vào các trang bảo vệ
  if (!isLoggedIn && !isAuthPage) {
    // Nếu là API -> Trả về lỗi 401
    if (isApiRoute) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // Nếu là trang giao diện -> Redirect về login
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
});

// Chỉ chạy middleware trên các đường dẫn được liệt kê
export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/api/transaction/:path*", 
    "/api/budget/:path*",
    "/login",
    "/register"
  ],
};