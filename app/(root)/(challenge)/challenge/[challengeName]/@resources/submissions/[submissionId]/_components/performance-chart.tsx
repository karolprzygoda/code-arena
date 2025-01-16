"use client";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getUserProfilePicture } from "@/lib/utils";
import { Clock, Cpu, LucideIcon, UserIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import useUser from "@/hooks/use-user";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { MetricData, MetricRange } from "@/lib/types";

const chartConfig = {
  runtime: {
    label: "Runtime",
    color: "hsl(var(--chart-1))",
    icon: Clock,
  },
  memory: {
    label: "Memory",
    color: "hsl(var(--chart-2))",
    icon: Cpu,
  },
} satisfies ChartConfig;

export function calculateRanges(values: number[]): MetricRange[] {
  if (values.length === 0) return [];

  if (values.length === 1) {
    return [
      {
        start: values[0],
        end: values[0] + 1,
        percentage: 100,
      },
    ];
  }

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const rangeSize = Number((maxValue - minValue).toFixed(2)) / 50;

  const ranges: MetricRange[] = [];
  let start = minValue;

  do {
    const end = Number((start + rangeSize).toFixed(2));
    const count = values.filter(
      (value) =>
        Number(value.toFixed(2)) >= Number(start.toFixed(2)) &&
        Number(value.toFixed(2)) < Number(end.toFixed(2)),
    ).length;

    const percentage = (count / values.length) * 100;
    ranges.push({ start, end, percentage });
    start = end;
  } while (start <= maxValue);

  return ranges;
}

export function calculateBeatPercentage(
  currentValue: number,
  values: number[],
): number {
  if (values.length === 1) {
    return currentValue < values[0] ? 0 : 100;
  }

  const totalValues = values.length;
  const beatenValues = values.filter((value) => currentValue < value).length;
  return Number(((beatenValues / totalValues) * 100).toFixed(2));
}

export function processMetricData(
  values: number[],
  currentValue: number,
  type: "memoryUsage" | "executionTime",
): MetricData {
  const timeRanges = calculateRanges(values);

  const data = timeRanges.map((range) => ({
    range: `${range.start.toFixed(2) + (type === "executionTime" ? " ms" : " MB")}`,
    solutions: Number(range.percentage.toFixed(2)),
    isActive: currentValue >= range.start && currentValue < range.end,
  }));

  return {
    data,
    current: currentValue,
    beat: calculateBeatPercentage(currentValue, values),
    unit: type === "executionTime" ? " ms" : " MB",
  };
}

type PerformanceChartProps = {
  executionTimes: number[];
  memoryUsages: number[];
  currentRuntime: number;
  currentMemory: number;
};

export function PerformanceChart({
  executionTimes,
  memoryUsages,
  currentRuntime,
  currentMemory,
}: PerformanceChartProps) {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("runtime");

  const performanceData = {
    runtime: processMetricData(executionTimes, currentRuntime, "executionTime"),
    memory: processMetricData(memoryUsages, currentMemory, "memoryUsage"),
  };

  const handleChangeActiveChart = (chart: keyof typeof chartConfig) => {
    setActiveChart(chart);
  };

  const user = useUser();

  return (
    <Card
      className={
        "mb-2 min-w-[275px] rounded-xl border-zinc-300 bg-transparent shadow-none dark:border-zinc-700"
      }
    >
      <CardHeader className={"p-4"}>
        <div className="flex w-full flex-wrap gap-3">
          {["runtime", "memory"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <ChangeChartButton
                key={chart}
                chart={chart}
                onClick={() => handleChangeActiveChart(chart)}
                activeChart={activeChart}
                label={chartConfig[chart].label}
                Icon={chartConfig[chart].icon}
                data={performanceData[chart].current}
                unit={performanceData[chart].unit}
                beat={performanceData[chart].beat}
              />
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={performanceData[activeChart].data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid
              className={"stroke-zinc-300 dark:stroke-zinc-700"}
              stroke="#3f3f46"
              strokeOpacity={20}
              vertical={false}
            />
            <XAxis
              dataKey="range"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              cursor="hsl(var(--chart-3))"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={20}
              width={45}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={<CustomCursor />}
              content={
                <ChartTooltipContent
                  className={"bg-zinc-100 dark:bg-zinc-700"}
                  indicator={"line"}
                  customUnit={"%"}
                />
              }
            />
            <Bar
              dataKey="solutions"
              fill={`var(--color-${activeChart})`}
              radius={[2, 2, 0, 0]}
              label={
                <CustomLabel
                  activeIndex={performanceData[activeChart].data.findIndex(
                    (item) => item.isActive,
                  )}
                  user={user}
                />
              }
            >
              {performanceData[activeChart].data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isActive
                      ? "hsl(var(--chart-5))"
                      : `var(--color-${activeChart})`
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const CustomLabel = ({
  x,
  y,
  width,
  index,
  activeIndex,
  user,
}: {
  x?: number;
  y?: number;
  width?: number;
  index?: number;
  activeIndex: number;
  user: User | null;
}) => {
  if (
    index !== activeIndex ||
    x === undefined ||
    y === undefined ||
    width === undefined ||
    index === undefined
  ) {
    return null;
  }

  const circleRadius = 20;
  const imageSize = 20;
  const userProfileImage = getUserProfilePicture(user);

  return (
    <g>
      <circle
        cx={x + width / 2}
        cy={y - circleRadius - imageSize / 2 - 5 + imageSize / 2}
        r={imageSize / 2 + 2}
        fill={"hsl(var(--chart-5))"}
      />
      <clipPath id={`clip-circle`}>
        <circle
          cx={x + width / 2}
          cy={y - circleRadius - imageSize / 2 - 5 + imageSize / 2}
          r={imageSize / 2}
        />
      </clipPath>
      {userProfileImage ? (
        <image
          href={userProfileImage}
          x={x + width / 2 - imageSize / 2}
          y={y - circleRadius - imageSize / 2 - 5}
          width={imageSize}
          height={imageSize}
          clipPath="url(#clip-circle)"
        />
      ) : (
        <g
          transform={`translate(${x + width / 2 - imageSize / 2}, ${y - circleRadius - imageSize / 2 - 5})`}
        >
          <circle
            cx={imageSize / 2}
            cy={imageSize / 2}
            r={imageSize / 2}
            className={"fill-zinc-100 dark:fill-zinc-700"}
          />
          <UserIcon
            strokeWidth={3}
            width={imageSize / 2}
            height={imageSize / 2}
            x={imageSize / 4}
            y={imageSize / 4}
          />
        </g>
      )}
    </g>
  );
};

type ChangeChartButtonProps = {
  Icon: LucideIcon;
  label: string;
  chart: string;
  activeChart: string;
  onClick: () => void;
  data: number;
  beat: number;
  unit: string;
};

const ChangeChartButton = ({
  chart,
  activeChart,
  onClick,
  Icon,
  label,
  data,
  beat,
  unit,
}: ChangeChartButtonProps) => {
  return (
    <button
      className={
        "flex flex-1 cursor-pointer flex-col gap-2 rounded-md p-4 transition data-[active=false]:bg-transparent data-[active=true]:bg-zinc-200 data-[active=false]:opacity-50 data-[active=false]:hover:opacity-100 data-[active=true]:dark:bg-zinc-700"
      }
      data-active={activeChart === chart}
      onClick={onClick}
    >
      <span className="flex items-center gap-1 text-xs">
        <Icon className={"h-4 w-4"} />
        {label}
      </span>
      <span className="flex items-center gap-2">
        <span className="text-xl font-semibold">{data}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
        <Separator
          className={"h-3/4 bg-muted-foreground"}
          orientation={"vertical"}
        />
        <span className={"flex items-center gap-2"}>
          <span className="text-sm text-muted-foreground">Beats</span>
          <span className="text-xl font-semibold">{beat}%</span>
        </span>
      </span>
    </button>
  );
};

const CustomCursor = ({
  x,
  y,
  width,
  height,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}) => {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="rgba(63, 63, 70, 0.8)"
    />
  );
};

export default PerformanceChart;
