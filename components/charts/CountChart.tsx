"use client";

import Image from "next/image";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [{ boys: 260, girls: 240 }];

const chartConfig = {
  boys: {
    label: "Boys",
    color: "var(--chart-1)",
  },
  girls: {
    label: "Girls",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const CountChartContainer = () => {
  const totalStudents = chartData[0].boys + chartData[0].girls;

  return (
    <div className="bg-background h-full w-full rounded-xl max-xl:min-w-[250px]">
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold">Students</span>
            <Image
              src="/images/moreDark.png"
              alt="More"
              width={20}
              height={20}
            />
          </CardTitle>
          <CardDescription>2025-2026 Academic Year</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[250px]"
          >
            <RadialBarChart
              data={chartData}
              endAngle={180}
              innerRadius={70}
              outerRadius={120}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalStudents.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground"
                          >
                            Students
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="girls"
                fill="var(--color-fuchsia-500)"
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="boys"
                stackId="a"
                cornerRadius={5}
                fill="var(--color-cyan-400)"
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex justify-center gap-6 text-sm">
          <div className="flex flex-col items-center gap-1">
            <div className="h-5 w-5 rounded-full bg-cyan-400" />
            <span className="font-bold">{chartData[0].boys}</span>
            <span className="text-xs text-gray-400">
              Boys (
              {Math.round(
                (chartData[0].boys / (chartData[0].boys + chartData[0].girls)) *
                  100,
              )}
              %)
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-5 w-5 rounded-full bg-fuchsia-500" />
            <span className="font-bold">{chartData[0].girls}</span>
            <span className="text-xs text-gray-400">
              Girls (
              {Math.round(
                (chartData[0].girls /
                  (chartData[0].girls + chartData[0].boys)) *
                  100,
              )}
              %)
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CountChartContainer;
