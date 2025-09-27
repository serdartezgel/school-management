import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentWeekRange(): string {
  const today = new Date();
  const day = today.getDay(); // Sunday = 0, Monday = 1, ...

  // Calculate how many days to subtract to get Monday
  const diffToMonday = day === 0 ? -6 : 1 - day;

  // Get Monday date
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  // Get Friday date
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  // Format function (e.g., Oct 1)
  const formatDate = (date: Date): string =>
    date.toLocaleString("en-US", { month: "short", day: "numeric" });

  return `${formatDate(monday)} - ${formatDate(friday)}`;
}

export const roleColors: Record<string, string> = {
  ADMIN: "border-red-500",
  TEACHER: "border-green-500",
  STUDENT: "border-yellow-500",
  PARENT: "border-blue-500",
};

export const formatMessageDate = (date: Date) => {
  if (!date) return "";
  return format(new Date(date), "Pp");
};
