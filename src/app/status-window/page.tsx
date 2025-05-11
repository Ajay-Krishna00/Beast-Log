"use client";
import { getBestExercise, HasName, SetName } from "@/action/stat";
import { getUser } from "@/auth/server";
import Header from "@/components/Header";
import {
  calculateScore,
  getUserLevel,
  rankStyles,
  statToRank,
} from "@/components/statScore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WorkoutNames } from "@/components/WorkoutNames";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { Dumbbell, Info, InfoIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function StatusWindow() {
  const [initial, setInitial] = useState(true);
  const [userName, setUserName] = useState("");
  const [userWeight, setUserWeight] = useState(0);
  const [userStats, setUserStats] = useState<
    {
      name: string | undefined;
      score: number;
      rank: string;
      rankColor: string;
    }[]
  >([]);
  const [userOvRank, setUserOvRank] = useState<[string, string]>([
    "Unranked",
    "text-gray-500",
  ]);
  const [userLevel, setUserLevel] = useState({
    level: 0,
    daysLogged: 0,
    nextLevelAt: 0,
    daysToNextLevel: 0,
    progress: 0,
  });
  const [isPending, setIsPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    const user = await getUser();
    if (!user) {
      router.push("/");
      return;
    }
    const data = await HasName();
    const name = data?.name;
    if (!name) {
      setInitial(false);
      setLoading(false);
      return;
    }
    setInitial(true);
    const weight = data?.weight;
    setUserWeight(weight || 0);
    setUserName(name || "");

    if (userWeight) {
      const userBestExercises = await getBestExercise();

      const userScore = userBestExercises
        .map((exercise) => {
          const { name, weight, reps, sets } = exercise;
          const type = WorkoutNames.find((ex) => ex.value === name)?.type;
          const WorkoutName = WorkoutNames.find(
            (ex) => ex.value === name,
          )?.name;
          const rScore = calculateScore({
            type: type as "static" | "bodyweight" | "weighted",
            exercise: name,
            weight: weight,
            reps: reps,
            sets: sets,
            userWeight: userWeight,
          });
          const rank = statToRank(rScore);
          return {
            name: WorkoutName,
            score: rScore,
            rank: rank,
            rankColor: rankStyles[rank],
          };
        })
        .filter(Boolean);
      const sortedUserScore = [...userScore].sort((a, b) => {
        if (!a.name) return 1;
        if (!b.name) return -1;
        return a.name.localeCompare(b.name);
      });
      OverAllRank(sortedUserScore);
      setUserStats(sortedUserScore);
      const level = await getUserLevel();
      setUserLevel(level);
    }
    setLoading(false);
  }, [userWeight, isPending,router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const OverAllRank = (
    data: {
      name: string | undefined;
      score: number;
      rank: string;
      rankColor: string;
    }[],
  ) => {
    if (data.length === 0) return;
    const totalScore = data.reduce((sum, stats) => sum + stats.score, 0);
    const averageSc = parseFloat((totalScore / data.length).toFixed(2));
    const OvRank = statToRank(averageSc);
    const rankColor = rankStyles[OvRank];
    setUserOvRank([OvRank, rankColor]);
  };

  const handleSubmit = async (formdata: FormData) => {
    setIsPending(true);
    const name = formdata.get("name") as string;
    const weightS = formdata.get("weight") as string;
    const weight = parseInt(weightS);

    if (name === "" || weightS === "") {
      toast.error("Please fill all the fields");
      return;
    }

    const { errMsg } = await SetName(name, weight);
    if (errMsg) {
      toast.error("Error Occurred", {
        description: errMsg.toString(),
      });
    } else {
      toast.success("Name set successfully");
    }
    setInitial(true);
    setIsPending(false);
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen w-screen bg-gray-950 ">
      <Header />
      {loading ? (
        <div className="flex justify-center items-center w-full min-h-[70vh]">
          <h1 className="text-2xl font-sl text-white">Loading </h1>
          <Loader2 className="animate-spin ml-2 text-white" />
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          {initial ? (
              <Card className="w-full max-w-3xl  bg-gray-950 border-2 border-gray-800 relative">
              <CardHeader>
                <h1 className="text-xl font-semibold text-white font-sl text-center">
                  Status Window
                </h1>
              </CardHeader>
              <CardContent>
                <div className="flex">
                  <h1 className="text-xl md:text-2xl font-semibold text-white font-sl text-center">
                    Name: {userName}
                  </h1>
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex flex-row ">
                    <h1 className="text-xl text-white font-sl ">Level : </h1>
                    <h1 className={`text-xl text-white ml-4 font-bold`}>
                      {" "}
                      {userLevel.level}
                    </h1>
                  </div>
                  <div className="flex flex-row ">
                    <h1 className="text-xl text-white font-sl">
                      Overall Rank :{" "}
                    </h1>
                    <h1
                      className={`text-2xl font-sl ${userOvRank[1]} ml-4`}
                    >
                      {" "}
                      {userOvRank[0]}
                    </h1>
                  </div>
                </div>
                <div className="flex flex-col w-full mt-6">
                  <h1 className="flex text-2xl font-semibold text-white font-sl mb-3 ">
                    <Dumbbell className="mr-1  text-yellow-300" /> Stats
                  </h1>
                  {/* <h1 className="text-xl text-white font-sl ">Strength :</h1>
                <h1 className="text-xl text-white font-sl">Endurance :</h1>
                <h1 className="text-xl text-white font-sl">Core :</h1>
                <h1 className="text-xl text-white font-sl">Upper Body :</h1>
                <h1 className="text-xl text-white font-sl">Lower Body :</h1> */}
                  {userStats.length !== 0 ? (
                    userStats.map((exercise) => {
                      return (
                        <div
                          key={exercise.name}
                          className="flex flex-row items-center w-full"
                        >
                          <div className="text-lg xs:text-md text-white font-sl">
                            {exercise.name} :
                          </div>
                          <div
                            className={`text-lg xs:text-md font-semibold font-sl ${exercise.rankColor} ml-5`}
                          >
                            {exercise.rank}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-lg xs:text-md text-white font-sl">
                      No Workout logged yet
                    </div>
                  )}
                </div>
                <Card className="w-full max-w-3xl mt-5 bg-gray-950 border-2 border-gray-800">
                  <CardContent>
                    <h1 className="text-lg text-white font-sl">Rank System</h1>
                    <div className="flex flex-wrap flex-row gap-3 mt-2">
                      {/* class="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent " */}
                      <h1 className="flex text-md md:text-lg text-yellow-400 font-bold drop-shadow-[0_0_6px_#facc15] font-sl">
                        SS
                        <span className="text-md md:text-lg text-white ">
                          {" "}
                          : Mythic
                        </span>
                      </h1>
                      <h1 className="flex text-md md:text-lg text-orange-500 font-bold drop-shadow-[0_0_6px_#fb923c] font-sl">
                        S
                        <span className="text-md md:text-lg text-white ">
                          {" "}
                          : Elite
                        </span>
                      </h1>
                      <h1 className="flex text-md md:text-lg text-sky-400 font-semibold drop-shadow-[0_0_5px_#38bdf8] font-sl">
                        A
                        <span className="text-md md:text-lg text-white ">
                          {" "}
                          : Advanced
                        </span>
                      </h1>
                      <h1 className="flex text-md md:text-lg text-lime-400 font-medium drop-shadow-[0_0_4px_#a3e635] font-sl">
                        B
                        <span className="text-md md:text-lg text-white ">
                          {" "}
                          : Intermediate
                        </span>
                      </h1>
                      <h1 className="flex text-md md:text-lg text-gray-300 font-normal font-sl drop-shadow-[0_0_3px_#d1d5db]">
                        C
                        <span className="text-md md:text-lg text-white ">
                          {" "}
                          : Average
                        </span>
                      </h1>
                      <h1 className="flex text-md md:text-lg text-amber-600 font-medium drop-shadow-[0_0_3px_#fbbf24] font-sl">
                        D
                        <span className="text-md md:text-lg text-white ">
                          {" "}
                          : Developing
                        </span>
                      </h1>
                      <h1 className="flex text-md md:text-lg text-red-400 font-medium drop-shadow-[0_0_3px_#f87171] font-sl">
                        E
                        <span className="text-md md:text-lg text-white ">
                          {" "}
                          : Beginner
                        </span>
                      </h1>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          ) : (
            <form action={handleSubmit}>
              <Card className="w-full max-w-md   bg-gray-950 border-2 border-gray-800">
                <CardDescription className="flex text-md md:text-lg text-gray-400 font-sl px-3">
                  <Info className=" mr-2 text-blue-400 w-40" />
                  Welcome to your Status Window <br /> A gamified overview of
                  your fitness journey. Just like in RPGs, your body is your
                  character. Every squat, push-up, or plank you log builds up
                  key stats like Strength, Endurance, Core, and more. Track your
                  growth, earn ranks (from E to SS), and level up your real-life
                  avatar.
                </CardDescription>
                <CardContent>
                  <label className="text-xl text-white font-sl mr-5 mb-5">
                    Your Name
                  </label>
                  <input
                    type="name"
                    name="name"
                    placeholder="Enter your name"
                    className="text-lg text-white mb-5 xs:w-full "
                    id="name"
                    disabled={isPending}
                  />
                  <label className="text-xl text-white font-sl mr-5 mb-5 ">
                    Your Weight (in KG)
                  </label>
                  <input
                    type="weight"
                    name="weight"
                    placeholder="Enter your Weight in KG"
                    className="text-lg text-white xs:w-full "
                    id="weight"
                    disabled={isPending}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    variant={"outline"}
                    className="w-full text-xl font-sl"
                    disabled={isPending}
                  >
                    {isPending ? <Loader2 className="animate-spin" /> : "Save"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default StatusWindow;
