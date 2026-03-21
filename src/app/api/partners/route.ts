import { NextRequest, NextResponse } from "next/server";
import { adminGet } from "@/lib/admin-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visibleOnly = searchParams.get("visible");

    const params = new URLSearchParams();
    if (visibleOnly) params.set("visible", visibleOnly);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await adminGet(`/partners${query}`);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch partners" },
        { status: response.status }
      );
    }

    return NextResponse.json(data.data || data, { status: 200 });
  } catch (error) {
    console.error("Error retrieving partners:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}
