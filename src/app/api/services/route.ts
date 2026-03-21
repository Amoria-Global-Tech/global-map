import { NextRequest, NextResponse } from "next/server";
import { adminGet } from "@/lib/admin-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active");
    const category = searchParams.get("category");

    const params = new URLSearchParams();
    if (activeOnly) params.set("active", activeOnly);
    if (category) params.set("category", category);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await adminGet(`/services${query}`);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch services" },
        { status: response.status }
      );
    }

    return NextResponse.json(data.data || data, { status: 200 });
  } catch (error) {
    console.error("Error retrieving services:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
