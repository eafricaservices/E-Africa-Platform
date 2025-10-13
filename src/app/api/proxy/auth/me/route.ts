import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
  try {
    // Forward all cookies from the request to the backend
    const cookies = request.headers.get("cookie") || "";

    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookies,
      },
      credentials: "include",
    });

    const data = await response.json();

    // Forward the response back to the frontend
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        // Forward any Set-Cookie headers from the backend
        ...(response.headers.get("set-cookie")
          ? { "Set-Cookie": response.headers.get("set-cookie")! }
          : {}),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user session" },
      { status: 500 }
    );
  }
}
