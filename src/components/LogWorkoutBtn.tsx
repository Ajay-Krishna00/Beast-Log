import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { InfoIcon, ListPlus, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { LoggingWorkout } from "@/action/exercise";
import SelectWorkoutDropdown from "./SelectWorkoutDropdown";

function LogWorkoutBtn() {
  const [inputGroups, setInputGroups] = useState<string[][]>([
    ["", "", "", ""],
  ]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    //fetch data from db and set it to inputGroups
  }, [open]);

  const handleInputChange = (
    groupIndex: number,
    inputIndex: number,
    value: string,
  ) => {
    setInputGroups((prev) => {
      const newGroups = [...prev];
      newGroups[groupIndex][inputIndex] = value;
      return newGroups;
    });
  };

  const handleAddInputs = () => {
    setInputGroups((prev) => [...prev, ["", "", "", ""]]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    const workoutId = uuidv4();
    const workoutData = inputGroups
      .filter((group) => group[0] !== "" && group[1] !== "" && group[2] !== "")
      .map((group) => {
        const exerciseId = uuidv4();
        return {
          id: exerciseId,
          name: group[0],
          reps: parseInt(group[1]),
          sets: parseInt(group[2]),
          weight: parseInt(group[3]),
        };
      });
    if (workoutData.length === 0) {
      toast.error("Fields are Empty");
    } else {
      const errMsg = (await LoggingWorkout(workoutId, workoutData)).errMsg;
      if (!errMsg) {
        toast.success("Workout Logged");
      } else {
        toast.error("Error Occurred", {
          description: errMsg,
        });
      }
      setOpen(false);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="font-sl text-xl">
          Log Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-lg ">
        <div className="flex flex-col gap-4">
          <DialogTitle className="text-3xl font-semibold text-center font-sl">
            Log Workout
          </DialogTitle>
          <Separator decorative={true} />
          <DialogDescription className="text-center font-sl">
            <InfoIcon className="inline mr-1" />
            Fill in the details of your workout below
          </DialogDescription>
          <Button
            variant={"outline"}
            className="font-sl text-xl"
            onClick={handleAddInputs}
          >
            <ListPlus className="mr-1" />
            Add Workout
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row gap-1 mb-2">
            <div className="w-full min-w-[40px] justify-between flex flex-row">
              <label
                htmlFor="workout-name"
                className="md:text-lg xs:text-md font-sl "
              >
                Workout Name
              </label>
              <Separator orientation="vertical" />
            </div>
            <div className="w-full max-w-15 min-w-13 justify-between flex flex-row">
              <label
                htmlFor="workout-reps"
                className="md:text-lg xs:text-md font-sl"
              >
                Reps
              </label>
              <Separator orientation="vertical" />
            </div>
            <div className="w-full max-w-15 min-w-13 justify-between flex flex-row">
              <label
                htmlFor="workout-sets"
                className="md:text-lg xs:text-md font-sl"
              >
                Sets
              </label>
              <Separator orientation="vertical" />
            </div>
            <div className="w-full max-w-15 min-w-13 justify-between flex flex-row">
              <label
                htmlFor="workout-sets"
                className="md:text-lg xs:text-md font-sl"
              >
                Kilos
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-scroll  mb-2">
            {inputGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="flex flex-row gap-4">
                {group.map(
                  (
                    _,
                    inputIndex, // '_' is used to ignore the value since we don't need it
                  ) =>
                    inputIndex === 0 ? (
                      // <input
                      //   key={inputIndex}
                      //   type="text"
                      //   placeholder="e.g. Push Ups"
                      //   className="min-w-[50px] w-full"
                      //   value={group[inputIndex]}
                      //   onChange={(e) =>
                      //     handleInputChange(
                      //       groupIndex,
                      //       inputIndex,
                      //       e.target.value,
                      //     )
                      //   }
                      // />
                      <SelectWorkoutDropdown
                        key={inputIndex}
                        value={group[inputIndex]}
                        onChange={(value) => {
                          handleInputChange(groupIndex, inputIndex, value);
                        }}
                      />
                    ) : (
                      <input
                        key={inputIndex}
                        type="number"
                        placeholder="0"
                        className="w-13 border-1 border-gray-200 rounded-md p-1"
                        value={group[inputIndex]}
                        onChange={(e) =>
                          handleInputChange(
                            groupIndex,
                            inputIndex,
                            e.target.value,
                          )
                        }
                      />
                    ),
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="flex-1/2 font-sl text-xl mt-4"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
            {/* <DialogClose asChild>
              <Button className="flex-1/2 font-sl text-xl mt-4">Cancel</Button>
            </DialogClose> */}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default LogWorkoutBtn;
