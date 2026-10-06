import { NextRequest, NextResponse } from "next/server";
import { getHolidaysForMonth } from "@/lib/holidays";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // '2026-03' 또는 콤마로 여러 개

  if (!month) {
    return NextResponse.json({ error: "month parameter is required" }, { status: 400 });
  }

  const months = month.split(",");
  const results = await Promise.all(months.map((m) => getHolidaysForMonth(m.trim())));

  return NextResponse.json({ holidays: results });
}
