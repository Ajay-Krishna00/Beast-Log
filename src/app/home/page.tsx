"use client";
import { getUser } from "@/auth/server";
import ConsistencyGrid from "@/components/ConsistencyGrid";
import Header from "@/components/Header";
import LogWorkoutBtn from "@/components/LogWorkoutBtn";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Home() {
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (!user) {
        router.push("/");
      }
    };
    fetchUser();
  }, []);
  return (
    <div className="flex flex-col gap-4 h-screen bg-gray-950">
      <Header />
      <div className="flex flex-col gap-4 items-center justify-center h-full">
        <h1 className="text-3xl font-semibold text-white font-sl">
          Welcome to Beast Log
        </h1>
        <LogWorkoutBtn />
        <ConsistencyGrid />
      </div>
    </div>
  );
}

export default Home;
