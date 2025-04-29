import React from "react";
import { Popover, PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { WorkoutNames } from "./WorkoutNames";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Check } from "lucide-react";

function SelectWorkoutDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  //onChange is a function & accepts one argument, called value, which must be a string.It returns nothing (void)
  const [open, setOpen] = React.useState(false);
  const workoutNames = WorkoutNames;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex flex-1 md:min-w-[250px] xs:min-w-0 max-w-lg font-sl md:text-lg xs:text-sm"
        >
          {value
            ? workoutNames.find((workout) => workout.value === value)?.name
            : "Select Workout..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Search Workout" />
          <CommandList>
            <CommandEmpty>No workout found.</CommandEmpty>
            <CommandGroup>
              {workoutNames.map((workout) => (
                <CommandItem
                  key={workout.value}
                  value={workout.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${value === workout.value ? "opacity-100" : "opacity-0"}`}
                  />
                  {workout.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SelectWorkoutDropdown;
