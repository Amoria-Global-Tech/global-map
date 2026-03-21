import { NextRequest, NextResponse } from "next/server";
import { adminGet } from "@/lib/admin-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await adminGet(`/partners/${id}`);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Partner not found" },
        { status: response.status }
      );
    }

    return NextResponse.json(data.data || data, { status: 200 });
  } catch (error) {
    console.error("Error retrieving partner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch partner" },
      { status: 500 }
    );
  }
}
