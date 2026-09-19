import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CalendarDays,
  ChartLine,
  Coins,
  DollarSign,
  Percent,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Mortgage Repayments",
    description:
      "Calculate your monthly mortgage payments, compare different loan terms, and see how interest rates affect your repayments.",
    icon: DollarSign,
    href: "/mortgage-repayments-calculator",
    benefits: [
      { icon: CalendarDays, text: "Monthly & total repayment estimates" },
      { icon: Percent, text: "Adjustable interest rates & loan terms" },
      { icon: ChartLine, text: "Full amortisation schedule breakdown" },
    ],
  },
  {
    title: "Compound Interest",
    description:
      "See how your investments grow over time with compound interest. Project savings, compare frequencies, and plan your financial future.",
    icon: TrendingUp,
    href: "/compound-interest-calculator",
    benefits: [
      { icon: RefreshCw, text: "Annual, monthly & daily compounding" },
      { icon: Coins, text: "Initial & recurring contribution support" },
      { icon: ChartLine, text: "Year-by-year growth projections" },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b bg-background">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Calculator className="size-4" />
            </span>
            FinCalc
          </Link>
          <nav className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/mortgage-repayments-calculator" />}
              nativeButton={false}
            >
              Mortgage
            </Button>
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/compound-interest-calculator" />}
              nativeButton={false}
            >
              Compound Interest
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="flex flex-col items-center px-6 py-20 text-center sm:py-28">
          <Badge variant="secondary" className="mb-6">
            <Calculator data-icon="inline-start" />
            Smart financial tools at your fingertips
          </Badge>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Make sense of your money
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Quick, accurate calculators for mortgages and compound interest —
            no spreadsheets required.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              render={<Link href="/mortgage-repayments-calculator" />}
              nativeButton={false}
            >
              Mortgage Calculator
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/compound-interest-calculator" />}
              nativeButton={false}
            >
              Compound Interest
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-4xl gap-6 px-6 pb-20 sm:pb-24 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col">
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="flex flex-col gap-2.5">
                  {feature.benefits.map((benefit) => (
                    <li
                      key={benefit.text}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <benefit.icon className="size-4 shrink-0 text-primary" />
                      {benefit.text}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  render={<Link href={feature.href} />}
                  nativeButton={false}
                >
                  Open {feature.title}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 text-sm text-muted-foreground">
          <p>FinCalc — free calculators for smarter financial decisions.</p>
        </div>
      </footer>
    </div>
  );
}