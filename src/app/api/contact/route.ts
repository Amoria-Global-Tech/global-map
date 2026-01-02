import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendContactEmail, sendContactReply } from "../utils/brevo";

// Define types for the contact form data
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// Validation function
function validateContactData(data: ContactFormData): string | null {
  if (!data.name || data.name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }

  if (!data.email || !isValidEmail(data.email)) {
    return "Please provide a valid email address";
  }

  if (!data.message || data.message.trim().length < 10) {
    return "Message must be at least 10 characters long";
  }

  if (data.phone && data.phone.trim() && !isValidPhone(data.phone)) {
    return "Please provide a valid phone number";
  }

  if (data.name.length > 100) {
    return "Name is too long (max 100 characters)";
  }

  if (data.email.length > 255) {
    return "Email is too long (max 255 characters)";
  }

  if (data.phone && data.phone.length > 20) {
    return "Phone number is too long (max 20 characters)";
  }

  if (data.message.length > 2000) {
    return "Message is too long (max 2000 characters)";
  }

  return null;
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
  return phoneRegex.test(phone);
}

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

// GET - Fetch all contacts (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resolved = searchParams.get("resolved");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const contacts = await prisma.contact.findMany({
      where: {
        ...(resolved !== null && { isResolved: resolved === "true" }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.contact.count({
      where: {
        ...(resolved !== null && { isResolved: resolved === "true" }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: contacts,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + contacts.length < total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving contacts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

// POST - Create a new contact submission
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }

    // Extract and sanitize form data
    const formData: ContactFormData = {
      name: sanitizeInput(body.name || ""),
      email: sanitizeInput(body.email || ""),
      phone: body.phone ? sanitizeInput(body.phone) : undefined,
      message: sanitizeInput(body.message || ""),
    };

    // Validate the data
    const validationError = validateContactData(formData);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    // Check for rate limiting - same email in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentMessage = await prisma.contact.findFirst({
      where: {
        email: formData.email,
        createdAt: { gte: fiveMinutesAgo },
      },
    });

    if (recentMessage) {
      return NextResponse.json(
        { success: false, message: "Please wait a few minutes before sending another message" },
        { status: 429 }
      );
    }

    // Create the contact record
    const newContact = await prisma.contact.create({
      data: {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone || null,
        message: formData.message,
        isResolved: false,
      },
    });

    console.log(`New contact message from ${formData.name} (${formData.email}) at ${new Date().toISOString()}`);

    // Send emails
    try {
      await sendContactReply(formData.email, formData.name);
      await sendContactEmail(formData.email, formData.message, formData.name);
    } catch (emailError) {
      console.error("Failed to send email notifications:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
        data: {
          id: newContact.id,
          createdAt: newContact.createdAt,
        },
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
