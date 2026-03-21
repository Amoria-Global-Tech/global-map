import { NextRequest, NextResponse } from "next/server";
import { adminGet } from "@/lib/admin-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // The admin API handles both numeric IDs and slugs
    const response = await adminGet(`/news/${id}`);
    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: result.message || "News item not found" },
        { status: response.status }
      );
    }

    // Admin API returns { success, data: { success, data: newsItem } } due to TransformInterceptor
    const innerData = result.data || result;
    return NextResponse.json(
      { success: true, data: innerData.data || innerData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving news:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
