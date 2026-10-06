/**
 * 공공데이터포털 한국천문연구원 「특일 정보 (국경일 및 공휴일)」 연동 유틸리티
 */

export interface MonthHolidayInfo {
  yearMonth: string; // '2026-03'
  count: number; // 공휴일 수
  holidayNames: string[]; // 공휴일 명칭 목록
}

// 공공데이터포털 API 연동 전이거나 키가 없을 때를 대비한 2026년 기준 법정 공휴일 기본 데이터
export const FALLBACK_2026_HOLIDAYS: Record<string, { count: number; names: string[] }> = {
  "2026-01": { count: 1, names: ["신정(1/1)"] },
  "2026-02": { count: 3, names: ["설날 연휴(2/16~2/18)"] },
  "2026-03": { count: 2, names: ["삼일절(3/1)", "대체공휴일(3/2)"] },
  "2026-04": { count: 0, names: [] },
  "2026-05": { count: 3, names: ["어린이날(5/5)", "부처님오신날(5/24)", "대체공휴일(5/25)"] },
  "2026-06": { count: 1, names: ["현충일(6/6)"] },
  "2026-07": { count: 0, names: [] },
  "2026-08": { count: 2, names: ["광복절(8/15)", "대체공휴일(8/17)"] },
  "2026-09": { count: 4, names: ["추석 연휴(9/24~9/26)", "대체공휴일(9/28)"] },
  "2026-10": { count: 2, names: ["개천절 대체공휴일(10/5)", "한글날(10/9)"] },
  "2026-11": { count: 0, names: [] },
  "2026-12": { count: 1, names: ["기독탄신일(12/25)"] },
};

/**
 * 특정 연월의 공휴일 정보를 조회합니다.
 * API 키가 있으면 공공데이터포털 API를 우선 호출하고, 실패하거나 키가 없을 경우 내장 데이터를 활용합니다.
 */
export async function getHolidaysForMonth(yearMonth: string): Promise<MonthHolidayInfo> {
  const [year, month] = yearMonth.split("-");
  const apiKey = process.env.HOLIDAY_API_KEY || process.env.NEXT_PUBLIC_HOLIDAY_API_KEY;

  if (apiKey) {
    try {
      const url = `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${apiKey}&solYear=${year}&solMonth=${month.padStart(2, "0")}&_type=json`;
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (res.ok) {
        const json = await res.json();
        const items = json?.response?.body?.items?.item;
        if (items) {
          const list = Array.isArray(items) ? items : [items];
          const holidayNames = list
            .filter((it: any) => it.isHoliday === "Y")
            .map((it: any) => `${it.dateName}(${String(it.locdate).slice(4, 6)}/${String(it.locdate).slice(6, 8)})`);
          return {
            yearMonth,
            count: holidayNames.length,
            holidayNames,
          };
        }
      }
    } catch (e) {
      console.warn("공공데이터포털 공휴일 API 호출 실패, 캐시 데이터로 대체합니다:", e);
    }
  }

  // Fallback 캐시
  const cached = FALLBACK_2026_HOLIDAYS[yearMonth] || { count: 0, names: [] };
  return {
    yearMonth,
    count: cached.count,
    holidayNames: cached.names,
  };
}
