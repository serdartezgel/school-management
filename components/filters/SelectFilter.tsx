"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SelectFilterProps {
  label?: string;
  placeholder: string;
  route: string;
  className?: string;
  filterBy: string;
  data: ClassDoc[] | SubjectDoc[];
}

const SelectFilter = ({
  label,
  placeholder,
  route,
  filterBy,
  data,
  className,
}: SelectFilterProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filter, setFilter] = useState("");

  useEffect(() => {
    const urlFilter = searchParams.get(filterBy);
    if (
      urlFilter &&
      data.some((item) => item.name === decodeURIComponent(urlFilter))
    ) {
      setFilter(decodeURIComponent(urlFilter));
    } else {
      setFilter("");
    }
  }, [searchParams, filterBy, data]);

  useEffect(() => {
    const filterValue = filter === "all" ? "" : filter;

    if (filterValue) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: filterBy,
        value: filterValue,
        pathname,
      });

      router.push(newUrl, { scroll: false });
    } else {
      if (pathname === route) {
        const newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: [filterBy],
          pathname,
        });

        router.push(newUrl, { scroll: false });
      }
    }
  }, [filter, pathname, route, router, searchParams, filterBy]);

  return (
    <div className={`${className} bg-sidebar`}>
      {label && <p className="text-sm font-medium">{label}</p>}
      <Select
        value={filter}
        onValueChange={(val) => setFilter(val)}
        defaultValue="all"
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All {filterBy}</SelectItem>
          {data.map((obj) => (
            <SelectItem key={obj.id} value={obj.name}>
              {obj.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectFilter;
