import { workoutDates } from "@/action/stat";

export function calculateScore({
  type,
  exercise,
  weight,
  reps,
  sets,
  userWeight,
}: {
  type: "static" | "bodyweight" | "weighted";
  exercise: string;
  weight: number;
  reps: number;
  sets: number;
  userWeight: number;
}) {
  // Get the difficulty multiplier for this exercise
  const difficultyMultiplier =
    bodyweightMultipliers[exercise] || bodyweightMultipliers.default;

  // Get the average reference value for this exercise
  const averageValue = averageEffort[exercise] || averageEffort.default;

  // Calculate raw performance value based on exercise type
  let rawPerformance: number;

  switch (type) {
    case "static":
      // For static exercises like planks, use the duration or reps as seconds held
      rawPerformance = reps;
      break;

    case "bodyweight":
      // For bodyweight exercises, calculate total volume with bodyweight factor
      // Adjust for the portion of bodyweight being moved
      const bodyweightFactor =
        exercise.includes("pull-up") ||
        exercise.includes("chin-up") ||
        exercise.includes("dip")
          ? 0.9
          : 0.65;

      // factor in user's weight for more personalized scoring
      rawPerformance = reps * sets * ((userWeight * bodyweightFactor) / 70);
      break;

    case "weighted":
      // For weighted exercises, calculate total volume (weight × reps × sets)
      rawPerformance = weight * reps * sets;
      break;

    default:
      rawPerformance = reps * sets;
  }

  // Apply difficulty multiplier to the raw performance
  const adjustedPerformance = rawPerformance * difficultyMultiplier;

  // Calculate normalized score (50 = average performance, scale factor controls spread)
  const scaleFactor = 25; // Controls how quickly scores increase/decrease
  const normalizedScore = 50 * (adjustedPerformance / averageValue);

  // Apply logarithmic scaling to compress extremely high values
  // This prevents extreme performances from going off the scale
  const logisticScaled =
    50 + scaleFactor * Math.log10(normalizedScore / 50 + 0.1);

  // Ensure score is within bounds (1-120)
  return Math.max(1, Math.min(120, Math.round(logisticScaled)));
}

export const bodyweightMultipliers: Record<string, number> = {
  // Bodyweight exercises
  "push-ups": 1.0,
  "inverted-row": 1.2,
  "tricep-dips": 1.3,
  "pull-ups": 1.5,
  "chin-ups": 1.4,

  // Core exercises
  "plank": 0.5, // seconds are counted as reps
  "side-plank": 0.6, // seconds are counted as reps
  "leg-raises": 1.1,
  "reverse-crunches": 1.0,
  "crunches": 0.8,
  "bicycle-crunches": 0.9,

  // Default for unspecified exercises
  default: 1.0,
};

const averageEffort: Record<string, number> = {
  // Bodyweight exercises (total reps across all sets)
  "push-ups": 30, // e.g., 3 sets of 10
  "inverted-row": 20, // e.g., 2 sets of 10
  "tricep-dips": 20, // e.g., 2 sets of 10
  "pull-ups": 10, // e.g., 2 sets of 5
  "chin-ups": 12, // e.g., 2 sets of 6

  // Static exercises (in seconds)
  "plank": 60, // 1 minute plank
  "side-plank": 30, // 30 seconds per side

  // Core exercises (total reps across all sets)
  "leg-raises": 30, // e.g., 3 sets of 10
  "reverse-crunches": 30, // e.g., 3 sets of 10
  "crunches": 40, // e.g., 2 sets of 20
  "bicycle-crunches": 40, // e.g., 2 sets of 20

  // Weighted exercises (total kg volume: weight × reps × sets)
  "squat": 400, // e.g., 3 sets of 8 reps at 50kg
  "deadlift": 500, // e.g., 3 sets of 5 reps at 80kg
  "romanian-deadlift": 500, 
  "bench-press": 300, // e.g., 3 sets of 8 reps at 40kg
  "overhead-press": 200, // e.g., 3 sets of 8 reps at 25kg
  "bicep-curls": 180, // e.g., 3 sets of 10 reps at 10kg
  "dumbbell-row": 300, // e.g., 3 sets of 10 reps at 15kg

  // Default for unspecified exercises
  default: 50,
};

