"use client";

import Image from "next/image";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getCurrentWeekRange } from "@/lib/utils";
import { DayOfWeek } from "@/prisma/client";

const chartConfig = {
  present: {
    label: "Present",
    color: "var(--chart-1)",
  },
  absent: {
    label: "Absent",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const AttendanceChart = ({
  chartData,
}: {
  chartData: {
    day: DayOfWeek;
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
  }[];
}) => {
  return (
    <div className="bg-background h-full w-full rounded-lg">
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold">Attendance</span>
            <Link href="/attendances">
              <Image
                src="/images/moreDark.png"
                alt="More"
                width={20}
                height={20}
              />
            </Link>
          </CardTitle>
          <CardDescription>{getCurrentWeekRange()}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto max-w-[600px]"
          >
            <BarChart
              width={500}
              height={300}
              barSize={20}
              accessibilityLayer
              data={chartData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#ddd"
              />

              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <ChartLegend
                align="left"
                verticalAlign="top"
                wrapperStyle={{
                  paddingTop: "20px",
                  paddingBottom: "40px",
                }}
                content={<ChartLegendContent />}
              />
              <Bar
                dataKey="present"
                fill="var(--color-green-600)"
                legendType="circle"
                radius={4}
              />
              <Bar
                dataKey="absent"
                fill="var(--color-red-700)"
                legendType="circle"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceChart;
