import Welcome from "@/components/welcome";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/beast.png" />
      </Head>
      <main className="flex min-h-screen flex-row items-center justify-center ">
        <Welcome />
      </main>
    </>
  );
}
