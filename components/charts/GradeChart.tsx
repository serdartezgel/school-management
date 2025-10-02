"use client";

import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getGradesChartData } from "@/lib/actions/grade.action";
import { GradeType } from "@/prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const chartConfig = {
  count: {
    label: "Students",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const GradeChart = () => {
  const [selectedGradeType, setSelectedGradeType] = useState<GradeType>(
    GradeType.MIDTERM,
  );
  const [chartData, setChartData] = useState<
    { grade: string; count: number }[]
  >([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const result = await getGradesChartData({
          type: [selectedGradeType],
        });

        if (result.success) {
          setChartData(result.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch grades chart data", error);
      }
    });
  }, [selectedGradeType]);

  return (
    <div className="bg-background h-full w-full rounded-xl p-4">
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold">Grades</span>
            <Link href="/grades">
              <Image
                src="/images/moreDark.png"
                alt="More"
                width={20}
                height={20}
              />
            </Link>
          </CardTitle>
          <CardDescription>
            <Select
              value={selectedGradeType}
              onValueChange={(value) =>
                setSelectedGradeType(value as GradeType)
              }
            >
              <SelectTrigger className="no-focus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(GradeType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto max-w-[600px]"
          >
            {isPending ? (
              <Loader className="size-6 w-full animate-spin" />
            ) : (
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 10,
                  right: 10,
                  top: 8,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="grade"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tickMargin={8}
                  padding={{ left: 10, right: 10 }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="count"
                  type="monotone"
                  stroke="var(--color-secondary)"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            )}
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeChart;
