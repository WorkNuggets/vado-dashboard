import { NextRequest, NextResponse } from "next/server";

/**
 * Realtor API Property Search
 * GET /api/realtor/search?location={location}&query={query}
 *
 * Note: Requires RAPIDAPI_KEY environment variable
 * To get the key, check the vado-react-native repository
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get("location");
  const query = searchParams.get("query");

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
    const queryParam = query ? `&query=${encodeURIComponent(query)}` : "";
    const url = `https://realtor16.p.rapidapi.com/search?location=${encodeURIComponent(location)}${queryParam}`;

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
    console.error("Error fetching from Realtor API:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch property data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
