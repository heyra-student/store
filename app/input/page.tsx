"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase, BRANCHES, BranchName } from "@/lib/supabase";
import { Coffee, CheckCircle, AlertCircle, ArrowLeft, Send, Sparkles } from "lucide-react";

export default function InputPage() {
  const [branch, setBranch] = useState<BranchName>(BRANCHES[0]);
  const [month, setMonth] = useState<string>("2026-10");
  const [salesAmount, setSalesAmount] = useState<string>("");
  const [customerCount, setCustomerCount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 천 단위 콤마 포맷팅 도우미
  const formatNumber = (numStr: string) => {
    const raw = numStr.replace(/[^0-9]/g, "");
    if (!raw) return "";
    return Number(raw).toLocaleString("ko-KR");
  };

  const handleSalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setSalesAmount(raw);
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setCustomerCount(raw);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numericSales = parseInt(salesAmount, 10);
    const numericCustomers = parseInt(customerCount, 10);

    if (isNaN(numericSales) || numericSales <= 0) {
      setErrorMessage("유효한 매출액을 입력해 주세요.");
      return;
    }

    if (isNaN(numericCustomers) || numericCustomers <= 0) {
      setErrorMessage("유효한 객수를 입력해 주세요.");
      return;
    }

    setLoading(true);

    try {
      // Supabase sales 테이블에 삽입
      const { error } = await supabase.from("sales").insert([
        {
          월: month,
          지점: branch,
          매출액: numericSales,
          객수: numericCustomers,
          비고: note.trim() || null,
        },
      ]);

      if (error) {
        throw error;
      }

      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("매출 데이터 저장 실패:", err);
      setErrorMessage(err?.message || "매출 등록 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSalesAmount("");
    setCustomerCount("");
    setNote("");
    setShowSuccessModal(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* 뒤로가기 */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>홈으로 돌아가기</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/20">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">지점 매출 입력</h1>
            <p className="text-sm text-slate-500">
              로그인 없이 지점과 월을 선택하고 매출/객수를 등록하세요.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 지점 선택 */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              지점 선택 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {BRANCHES.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBranch(b)}
                  className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all text-center ${
                    branch === b
                      ? "border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-sm"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* 조회 연월 선택 */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              조회 연월 (년-월) <span className="text-red-500">*</span>
            </label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 bg-slate-50/50"
            />
          </div>

          {/* 매출액 입력 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-800">
                매출액 (원 단위) <span className="text-red-500">*</span>
              </label>
              {salesAmount && (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {formatNumber(salesAmount)} 원
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="예: 54320000"
                value={salesAmount}
                onChange={handleSalesChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 text-lg font-mono placeholder:text-slate-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                원
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              숫자만 입력하시면 자동으로 원화 단위로 환산되어 저장됩니다.
            </p>
          </div>

          {/* 객수 입력 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-800">
                방문 객수 (명 단위) <span className="text-red-500">*</span>
              </label>
              {customerCount && (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {formatNumber(customerCount)} 명
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="예: 6820"
                value={customerCount}
                onChange={handleCustomerChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 text-lg font-mono placeholder:text-slate-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                명
              </span>
            </div>
          </div>

          {/* 비고 / 특이사항 */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              특이사항 / 비고 (선택)
            </label>
            <textarea
              rows={3}
              placeholder="예: 추석 연휴 3일 단축 영업, 인근 도로 공사로 고객 유입 감소, 리뉴얼 오픈 등"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 text-sm placeholder:text-slate-400"
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-lg shadow-amber-600/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>저장 중...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>매출 데이터 제출하기</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 완료 팝업 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">등록되었습니다!</h3>
              <p className="text-sm text-slate-500 mt-1">
                <span className="font-semibold text-slate-800">{branch}</span>의{" "}
                <span className="font-semibold text-slate-800">{month}</span> 매출 데이터가
                Supabase에 실시간 반영되었습니다.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-1.5 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">매출액:</span>
                <span className="font-bold text-slate-800">{formatNumber(salesAmount)}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">객수:</span>
                <span className="font-bold text-slate-800">{formatNumber(customerCount)}명</span>
              </div>
              {note && (
                <div className="flex justify-between">
                  <span className="text-slate-500">비고:</span>
                  <span className="font-medium text-slate-700">{note}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                추가 등록하기
              </button>
              <Link
                href="/dashboard"
                className="py-2.5 px-4 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors text-center flex items-center justify-center"
              >
                대시보드 보기
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
