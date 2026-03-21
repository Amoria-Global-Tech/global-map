import { NextRequest, NextResponse } from "next/server";
import { adminPost } from "@/lib/admin-api";

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }

    // Sanitize inputs before forwarding
    const sanitizedData = {
      name: sanitizeInput(body.name || ""),
      email: sanitizeInput(body.email || ""),
      phone: body.phone ? sanitizeInput(body.phone) : undefined,
      message: sanitizeInput(body.message || ""),
    };

    const response = await adminPost("/contact", sanitizedData);
    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: result.message || "Failed to submit contact form" },
        { status: response.status }
      );
    }

    // Extract from TransformInterceptor wrapper
    const innerData = result.data || result;
    return NextResponse.json(
      {
        success: true,
        message: innerData.message || "Thank you for your message! We'll get back to you soon.",
        data: innerData.data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      {
        success: false,
        message: "We're experiencing technical difficulties. Please try again later or contact us directly.",
      },
      { status: 500 }
    );
  }
}
