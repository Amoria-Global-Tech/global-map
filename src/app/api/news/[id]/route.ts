import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch a single news item by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if id is numeric (ID) or string (slug)
    const isNumeric = /^\d+$/.test(id);

    let newsItem;
    if (isNumeric) {
      newsItem = await prisma.newsUpdate.findUnique({
        where: { id: parseInt(id) },
      });
    } else {
      newsItem = await prisma.newsUpdate.findUnique({
        where: { slug: id },
      });
    }

    if (!newsItem) {
      return NextResponse.json(
        { success: false, message: "News item not found" },
        { status: 404 }
      );
    }

    // Increment views
    await prisma.newsUpdate.update({
      where: { id: newsItem.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: newsItem }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving news:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

// PUT - Update a news item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newsId = parseInt(id);

    if (isNaN(newsId)) {
      return NextResponse.json(
        { success: false, message: "Invalid news ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      imageUrl,
      category,
      tags,
      author,
      isPublished,
      isFeatured,
    } = body;

    // Check if news exists
    const existing = await prisma.newsUpdate.findUnique({
      where: { id: newsId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "News item not found" },
        { status: 404 }
      );
    }

    // If publishing for the first time, set publishedAt
    let publishedAt = existing.publishedAt;
    if (isPublished === true && !existing.isPublished && !existing.publishedAt) {
      publishedAt = new Date();
    }

    const newsItem = await prisma.newsUpdate.update({
      where: { id: newsId },
      data: {
        ...(title && { title }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(category && { category: category.toLowerCase() }),
        ...(tags !== undefined && { tags }),
        ...(author !== undefined && { author }),
        ...(isPublished !== undefined && { isPublished, publishedAt }),
        ...(isFeatured !== undefined && { isFeatured }),
      },
    });

    return NextResponse.json(
      { success: true, message: "News updated successfully", data: newsItem },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update news" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a news item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newsId = parseInt(id);

    if (isNaN(newsId)) {
      return NextResponse.json(
        { success: false, message: "Invalid news ID" },
        { status: 400 }
      );
    }

    await prisma.newsUpdate.delete({
      where: { id: newsId },
    });

    return NextResponse.json(
      { success: true, message: "News deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete news" },
      { status: 500 }
    );
  }
}
