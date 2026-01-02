import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch a single contact by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contactId = parseInt(id);

    if (isNaN(contactId)) {
      return NextResponse.json(
        { success: false, message: "Invalid contact ID" },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      return NextResponse.json(
        { success: false, message: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contact }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving contact:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch contact" },
      { status: 500 }
    );
  }
}

// PUT - Update a contact (mark as resolved, add admin reply, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contactId = parseInt(id);

    if (isNaN(contactId)) {
      return NextResponse.json(
        { success: false, message: "Invalid contact ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { isResolved, admin_reply } = body;

    const contact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        ...(isResolved !== undefined && { isResolved }),
        ...(admin_reply !== undefined && { admin_reply, replied_at: new Date() }),
      },
    });

    return NextResponse.json(
      { success: true, message: "Contact updated successfully", data: contact },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update contact" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contactId = parseInt(id);

    if (isNaN(contactId)) {
      return NextResponse.json(
        { success: false, message: "Invalid contact ID" },
        { status: 400 }
      );
    }

    await prisma.contact.delete({
      where: { id: contactId },
    });

    return NextResponse.json(
      { success: true, message: "Contact deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete contact" },
      { status: 500 }
    );
  }
}
