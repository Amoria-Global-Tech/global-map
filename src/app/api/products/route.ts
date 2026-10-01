import { NextResponse } from "next/server";
import { PRODUCTS } from "@/data/products";

export async function GET() {
  return NextResponse.json(PRODUCTS, { status: 200 });
}
