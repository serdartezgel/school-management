"use client";

import Image from "next/image";
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

const chartData = [
  { grade: "0", count: 0 },
  { grade: "0-44", count: 30 },
  { grade: "45-54", count: 80 },
  { grade: "55-69", count: 210 },
  { grade: "70-84", count: 130 },
  { grade: "85-100", count: 50 },
  { grade: "100", count: 0 },
];

const chartConfig = {
  count: {
    label: "Students",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const GradeChart = () => {
  return (
    <div className="bg-background h-full w-full rounded-xl p-4">
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold">Grades</span>
            <Image
              src="/images/moreDark.png"
              alt="More"
              width={20}
              height={20}
            />
          </CardTitle>
          <CardDescription>Midterms</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto max-w-[600px]"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="grade"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="count"
                type="natural"
                stroke="var(--color-blue-400)"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeChart;
