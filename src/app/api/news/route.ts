import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 200);
}

// GET - Fetch all news/updates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const published = searchParams.get("published");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where = {
      ...(category && { category }),
      ...(featured === "true" && { isFeatured: true }),
      ...(published !== "false" && { isPublished: true }), // Default to published only
    };

    const [news, total] = await Promise.all([
      prisma.newsUpdate.findMany({
        where,
        orderBy: [
          { isFeatured: "desc" },
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
        take: limit,
        skip: offset,
      }),
      prisma.newsUpdate.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: news,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + news.length < total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving news:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

// POST - Create a new news/update
export async function POST(request: NextRequest) {
  try {
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

    if (!title || !category) {
      return NextResponse.json(
        { success: false, message: "Title and category are required" },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ["news", "feature", "product", "announcement", "update"];
    if (!validCategories.includes(category.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          message: `Category must be one of: ${validCategories.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = generateSlug(title);
    let slugExists = await prisma.newsUpdate.findUnique({ where: { slug } });
    let counter = 1;
    while (slugExists) {
      slug = `${generateSlug(title)}-${counter}`;
      slugExists = await prisma.newsUpdate.findUnique({ where: { slug } });
      counter++;
    }

    const newsItem = await prisma.newsUpdate.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content: content || null,
        imageUrl: imageUrl || null,
        category: category.toLowerCase(),
        tags: tags || [],
        author: author || null,
        isPublished: isPublished ?? false,
        isFeatured: isFeatured ?? false,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(
      { success: true, message: "News created successfully", data: newsItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create news" },
      { status: 500 }
    );
  }
}
