import { NextRequest, NextResponse } from "next/server";
import { adminGet } from "@/lib/admin-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const published = searchParams.get("published");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (featured) params.set("featured", featured);
    if (published) params.set("published", published);
    if (limit) params.set("limit", limit);
    if (offset) params.set("offset", offset);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await adminGet(`/news${query}`);
    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: result.message || "Failed to fetch news" },
        { status: response.status }
      );
    }

    // Admin API returns { success, data: { success, data, pagination } } due to TransformInterceptor
    const innerData = result.data || result;
    return NextResponse.json(
      {
        success: true,
        data: innerData.data || innerData,
        pagination: innerData.pagination,
      },
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
