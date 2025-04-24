import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogOverlay, DialogTitle, DialogTrigger } from './ui/dialog'
import { Separator } from './ui/separator'
import { ListPlus } from 'lucide-react'
import {v4 as uuidv4} from 'uuid';
import { toast } from 'sonner'
import { LoggingWorkout } from '@/action/exercise'


function LogWorkoutBtn() {
  const [inputGroups, setInputGroups] = useState<string[][]>([["", "", ""]]);
  const [open, setOpen] = useState(false);

  useEffect(() => {

    //fetch data from db and set it to inputGroups

  }, [open])
  
  const handleInputChange = (groupIndex: number, inputIndex: number, value: string) => {
    setInputGroups((prev) => {
      const newGroups = [...prev];
      newGroups[groupIndex][inputIndex] = value;
      return newGroups;
    });
  };

  const handleAddInputs = () => {
    setInputGroups((prev) => [...prev, ["", "", ""]]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
    }});
    let errMsg;
    errMsg = (await LoggingWorkout(workoutId, workoutData)).errMsg;
    if (!errMsg) {
      toast.success("Workout Logged");
    }
    else {
      toast.error("Error Occurred", {
        description: errMsg
      })
    }
    setOpen(false); 
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'} className="font-sl text-xl">
          Log Workout
        </Button>
      </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-md ">
        <div className='flex flex-col gap-4'>
          <DialogTitle className='text-3xl font-semibold text-center font-sl'>
            Log Workout
          </DialogTitle>
          <Separator />
          <Button variant={'outline'} className="font-sl text-xl" onClick={handleAddInputs}>
            <ListPlus className='mr-1' />
            Add Workout
          </Button>
        </div>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-row gap-1'>
          <div className='w-full min-w-[50px] '>
            <label htmlFor="workout-name" className='text-lg font-sl '>Workout Name</label>
          </div>
          <div className='w-full max-w-15 min-w-13 text-center'>
            <label htmlFor="workout-reps" className='text-lg font-sl'>Reps</label>
          </div>
          <div className='w-full max-w-15 min-w-13 text-center'>
            <label htmlFor="workout-sets" className='text-lg font-sl'>Sets</label>
          </div>
        </div>
        <div className='flex flex-col gap-2 max-h-[350px] overflow-y-scroll'>
          {inputGroups.map((group, groupIndex) => (
          <div key={groupIndex} className='flex flex-row gap-4'>
              {group.map((_, inputIndex) => // '_' is used to ignore the value since we don't need it
              inputIndex === 0 ?(
                <input
                key={inputIndex}
                type="text"
                placeholder="e.g. Push Ups"
                className='flex-1'
                value={group[inputIndex]}
                onChange={(e) => handleInputChange(groupIndex, inputIndex, e.target.value)}
              />
                ) : (
                <input
                key={inputIndex}
                type="number"
                placeholder="0"
                className='w-13'
                value={group[inputIndex]}
                onChange={(e) => handleInputChange(groupIndex, inputIndex, e.target.value)}
              />
              )
            )}
          </div>
        ))}
        </div>
        <DialogFooter>
          <Button type="submit" className="flex-1/2 font-sl text-xl mt-4"  >
            Save
          </Button>
          <DialogClose asChild>
            <Button className="flex-1/2 font-sl text-xl mt-4" >
            Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
        </form>
        </DialogContent>
    </Dialog>
  )
}

export default LogWorkoutBtn