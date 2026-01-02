import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active");
    const category = searchParams.get("category");

    const services = await prisma.service.findMany({
      where: {
        ...(activeOnly === "true" && { isActive: true }),
        ...(category && { category }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error retrieving services:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST - Create a new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, description, icon, features, isActive, category, price, image_url, status } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        description: description || null,
        icon: icon || null,
        features: features || null,
        isActive: isActive ?? true,
        category: category || null,
        price: price ? parseFloat(price) : null,
        image_url: image_url || null,
        status: status || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, message: "Service created successfully", data: service },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create service" },
      { status: 500 }
    );
  }
}