export function statToRank(score: number) {
  if (score >= 111) return "SS";
  if (score >= 106) return "S+";
  if (score >= 101) return "S";
  if (score >= 99) return "S-";
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  if (score >= 55) return "C-";
  if (score >= 50) return "D+";
  if (score >= 45) return "D";
  if (score >= 40) return "D-";
  if (score >= 30) return "E+";
  if (score >= 20) return "E";
  return "E-";
}
export const rankStyles: Record<string, string> = {
  // Mythic Tier
  SS: "text-yellow-400 font-bold drop-shadow-[0_0_6px_#facc15]",
  "S+": "text-yellow-500 font-bold drop-shadow-[0_0_5px_#eab308]",
  S: "text-orange-500 font-bold drop-shadow-[0_0_6px_#fb923c]",

  // Advanced Tier
  "A+": "text-sky-300 font-semibold drop-shadow-[0_0_5px_#7dd3fc]",
  A: "text-sky-400 font-semibold drop-shadow-[0_0_5px_#38bdf8]",
  "A-": "text-sky-500 font-semibold drop-shadow-[0_0_4px_#0ea5e9]",

  // Intermediate Tier
  "B+": "text-lime-300 font-medium drop-shadow-[0_0_4px_#bef264]",
  B: "text-lime-400 font-medium drop-shadow-[0_0_4px_#a3e635]",
  "B-": "text-lime-500 font-medium drop-shadow-[0_0_3px_#84cc16]",

  // Average Tier
  "C+": "text-gray-200 font-normal drop-shadow-[0_0_3px_#e5e7eb]",
  C: "text-gray-300 font-normal drop-shadow-[0_0_3px_#d1d5db]",
  "C-": "text-gray-400 font-normal drop-shadow-[0_0_2px_#9ca3af]",

  // Developing Tier
  "D+": "text-amber-500 font-medium drop-shadow-[0_0_3px_#f59e0b]",
  D: "text-amber-600 font-medium drop-shadow-[0_0_3px_#fbbf24]",
  "D-": "text-amber-700 font-medium drop-shadow-[0_0_2px_#b45309]",

  // Beginner Tier
  "E+": "text-red-300 font-medium drop-shadow-[0_0_3px_#fca5a5]",
  E: "text-red-400 font-medium drop-shadow-[0_0_3px_#f87171]",
  "E-": "text-red-500 font-medium drop-shadow-[0_0_2px_#ef4444]",
};
/**
 * Calculate user level based on number of workout days with diminishing returns
 * @param {Array} workoutDates - Array of dates when user logged workouts
 * @returns {Object} Level information including current level and progress to next level
 */
const calculateDaysBasedLevel = (workoutDates: { date: Date }[]) => {
  // No workouts yet
  if (!workoutDates || workoutDates.length === 0) {
    return {
      level: 1,
      daysLogged: 0,
      nextLevelAt: 1,
      daysToNextLevel: 0,
      progress: 0,
    };
  }

  // Count unique workout days (in case there are multiple logs for same day)
  const uniqueDays = new Set(
    workoutDates.map((date) => {
      const d = new Date(date.date);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }),
  );

  const daysLogged = uniqueDays.size;

  // Progressive leveling formula - early levels come quickly, later levels require more days
  // Level 1: 0 days (starting level)
  // Level 2: 1 day
  // Level 3: 3 days
  // Level 4: 6 days
  // Level 5: 10 days
  // Level 10: 45 days
  // Level 20: 190 days
  // Level 50: 1225 days (about 3.3 years)
  // Level 100: 4950 days (about 13.5 years)

  // Formula uses triangular numbers: n(n+1)/2
  // To find level from days: level = floor(sqrt(2*days + 0.25) + 0.5)
  const level = Math.floor(Math.sqrt(2 * daysLogged + 0.25) + 0.5);

  // Calculate days needed for next level
  const daysForCurrentLevel = (level * (level - 1)) / 2;
  const daysForNextLevel = (level * (level + 1)) / 2;
  const daysNeededForNextLevel = daysForNextLevel - daysForCurrentLevel;
  const daysProgressInCurrentLevel = daysLogged - daysForCurrentLevel;

  // Calculate progress percentage to next level
  const progressToNextLevel = Math.min(
    Math.floor((daysProgressInCurrentLevel / daysNeededForNextLevel) * 100),
    99,
  );

  return {
    level: level,
    daysLogged: daysLogged,
    nextLevelAt: daysForNextLevel + 1,
    daysToNextLevel: daysNeededForNextLevel - daysProgressInCurrentLevel,
    progress: progressToNextLevel,
  };
};

export const getUserLevel = async () => {
  const Dates = await workoutDates();
  return calculateDaysBasedLevel(Dates);
};
