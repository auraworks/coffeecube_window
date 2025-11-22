import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: input_records 테이블 스키마 확인
export async function GET() {
  try {
    const supabase = await createClient();

    // 최근 레코드 1개 조회하여 컬럼 확인
    const { data, error } = await supabase
      .from("input_records")
      .select("*")
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        columns: data && data.length > 0 ? Object.keys(data[0]) : [],
        sampleData: data,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
