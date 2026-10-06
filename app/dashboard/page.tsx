"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { supabase, SaleRecord, BRANCHES } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Filter,
  RefreshCw,
  PlusCircle,
  HelpCircle,
  Coffee,
  AlertTriangle,
} from "lucide-react";

interface HolidayMap {
  [yearMonth: string]: { count: number; holidayNames: string[] };
}

export default function DashboardPage() {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [holidays, setHolidays] = useState<HolidayMap>({});
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");
  const [selectedBranch, setSelectedBranch] = useState<string>("ALL");
  const [chartType, setChartType] = useState<"composed" | "branch">("composed");

  // 데이터 불러오기
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Supabase sales 테이블 데이터 조회
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .order("월", { ascending: true })
        .order("지점", { ascending: true });

      if (error) {
        throw error;
      }

      const salesData = (data as SaleRecord[]) || [];
      setSales(salesData);

      // 2. 고유 월 목록 추출 후 공휴일 정보 조회
      const uniqueMonths = Array.from(new Set(salesData.map((d) => d.월))).sort();
      if (uniqueMonths.length > 0) {
        const res = await fetch(`/api/holidays?month=${uniqueMonths.join(",")}`);
        if (res.ok) {
          const json = await res.json();
          const map: HolidayMap = {};
          json.holidays.forEach((h: any) => {
            map[h.yearMonth] = { count: h.count, holidayNames: h.holidayNames };
          });
          setHolidays(map);
        }
      }
    } catch (err) {
      console.error("데이터 로딩 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 월별 고유 목록
  const monthsList = useMemo(() => {
    return Array.from(new Set(sales.map((s) => s.월))).sort();
  }, [sales]);

  // 최신 월 및 전월 데이터 분석
  const latestMonth = monthsList[monthsList.length - 1] || "";
  const previousMonth = monthsList[monthsList.length - 2] || "";

  const latestStats = useMemo(() => {
    if (!latestMonth) return { totalSales: 0, totalCustomers: 0, salesGrowth: 0, customerGrowth: 0, avgTicket: 0, holidayCount: 0 };

    const currentRecords = sales.filter((s) => s.월 === latestMonth);
    const prevRecords = sales.filter((s) => s.월 === previousMonth);

    const totalSales = currentRecords.reduce((acc, c) => acc + Number(c.매출액), 0);
    const totalCustomers = currentRecords.reduce((acc, c) => acc + Number(c.객수), 0);
    const avgTicket = totalCustomers > 0 ? Math.round(totalSales / totalCustomers) : 0;

    const prevSales = prevRecords.reduce((acc, c) => acc + Number(c.매출액), 0);
    const prevCustomers = prevRecords.reduce((acc, c) => acc + Number(c.객수), 0);

    const salesGrowth = prevSales > 0 ? ((totalSales - prevSales) / prevSales) * 100 : 0;
    const customerGrowth = prevCustomers > 0 ? ((totalCustomers - prevCustomers) / prevCustomers) * 100 : 0;

    const holidayCount = holidays[latestMonth]?.count || 0;

    return {
      totalSales,
      totalCustomers,
      salesGrowth,
      customerGrowth,
      avgTicket,
      holidayCount,
      prevSalesDiff: totalSales - prevSales,
    };
  }, [sales, latestMonth, previousMonth, holidays]);

  // 차트 데이터 가공 (월별 총 매출 & 공휴일 수)
  const monthlyChartData = useMemo(() => {
    return monthsList.map((m) => {
      const monthRecords = sales.filter((s) => s.월 === m);
      const totalSales = monthRecords.reduce((acc, c) => acc + Number(c.매출액), 0);
      const totalCustomers = monthRecords.reduce((acc, c) => acc + Number(c.객수), 0);
      const holidayInfo = holidays[m] || { count: 0, holidayNames: [] };

      // 지점별 매출액 매핑
      const branchSales: Record<string, number> = {};
      BRANCHES.forEach((b) => {
        const found = monthRecords.find((r) => r.지점 === b);
        branchSales[b] = found ? Number(found.매출액) : 0;
      });

      return {
        월: m,
        월표시: `${m.split("-")[1]}월`,
        총매출: totalSales,
        총매출만원: Math.round(totalSales / 10000),
        총객수: totalCustomers,
        공휴일수: holidayInfo.count,
        공휴일목록: holidayInfo.holidayNames.join(", "),
        ...branchSales,
      };
    });
  }, [monthsList, sales, holidays]);

  // 필터링된 테이블 데이터
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchMonth = selectedMonth === "ALL" || s.월 === selectedMonth;
      const matchBranch = selectedBranch === "ALL" || s.지점 === selectedBranch;
      return matchMonth && matchBranch;
    });
  }, [sales, selectedMonth, selectedBranch]);

  // 금액 포맷터
  const formatWon = (num: number) => {
    return num.toLocaleString("ko-KR") + "원";
  };

  const formatTenThousand = (num: number) => {
    return (num / 10000).toLocaleString("ko-KR", { maximumFractionDigits: 0 }) + "만원";
  };

  // 5개 지점 고유 색상
  const branchColors: Record<string, string> = {
    용산역점: "#f59e0b", // Amber
    삼각지점: "#3b82f6", // Blue
    이태원점: "#10b981", // Emerald
    효창공원점: "#8b5cf6", // Purple
    한남점: "#ec4899", // Pink
  };

  return (
    <div className="space-y-8 py-2">
      {/* 상단 타이틀 & 컨트롤 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              경영진 & 영업관리팀 전용
            </span>
            <span className="text-xs text-slate-400">데이터 실시간 연동</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            지점 매출 통합 대시보드
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            5개 지점의 월별 매출 실적과 공휴일(특일 정보) 상관관계를 분석합니다.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-600" : ""}`} />
            <span>새로고침</span>
          </button>
          <Link
            href="/input"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-amber-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>매출 등록</span>
          </Link>
        </div>
      </div>

      {/* 1. 요약 카드 (Summary Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 최신 월 총 매출 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {latestMonth} 총 매출
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatWon(latestStats.totalSales)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            {latestStats.salesGrowth >= 0 ? (
              <span className="inline-flex items-center font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +{latestStats.salesGrowth.toFixed(1)}%
              </span>
            ) : (
              <span className="inline-flex items-center font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                {latestStats.salesGrowth.toFixed(1)}%
              </span>
            )}
            <span className="text-slate-400">전월 대비 ({formatTenThousand(latestStats.prevSalesDiff || 0)})</span>
          </div>
        </div>

        {/* 최신 월 총 방문 객수 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {latestMonth} 총 객수
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {latestStats.totalCustomers.toLocaleString("ko-KR")}명
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            {latestStats.customerGrowth >= 0 ? (
              <span className="inline-flex items-center font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +{latestStats.customerGrowth.toFixed(1)}%
              </span>
            ) : (
              <span className="inline-flex items-center font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                {latestStats.customerGrowth.toFixed(1)}%
              </span>
            )}
            <span className="text-slate-400">전월 대비 객수 변동</span>
          </div>
        </div>

        {/* 평균 객단가 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {latestMonth} 평균 객단가
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatWon(latestStats.avgTicket)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            고객 1인당 평균 지출 금액
          </div>
        </div>

        {/* 해당 월 공휴일 수 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {latestMonth} 공휴일 (빨간날)
              </p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {latestStats.holidayCount}일
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500 truncate" title={holidays[latestMonth]?.holidayNames.join(", ")}>
            {holidays[latestMonth]?.holidayNames.length
              ? holidays[latestMonth]?.holidayNames.join(", ")
              : "공휴일 없음 (평일 위주)"}
          </div>
        </div>
      </div>

      {/* 2. 핵심 시각화 차트 (Recharts) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>월별 매출 추이 & 공휴일 수 연동 분석</span>
              <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                대표님 핵심 질문 해결
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              막대 그래프는 <strong>월별 총 매출</strong>을, 붉은색 꺾은선은 <strong>그 달의 공휴일 수</strong>를 나타냅니다.
            </p>
          </div>

          {/* 차트 뷰 전환 탭 */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setChartType("composed")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartType === "composed"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              총매출 & 공휴일 복합 차트
            </button>
            <button
              onClick={() => setChartType("branch")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartType === "branch"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              5개 지점별 매출 비교
            </button>
          </div>
        </div>

        {/* 차트 렌더링 */}
        <div className="h-80 sm:h-96 w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              차트 데이터를 불러오는 중입니다...
            </div>
          ) : chartType === "composed" ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={monthlyChartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="월표시" stroke="#64748b" fontSize={12} />
                <YAxis
                  yAxisId="left"
                  stroke="#f59e0b"
                  fontSize={12}
                  tickFormatter={(val) => `${(val / 10000).toLocaleString()}만`}
                  label={{ value: "매출액 (원)", angle: -90, position: "insideLeft", fontSize: 11, fill: "#94a3b8" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#ef4444"
                  fontSize={12}
                  domain={[0, 6]}
                  tickCount={7}
                  label={{ value: "공휴일 (일)", angle: 90, position: "insideRight", fontSize: 11, fill: "#ef4444" }}
                />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    if (name === "총매출액") return [formatWon(Number(value)), name];
                    if (name === "공휴일 수") return [`${value}일`, name];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `${label} 실적`}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-lg text-xs space-y-1.5">
                          <p className="font-bold text-slate-800 border-b pb-1">
                            {data.월} ({label})
                          </p>
                          <div className="flex justify-between gap-4 text-amber-700">
                            <span>총 매출액:</span>
                            <span className="font-bold">{formatWon(data.총매출)}</span>
                          </div>
                          <div className="flex justify-between gap-4 text-blue-700">
                            <span>방문 객수:</span>
                            <span className="font-bold">{data.총객수.toLocaleString()}명</span>
                          </div>
                          <div className="flex justify-between gap-4 text-rose-600 font-bold border-t pt-1">
                            <span>공휴일 수:</span>
                            <span>{data.공휴일수}일 ({data.공휴일목록 || "휴일 없음"})</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  yAxisId="left"
                  dataKey="총매출"
                  name="총매출액"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="공휴일수"
                  name="공휴일 수"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyChartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="월표시" stroke="#64748b" fontSize={12} />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(val) => `${(val / 10000000).toFixed(0)}천만`}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [formatWon(Number(val)), name]}
                />
                <Legend verticalAlign="top" height={36} />
                {BRANCHES.map((b) => (
                  <Line
                    key={b}
                    type="monotone"
                    dataKey={b}
                    name={b}
                    stroke={branchColors[b] || "#6366f1"}
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 대표님 질의에 대한 분석 메모 카드 */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              💡 대표님 보고용 핵심 인사이트 (공휴일 & 매출 관계):
            </p>
            <p className="text-amber-800 leading-relaxed">
              <strong>9월</strong>의 경우 추석 연휴 및 대체공휴일로 인해 <strong>공휴일이 4일</strong>에 달했으며, 
              이태원점 등 일부 매장의 단축 영업(3일) 및 공사 여파로 인해 전월(8월) 대비 총 매출이 소폭 감소한 원인을 
              공휴일 지표를 통해 명확히 소명할 수 있습니다. 반면 <strong>7월</strong>은 공휴일이 0일이었으나 
              여름철 성수기 효과로 높은 매출을 기록했습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 3. 지점별 상세 내역 테이블 (Table with Filters) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* 테이블 필터 헤더 */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">지점별 상세 실적 내역</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              총 {filteredSales.length}건 조회 (객단가 자동 계산 및 지점장 메모 확인)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* 월 필터 */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium">월:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="ALL">전체 월</option>
                {monthsList.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* 지점 필터 */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium">지점:</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="ALL">전체 지점</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th scope="col" className="py-3.5 px-6">
                  월
                </th>
                <th scope="col" className="py-3.5 px-6">
                  지점
                </th>
                <th scope="col" className="py-3.5 px-6 text-right">
                  매출액 (원)
                </th>
                <th scope="col" className="py-3.5 px-6 text-right">
                  객수 (명)
                </th>
                <th scope="col" className="py-3.5 px-6 text-right">
                  객단가 (원)
                </th>
                <th scope="col" className="py-3.5 px-6">
                  비고 / 특이사항
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 text-sm">
                    조건에 해당하는 매출 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredSales.map((row, idx) => {
                  const unitPrice =
                    row.객수 > 0 ? Math.round(Number(row.매출액) / Number(row.객수)) : 0;
                  return (
                    <tr
                      key={row.id || `${row.월}-${row.지점}-${idx}`}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3.5 px-6 font-semibold text-slate-900">
                        {row.월}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${branchColors[row.지점] || "#64748b"}15`,
                            color: branchColors[row.지점] || "#64748b",
                          }}
                        >
                          {row.지점}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono font-bold text-slate-900">
                        {formatWon(Number(row.매출액))}
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono text-slate-700">
                        {Number(row.객수).toLocaleString("ko-KR")}명
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono text-amber-700 font-medium">
                        {formatWon(unitPrice)}
                      </td>
                      <td className="py-3.5 px-6 text-xs text-slate-500">
                        {row.비고 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60 font-medium">
                            {row.비고}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
