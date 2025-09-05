"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  isNext: boolean;
  totalItems: number;
}

const Pagination = ({ isNext, totalItems }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = searchParams.get("page") || 1;
  const pageSize = searchParams.get("pageSize") || 10;

  const handleNavigation = (type: "prev" | "next") => {
    const nextPageNumber =
      type === "prev" ? Number(page) - 1 : Number(page) + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };

  const handlePageSizeChange = (size: number) => {
    const cleanedQuery = removeKeysFromUrlQuery({
      params: searchParams.toString(),
      keysToRemove: ["page"],
    });

    const query = cleanedQuery.split("?")[1] ?? "";

    const newQuery = formUrlQuery({
      params: query,
      key: "pageSize",
      value: size.toString(),
    });

    router.push(newQuery);
  };

  const goToFirstPage = () => {
    const newUrl = removeKeysFromUrlQuery({
      params: searchParams.toString(),
      keysToRemove: ["page"],
    });

    router.push(newUrl);
  };

  const goToLastPage = () => {
    const lastPage = Math.ceil(totalItems / Number(pageSize));

    const cleanedQuery = removeKeysFromUrlQuery({
      params: searchParams.toString(),
      keysToRemove: ["page"],
    });

    const newQuery = formUrlQuery({
      params: cleanedQuery.split("?")[1] ?? "",
      key: "page",
      value: lastPage.toString(),
    });

    router.push(newQuery);
  };

  return (
    <div className="flex w-full items-center justify-between px-2">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            handlePageSizeChange(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize.toString()} />
          </SelectTrigger>
          <SelectContent side="top">
            {[5, 10, 25, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page} of {Math.ceil(totalItems / Number(pageSize))}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => goToFirstPage()}
            disabled={Number(page) === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handleNavigation("prev")}
            disabled={Number(page) === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handleNavigation("next")}
            disabled={!isNext}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => goToLastPage()}
            disabled={Number(page) === Math.ceil(totalItems / Number(pageSize))}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
