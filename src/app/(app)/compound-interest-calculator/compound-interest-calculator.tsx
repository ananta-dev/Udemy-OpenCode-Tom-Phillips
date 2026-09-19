"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { DollarSign, Percent, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CompoundingFrequency = "annually" | "monthly" | "daily";

const COMPOUNDING_LABELS: Record<CompoundingFrequency, string> = {
  annually: "Annually",
  monthly: "Monthly",
  daily: "Daily",
};

const COMPOUNDING_PERIODS: Record<CompoundingFrequency, number> = {
  annually: 1,
  monthly: 12,
  daily: 365,
};

const compoundingItems: { label: string; value: CompoundingFrequency }[] = [
  { label: "Annually", value: "annually" },
  { label: "Monthly", value: "monthly" },
  { label: "Daily", value: "daily" },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

interface GrowthRow {
  year: number;
  balance: number;
  totalContributions: number;
  interestEarned: number;
}

interface CompoundInterestResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  schedule: GrowthRow[];
}

function calculateCompoundInterest(
  initialDeposit: number,
  monthlyContribution: number,
  annualRate: number,
  compounding: CompoundingFrequency,
  years: number,
): CompoundInterestResult {
  const periodsPerYear = COMPOUNDING_PERIODS[compounding];
  const perPeriodRate = annualRate / 100 / periodsPerYear;
  const contributionPerPeriod = (monthlyContribution * 12) / periodsPerYear;

  const balanceAt = (periods: number) => {
    if (perPeriodRate === 0) {
      return initialDeposit + contributionPerPeriod * periods;
    }
    const growth = Math.pow(1 + perPeriodRate, periods);
    return (
      initialDeposit * growth +
      contributionPerPeriod * ((growth - 1) / perPeriodRate)
    );
  };

  const schedule: GrowthRow[] = [];
  let previousBalance = initialDeposit;
  for (let year = 1; year <= years; year++) {
    const balance = balanceAt(periodsPerYear * year);
    const totalContributions = initialDeposit + monthlyContribution * 12 * year;
    schedule.push({
      year,
      balance,
      totalContributions,
      interestEarned: balance - previousBalance - monthlyContribution * 12,
    });
    previousBalance = balance;
  }

  const totalContributions = initialDeposit + monthlyContribution * 12 * years;
  const futureValue = balanceAt(periodsPerYear * years);

  return {
    futureValue,
    totalContributions,
    totalInterest: futureValue - totalContributions,
    schedule,
  };
}

