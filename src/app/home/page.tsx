"use client";
import { getUser } from "@/auth/server";
import ConsistencyGrid from "@/components/ConsistencyGrid";
import DaysLogged from "@/components/DaysLogged";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LogWorkoutBtn from "@/components/LogWorkoutBtn";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

function Home() {
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (!user) {
        router.push("/");
      }

      //Just making my inactive websites active again
    if(user?.id=="1539e7c1-8406-47c2-a182-75090ace97a0")
    {
      const lastPing = localStorage.getItem("lastPing");
      const lastPingDate = Date.now(); // gives you the current time in milliseconds.
      if (
        !lastPing ||
        lastPingDate - parseInt(lastPing) > 1000 * 60 * 60 * 24 * 5
      )
      {
        await fetch("http://quack-notes-ai.vercel.app/api/ping");
        await fetch("https://task-manager-backend-as32.onrender.com/ping");
        await fetch("https://task-manager-three-woad.vercel.app/ping");
        localStorage.setItem("lastPing", lastPingDate.toString());
}
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const res = await fetch("/api/quote");
      const data = await res.json();
      toast.info("Quote", {
        description: `${data.quote} - ${data.author}`,
        duration: 8500,
      });
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Home page of Beast Log" />
      </Head>
    <div className="flex flex-col gap-4 h-screen bg-gray-950">
      <Header />
      <div className="flex justify-end mt-26 ">
        <Button
          variant={"outline"}
          className="text-xl font-sl mr-7 cursor-pointer"
          onClick={() => {
            router.push("/status-window");
          }}
        >
          My Stats
        </Button>
      </div>
      <div className="flex flex-col gap-4 items-center justify-center h-full ">
        <h1 className="text-3xl font-semibold text-white font-sl ">
          Welcome to Beast Log
        </h1>
        <LogWorkoutBtn />
        <ConsistencyGrid />
        <DaysLogged />
      </div>
      <Footer />
    </div>
    </>
  );
}

export default Home;
