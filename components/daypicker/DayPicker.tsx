"use client";

import { addDays, format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";

const DayPicker = ({ route }: { route: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("date") || "";

  const today = new Date();
  const [searchQuery, setSearchQuery] = useState(today);

  const dateValue =
    searchQuery.toDateString() !== today.toDateString()
      ? searchQuery.toDateString()
      : null;

  useEffect(() => {
    if (dateValue) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "date",
        value: dateValue,
        pathname,
      });
      router.push(newUrl, { scroll: false });
    } else {
      if (pathname === route) {
        const newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ["date"],
          pathname,
        });

        router.push(newUrl, { scroll: false });
      }
    }
  }, [dateValue, pathname, query, route, router, searchParams, searchQuery]);

  const updateDate = (newDate: Date) => {
    setSearchQuery(newDate);
  };

  const goPrev = () => updateDate(addDays(searchQuery, -1));
  const goNext = () => updateDate(addDays(searchQuery, 1));

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={goPrev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex w-[150px] items-center gap-2 px-4 font-medium",
              !searchQuery && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            {searchQuery ? format(searchQuery, "PP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={searchQuery}
            onSelect={(d) => d && updateDate(d)}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="icon" onClick={goNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DayPicker;