const growthChartConfig = {
  contributions: {
    label: "Contributions",
    color: "var(--chart-1)",
  },
  interest: {
    label: "Interest Earned",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function CompoundInterestCalculator() {
  const [initialDeposit, setInitialDeposit] = useState("10000");
  const [monthlyContribution, setMonthlyContribution] = useState("200");
  const [annualRate, setAnnualRate] = useState("7");
  const [compounding, setCompounding] =
    useState<CompoundingFrequency>("monthly");
  const [years, setYears] = useState("20");

  const principal = Math.max(0, parseFloat(initialDeposit) || 0);
  const contribution = Math.max(0, parseFloat(monthlyContribution) || 0);
  const rate = parseFloat(annualRate) || 0;
  const term = Math.max(1, parseInt(years) || 0);

  const result = useMemo<CompoundInterestResult | null>(() => {
    if (principal < 0 || contribution < 0 || rate < 0 || term < 1) {
      return null;
    }
    return calculateCompoundInterest(
      principal,
      contribution,
      rate,
      compounding,
      term,
    );
  }, [principal, contribution, rate, compounding, term]);

  const chartData = useMemo(() => {
    if (!result) return null;
    const rows = result.schedule.map((row) => ({
      year: String(row.year),
      contributions: row.totalContributions,
      interest: Math.max(0, row.balance - row.totalContributions),
    }));
    return [{ year: "0", contributions: principal, interest: 0 }, ...rows];
  }, [result, principal]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-8">
        <Badge
          variant="outline"
          className="h-auto gap-2 rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-4"
        >
          <TrendingUp data-icon="inline-start" />
          Compound Interest Calculator
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Compound Interest Calculator
        </h1>
        <p className="mt-2 text-muted-foreground">
          See how your savings and recurring contributions grow over time with
          compound interest.
        </p>
      </div>

      <Tabs defaultValue="calculator">
        <TabsList>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="projection">Year-by-Year Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Investment Details</CardTitle>
                <CardDescription>
                  Enter your initial deposit, contributions, and interest rate
                  to project growth.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="initialDeposit">
                      Initial Deposit
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <DollarSign />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="initialDeposit"
                        type="number"
                        value={initialDeposit}
                        onChange={(e) => setInitialDeposit(e.target.value)}
                      />
                    </InputGroup>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="monthlyContribution">
                      Monthly Contribution
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <DollarSign />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="monthlyContribution"
                        type="number"
                        value={monthlyContribution}
                        onChange={(e) => setMonthlyContribution(e.target.value)}
                      />
                    </InputGroup>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="annualRate">
                      Annual Interest Rate
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <Percent />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="annualRate"
                        type="number"
                        step="0.1"
                        value={annualRate}
                        onChange={(e) => setAnnualRate(e.target.value)}
                      />
                    </InputGroup>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="compounding">
                      Compounding Frequency
                    </FieldLabel>
                    <Select
                      items={compoundingItems}
                      value={compounding}
                      onValueChange={(value) => {
                        if (value !== null) setCompounding(value);
                      }}
                    >
                      <SelectTrigger id="compounding" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {compoundingItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="years">Time Period (years)</FieldLabel>
                    <InputGroupInput
                      id="years"
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                    />
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projected Growth</CardTitle>
                <CardDescription>
                  Estimated value at the end of your investment period.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Future Value</p>
                  <p className="text-4xl font-semibold tracking-tight">
                    {result ? formatCurrency(result.futureValue) : "—"}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Contributions
                    </p>
                    <p className="text-lg font-medium">
                      {result ? formatCurrency(result.totalContributions) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Interest
                    </p>
                    <p className="text-lg font-medium">
                      {result ? formatCurrency(result.totalInterest) : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Compounding Frequency
                    </p>
                    <p className="text-lg font-medium">
                      {COMPOUNDING_LABELS[compounding]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Period</p>
                    <p className="text-lg font-medium">
                      {term > 0 && principal > 0 ? `${term} years` : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projection" className="mt-6 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Growth Over Time</CardTitle>
              <CardDescription>
                Contributions and interest earned year by year.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result && chartData ? (
                <ChartContainer
                  config={growthChartConfig}
                  className="aspect-auto h-72"
                >
                  <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="year"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={60}
                      tickFormatter={(value) =>
                        formatCompactCurrency(Number(value))
                      }
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                      }
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area
                      dataKey="contributions"
                      type="monotone"
                      stackId="growth"
                      fill="var(--color-contributions)"
                      fillOpacity={0.4}
                      stroke="var(--color-contributions)"
                    />
                    <Area
                      dataKey="interest"
                      type="monotone"
                      stackId="growth"
                      fill="var(--color-interest)"
                      fillOpacity={0.4}
                      stroke="var(--color-interest)"
                    />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground">
                  Enter valid investment details to see the growth chart.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Year-by-Year Projection</CardTitle>
              <CardDescription>
                Annual breakdown of your balance, contributions, and interest
                earned.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="sticky top-0 bg-card pb-2 pr-4 font-medium">
                          Year
                        </th>
                        <th className="sticky top-0 bg-card pb-2 pr-4 font-medium">
                          Ending Balance
                        </th>
                        <th className="sticky top-0 bg-card pb-2 pr-4 font-medium">
                          Total Contributions
                        </th>
                        <th className="sticky top-0 bg-card pb-2 pl-4 text-right font-medium">
                          Interest Earned
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map((row) => (
                        <tr key={row.year} className="border-b last:border-0">
                          <td className="py-2 pr-4">{row.year}</td>
                          <td className="py-2 pr-4">
                            {formatCurrency(row.balance)}
                          </td>
                          <td className="py-2 pr-4">
                            {formatCurrency(row.totalContributions)}
                          </td>
                          <td className="py-2 pl-4 text-right">
                            {formatCurrency(row.interestEarned)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Enter valid investment details to see the year-by-year
                  projection.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
