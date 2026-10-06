import Link from "next/link";
import { BarChart3, Edit3, ShieldCheck, CalendarCheck, TrendingUp, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-10 py-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
          <span>☕ 오늘의원두 본사 영업관리 시스템</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          지점 매출 실시간 취합 및 성과 분석
        </h1>
        <p className="text-base text-slate-600">
          지점장님은 간편하게 매출을 입력하고, 본사와 대표님은 실시간으로 지점별 매출 추이와 공휴일 상관관계를 분석할 수 있습니다.
        </p>
      </div>

      {/* Main Action Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* 지점장 입력 카드 */}
        <Link
          href="/input"
          className="group relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-0 group-hover:bg-amber-100 transition-colors" />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/30">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                지점 매출 입력하기
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                별도 로그인 없이 용산역, 삼각지, 이태원, 효창공원, 한남 지점의 월별 매출액과 객수를 간편하게 등록합니다.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                지점 선택 및 월별 매출·객수 실시간 저장
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                단축 영업, 매장 공사 등 특이사항 비고 메모 기록
              </li>
            </ul>
          </div>
          <div className="relative z-10 pt-6">
            <span className="inline-flex items-center text-sm font-semibold text-amber-600 group-hover:translate-x-1 transition-transform">
              매출 입력 페이지 이동 &rarr;
            </span>
          </div>
        </Link>

        {/* 대표님 대시보드 카드 */}
        <Link
          href="/dashboard"
          className="group relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0 group-hover:bg-indigo-100 transition-colors" />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                대표님 대시보드
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                5개 지점의 월별 매출 추이, 전월 대비 증감률, 그리고 공휴일 수 상관관계를 통합 시각화하여 확인합니다.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                월별 총 매출액 및 5개 지점별 매출 비중 비교 차트
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                공공데이터포털 공휴일(특일 정보) 연동 매출 영향 분석
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                객단가 자동 계산 및 지점장 메모 필터링 테이블
              </li>
            </ul>
          </div>
          <div className="relative z-10 pt-6">
            <span className="inline-flex items-center text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              대시보드 바로가기 &rarr;
            </span>
          </div>
        </Link>
      </div>

      {/* Feature Highlights */}
      <div className="max-w-4xl mx-auto pt-6 border-t border-slate-200 grid sm:grid-cols-3 gap-6 text-center">
        <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
          <CalendarCheck className="w-6 h-6 text-amber-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">공휴일 수 자동 연동</h3>
          <p className="text-xs text-slate-500 mt-1">매출 변동 시 해당 월의 휴일 영향을 즉시 확인</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
          <TrendingUp className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">지점별 객단가 자동 계산</h3>
          <p className="text-xs text-slate-500 mt-1">매출과 객수를 기반으로 건당 객단가 자동 산출</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">데이터 무결성 & 보안</h3>
          <p className="text-xs text-slate-500 mt-1">Supabase DB 실시간 저장 및 환경변수 격리</p>
        </div>
      </div>
    </div>
  );
}
