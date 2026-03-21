import { NextRequest, NextResponse } from "next/server";
import { adminPost, adminGet } from "@/lib/admin-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { page_url } = body;

    if (!page_url) {
      return NextResponse.json(
        { success: false, message: "Page URL is required" },
        { status: 400 }
      );
    }

    // Extract request metadata to forward to admin API
    const xForwardedFor = req.headers.get("x-forwarded-for");
    const xRealIP = req.headers.get("x-real-ip");
    const cfConnectingIP = req.headers.get("cf-connecting-ip");
    const ipAddress = xForwardedFor?.split(",")[0]?.trim() || cfConnectingIP || xRealIP || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const referrer = req.headers.get("referer") || req.headers.get("referrer") || null;

    const response = await adminPost("/visitors/track", {
      page_url,
      ipAddress,
      userAgent,
      referrer,
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: result.message || "Failed to track visitor" },
        { status: response.status }
      );
    }

    const innerData = result.data || result;
    return NextResponse.json({
      success: true,
      message: innerData.message || "Visitor tracked successfully",
      data: innerData.data || innerData,
    });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get("days") || "30";
    const limit = searchParams.get("limit") || "100";

    const response = await adminGet(`/visitors/stats?days=${days}&limit=${limit}`);
    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: result.message || "Failed to fetch visitor statistics" },
        { status: response.status }
      );
    }

    const innerData = result.data || result;
    return NextResponse.json({
      success: true,
      data: innerData.data || innerData,
    });
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch visitor statistics" },
      { status: 500 }
    );
  }
}
