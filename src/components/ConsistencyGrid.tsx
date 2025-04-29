import React from "react";

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
};

type ContributionCalendarProps = {
  year: number;
};

const ContributionCalendar: React.FC<ContributionCalendarProps> = ({
  year,
}) => {
  const days = generateYearDays(year);

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

  return (
    <div className="flex gap-[3px] p-2 overflow-x-auto rounded">
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-[3px]">
          {Array.from({ length: 7 }).map((_, dayIndex) => {
            const date = week[dayIndex];
            const isValid = date instanceof Date && !isNaN(date.getTime());

            return (
              <div
                key={dayIndex}
                className={`xs:w-1 xs:h-1 rounded-[4px] sm:w-3 sm:h-3 ${
                  isValid ? "bg-gray-800" : "bg-gray-950"
                }`}
                title={isValid ? date.toDateString() : ""}
              ></div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const ConsistencyGrid: React.FC = () => {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <div>
      <h2 className="text-2xl text-white font-sl mb-4">Consistency Grid</h2>
      <div className="flex gap-2 items-center justify-center">
        <ContributionCalendar year={year} />
      </div>
    </div>
  );
};

export default ConsistencyGrid;
