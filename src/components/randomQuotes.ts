export async function randomQuotes() {
  const quotes = await fetch(
    "https://api.quotable.io/random?tags=inspirational|fitness|motivation|health",
  );
  const data = await quotes.json();
  console.log(data);
}
