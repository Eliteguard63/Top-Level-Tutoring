export async function GET() {
  try {
    const placeId = "ChIJMWFnXSdNI0kR07kb-ifhiuk";
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Google Places API key is not configured." },
        { status: 500 }
      );
    }

    const url = `https://places.googleapis.com/v1/places/${placeId}`;

    const response = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "displayName,rating,userRatingCount,reviews,googleMapsLinks",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      return Response.json(
        {
          error: "Google Places request failed.",
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return Response.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Google reviews error:", error);

    return Response.json(
      { error: "Unable to load Google reviews." },
      { status: 500 }
    );
  }
}