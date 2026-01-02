import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch all partners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visibleOnly = searchParams.get("visible");

    const partners = await prisma.partner.findMany({
      where: {
        ...(visibleOnly === "true" && { is_visible: true }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(partners, { status: 200 });
  } catch (error) {
    console.error("Error retrieving partners:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}

// POST - Create a new partner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, description, logoUrl, website_url, contact_email, is_visible } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.create({
      data: {
        name,
        description: description || null,
        logoUrl: logoUrl || null,
        website_url: website_url || null,
        contact_email: contact_email || null,
        is_visible: is_visible ?? true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, message: "Partner created successfully", data: partner },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create partner" },
      { status: 500 }
    );
  }
}
