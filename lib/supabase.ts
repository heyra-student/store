import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase 환경 변수가 설정되지 않았습니다. .env.local을 확인해 주세요.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SaleRecord {
  id?: number;
  월: string; // e.g. '2026-03'
  지점: string; // e.g. '용산역점'
  매출액: number; // 원 단위
  객수: number; // 방문객 수
  비고?: string | null; // 특이사항
  created_at?: string;
}

export const BRANCHES = [
  "용산역점",
  "삼각지점",
  "이태원점",
  "효창공원점",
  "한남점",
] as const;

export type BranchName = typeof BRANCHES[number];
