/**
 * Supabase `sales` 테이블 초기 시드 데이터 마이그레이션 스크립트
 * 3월~8월 엑셀 데이터 30건 + 9월 단톡방 보고 데이터 5건 (총 35건)
 * 실행 방법: node scripts/seed.mjs
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// .env.local 읽기
const envPath = path.resolve(process.cwd(), ".env.local");
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const [k, ...v] = line.split("=");
    if (k && v.length) {
      const val = v.join("=").trim();
      if (k.trim() === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = val;
      if (k.trim() === "NEXT_PUBLIC_SUPABASE_ANON_KEY") supabaseAnonKey = val;
    }
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("오류: Supabase URL 또는 Anon Key가 설정되지 않았습니다.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SEED_DATA = [
  // 2026년 3월
  { 월: "2026-03", 지점: "용산역점", 매출액: 48510000, 객수: 6107, 비고: null },
  { 월: "2026-03", 지점: "삼각지점", 매출액: 29160000, 객수: 3810, 비고: null },
  { 월: "2026-03", 지점: "이태원점", 매출액: 41280000, 객수: 5225, 비고: null },
  { 월: "2026-03", 지점: "효창공원점", 매출액: 21390000, 객수: 2764, 비고: null },
  { 월: "2026-03", 지점: "한남점", 매출액: 34420000, 객수: 4405, 비고: null },

  // 2026년 4월
  { 월: "2026-04", 지점: "용산역점", 매출액: 50090000, 객수: 6122, 비고: null },
  { 월: "2026-04", 지점: "삼각지점", 매출액: 30300000, 객수: 3619, 비고: null },
  { 월: "2026-04", 지점: "이태원점", 매출액: 43480000, 객수: 5589, 비고: null },
  { 월: "2026-04", 지점: "효창공원점", 매출액: 22790000, 객수: 2840, 비고: null },
  { 월: "2026-04", 지점: "한남점", 매출액: 35900000, 객수: 4475, 비고: null },

  // 2026년 5월
  { 월: "2026-05", 지점: "용산역점", 매출액: 50940000, 객수: 6448, 비고: null },
  { 월: "2026-05", 지점: "삼각지점", 매출액: 32050000, 객수: 3933, 비고: null },
  { 월: "2026-05", 지점: "이태원점", 매출액: 47400000, 객수: 5857, 비고: null },
  { 월: "2026-05", 지점: "효창공원점", 매출액: 22560000, 객수: 2826, 비고: null },
  { 월: "2026-05", 지점: "한남점", 매출액: 38160000, 객수: 4654, 비고: null },

  // 2026년 6월
  { 월: "2026-06", 지점: "용산역점", 매출액: 57290000, 객수: 7469, 비고: null },
  { 월: "2026-06", 지점: "삼각지점", 매출액: 33750000, 객수: 4307, 비고: null },
  { 월: "2026-06", 지점: "이태원점", 매출액: 45160000, 객수: 5671, 비고: null },
  { 월: "2026-06", 지점: "효창공원점", 매출액: 24180000, 객수: 3088, 비고: null },
  { 월: "2026-06", 지점: "한남점", 매출액: 46410000, 객수: 5840, 비고: "매장 리뉴얼 오픈" },

  // 2026년 7월
  { 월: "2026-07", 지점: "용산역점", 매출액: 59340000, 객수: 7675, 비고: null },
  { 월: "2026-07", 지점: "삼각지점", 매출액: 34280000, 객수: 4399, 비고: null },
  { 월: "2026-07", 지점: "이태원점", 매출액: 50410000, 객수: 6464, 비고: null },
  { 월: "2026-07", 지점: "효창공원점", 매출액: 20570000, 객수: 2698, 비고: "앞 도로 공사 시작" },
  { 월: "2026-07", 지점: "한남점", 매출액: 52010000, 객수: 6548, 비고: null },

  // 2026년 8월
  { 월: "2026-08", 지점: "용산역점", 매출액: 59680000, 객수: 7245, 비고: null },
  { 월: "2026-08", 지점: "삼각지점", 매출액: 35270000, 객수: 4626, 비고: null },
  { 월: "2026-08", 지점: "이태원점", 매출액: 49600000, 객수: 6184, 비고: null },
  { 월: "2026-08", 지점: "효창공원점", 매출액: 20500000, 객수: 2545, 비고: null },
  { 월: "2026-08", 지점: "한남점", 매출액: 48570000, 객수: 5835, 비고: null },

  // 2026년 9월 (단톡방 보고 데이터)
  { 월: "2026-09", 지점: "용산역점", 매출액: 54320000, 객수: 6820, 비고: null },
  { 월: "2026-09", 지점: "삼각지점", 매출액: 32480000, 객수: 4011, 비고: null },
  { 월: "2026-09", 지점: "이태원점", 매출액: 45870000, 객수: 5690, 비고: "추석 연휴 3일 단축 영업" },
  { 월: "2026-09", 지점: "효창공원점", 매출액: 18900000, 객수: 2380, 비고: "공사 아직 안 끝남" },
  { 월: "2026-09", 지점: "한남점", 매출액: 46100000, 객수: 5520, 비고: null },
];

async function runSeed() {
  console.log("Supabase sales 테이블 시드 데이터 확인 중...");
  const { data: existing, error: countErr } = await supabase.from("sales").select("id", { count: "exact" });
  if (countErr) {
    console.error("테이블 조회 실패:", countErr);
    return;
  }

  console.log(`현재 저장된 데이터 건수: ${existing?.length || 0}건`);

  if ((existing?.length || 0) >= 35) {
    console.log("이미 35건의 데이터가 모두 반영되어 있습니다.");
    return;
  }

  console.log(`${SEED_DATA.length}건 데이터 삽입을 시작합니다...`);
  const { error: insertErr } = await supabase.from("sales").insert(SEED_DATA);
  if (insertErr) {
    console.error("데이터 삽입 실패:", insertErr);
    return;
  }

  console.log("✅ 총 35건의 시드 데이터가 성공적으로 반영되었습니다.");
}

runSeed();
