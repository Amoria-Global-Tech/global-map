import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch a single partner by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const partnerId = parseInt(id);

    if (isNaN(partnerId)) {
      return NextResponse.json(
        { success: false, message: "Invalid partner ID" },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      return NextResponse.json(
        { success: false, message: "Partner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(partner, { status: 200 });
  } catch (error) {
    console.error("Error retrieving partner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch partner" },
      { status: 500 }
    );
  }
}

// PUT - Update a partner
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const partnerId = parseInt(id);

    if (isNaN(partnerId)) {
      return NextResponse.json(
        { success: false, message: "Invalid partner ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, logoUrl, website_url, contact_email, is_visible } = body;

    const partner = await prisma.partner.update({
      where: { id: partnerId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(website_url !== undefined && { website_url }),
        ...(contact_email !== undefined && { contact_email }),
        ...(is_visible !== undefined && { is_visible }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, message: "Partner updated successfully", data: partner },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update partner" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a partner
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const partnerId = parseInt(id);

    if (isNaN(partnerId)) {
      return NextResponse.json(
        { success: false, message: "Invalid partner ID" },
        { status: 400 }
      );
    }

    await prisma.partner.delete({
      where: { id: partnerId },
    });

    return NextResponse.json(
      { success: true, message: "Partner deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting partner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete partner" },
      { status: 500 }
    );
  }
}
