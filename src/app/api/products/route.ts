import { NextRequest, NextResponse } from "next/server";
import { adminGet } from "@/lib/admin-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const available = searchParams.get("available");

    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (available) params.set("available", available);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await adminGet(`/products${query}`);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch products" },
        { status: response.status }
      );
    }

    // Admin API wraps in { success, data } — extract the data array
    return NextResponse.json(data.data || data, { status: 200 });
  } catch (error) {
    console.error("Error retrieving products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
