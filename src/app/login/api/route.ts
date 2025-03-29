"use server";
import { authenticateAdmin } from "@/lib/repositories/admin.repository";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log(request.body);
  return Response.json({
    message: "hello world",
  });
}
export async function POST(request: Request) {
  const body = await request.json();
  const response = await authenticateAdmin(body.email, body.password);
  if (response.status === 200) {
    return NextResponse.json(response, { status: 200 });
  } else {
    return NextResponse.json(response, { status: 202 });
  }
}
