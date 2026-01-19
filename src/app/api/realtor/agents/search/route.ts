import { NextRequest, NextResponse } from "next/server";

/**
 * Realtor API Agent Search
 * GET /api/realtor/agents/search?location={location}&name={name}
 *
 * Note: Requires RAPIDAPI_KEY environment variable
 * To get the key, check the vado-react-native repository
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get("location");
  const name = searchParams.get("name");

  if (!location) {
    return NextResponse.json(
      { error: "Location parameter is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "RAPIDAPI_KEY not configured",
        message:
          "Please add RAPIDAPI_KEY to your .env.local file. You can find the key in the vado-react-native repository.",
      },
      { status: 500 }
    );
  }

  try {
    const nameParam = name ? `&name=${encodeURIComponent(name)}` : "";
    const url = `https://realtor16.p.rapidapi.com/agents/search?location=${encodeURIComponent(location)}${nameParam}`;

    const response = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "realtor16.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`Realtor API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching agents from Realtor API:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch agent data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
