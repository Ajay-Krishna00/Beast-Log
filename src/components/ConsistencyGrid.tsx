import { getWorkoutByYear } from "@/action/exercise";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

const generateYearDays = (year: number): Date[] => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const days: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
  //  Date Wed Jan 01 2025 00:00:00 GMT+0530 (India Standard Time), Date Thu Jan 02 2025 00:00:00 GMT+0530 (India Standard Time), Date Fri Jan 03 2025 00:00:00 GMT+0530 (India Standard Time), Date Sat Jan 04 2025 00:00:00 GMT+0530 (India Standard Time),
};

type ContributionCalendarProps = {
  year: number;
};

const ContributionCalendar: React.FC<ContributionCalendarProps> = ({
  year,
}) => {
  const days = generateYearDays(year);
  const [workoutData, setWorkoutData] = useState<
    Map<string, { date: Date; workouts: any[] }>
  >(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getWorkoutByYear(year);
      setWorkoutData(result);
      setLoading(false);
    };
    fetchData();
  }, [year]);

  // Pad so that Jan 1 starts on the correct weekday (Sun = top row)
  const startPadding: (Date | null)[] = new Array(days[0].getDay()).fill(null);
  const paddedDays: (Date | null)[] = [...startPadding, ...days];

  // Group into weeks (columns)
  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];

  paddedDays.forEach((day, index) => {
    if (index % 7 === 0 && currentWeek.length) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  if (currentWeek.length) weeks.push(currentWeek);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const weekNames = [".", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return !loading ? (
    <div className="flex gap-[3px] p-2 overflow-hidden rounded max-w-95%">
      <div className="flex flex-col gap-[0px] mr-1">
        {weekNames.map((week, weekNo) => {
          return (
            <h6 key={weekNo} className="text-white text-[11px] p-[1px]">
              {week}
            </h6>
          );
        })}
      </div>
      <div className="flex flex-col gap-[3px] overflow-y-hidden overflow-x-scroll w-100%">
        <div className="flex flex-row justify-around min-w-[945px] px-1 mb-1">
          {months.map((month, monthIndex) => {
            return (
              <h6 key={monthIndex} className="text-white text-[11px] ">
                {month}
              </h6>
            );
          })}
        </div>
        <div className="flex flex-row gap-[4px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[4px]">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const date = week[dayIndex];
                const isValid = date instanceof Date && !isNaN(date.getTime());

                const key = date?.toDateString();
                const workout = key ? workoutData.get(key) : null;
                const tooltip = workout
                  ? [
                      date?.toDateString() + "\n",
                      ...workout.workouts.flatMap((w) =>
                        w.exerciseLog.map(
                          (e: any) =>
                            `💪 ${e.name}: ${e.sets}x${e.reps} @ ${e.weight}kg`,
                        ),
                      ),
                    ].join("\n")
                  : date?.toDateString();

                return (
                  <div
                    key={dayIndex}
                    className={`rounded-[3px] w-3.5 h-3.5 ${
                      isValid
                        ? workout
                          ? "bg-green-600"
                          : "bg-gray-800"
                        : "bg-gray-950"
                    }`}
                    title={isValid ? tooltip : ""}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <Skeleton className="h-[160px] w-[980px] rounded-xl" />
  );
};

const ConsistencyGrid: React.FC = () => {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <div>
      <h2 className="text-2xl text-white font-sl mb-4 px-2">
        Consistency Grid
      </h2>
      <div className="flex gap-2 items-center justify-center px-2 max-w-screen">
        <ContributionCalendar year={year} />
      </div>
    </div>
  );
};

export default ConsistencyGrid;
