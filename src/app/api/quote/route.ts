// /app/api/quote/route.ts
export async function GET() {
  try {
    const res = await fetch("https://zenquotes.io/api/random");
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    return new Response(
      JSON.stringify({
        quote: data[0].q,
        author: data[0].a,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Failed to fetch quote: ${error}` }),
      {
        status: 500,
      },
    );
  }
}
