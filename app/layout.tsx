import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Coffee, BarChart3, Edit3 } from "lucide-react";

export const metadata: Metadata = {
  title: "오늘의원두 | 지점 매출 관리 대시보드",
  description: "카페 프랜차이즈 오늘의원두 본사 및 지점 매출 통합 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 block leading-tight">오늘의원두</span>
                <span className="text-xs text-slate-500 block">지점 매출 관리 시스템</span>
              </div>
            </Link>

            <nav className="flex items-center space-x-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-amber-600" />
                <span>대표님 대시보드</span>
              </Link>
              <Link
                href="/input"
                className="flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 shadow-sm shadow-amber-600/25 transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>지점 매출 입력</span>
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <p>© 2026 오늘의원두 영업관리팀. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
