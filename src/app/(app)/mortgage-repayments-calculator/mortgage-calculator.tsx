"use client";

import { useMemo, useState } from "react";
import { Calculator, DollarSign, Percent } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

interface MortgageResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: AmortizationRow[];
}

function calculateMortgage(
  principal: number,
  annualRate: number,
  years: number
): MortgageResult {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;

  if (monthlyRate === 0) {
    const payment = principal / numPayments;
    const schedule: AmortizationRow[] = [];
    let remaining = principal;
    for (let month = 1; month <= numPayments; month++) {
      const principalPayment = payment;
      remaining -= principalPayment;
      schedule.push({
        month,
        payment,
        principal: principalPayment,
        interest: 0,
        remainingBalance: Math.max(0, remaining),
      });
    }
    return {
      monthlyPayment: payment,
      totalPayment: principal,
      totalInterest: 0,
      schedule,
    };
  }

  const payment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  const schedule: AmortizationRow[] = [];
  let remaining = principal;
  for (let month = 1; month <= numPayments; month++) {
    const interestPayment = remaining * monthlyRate;
    const principalPayment = payment - interestPayment;
    remaining -= principalPayment;
    schedule.push({
      month,
      payment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: Math.max(0, remaining),
    });
  }

  return {
    monthlyPayment: payment,
    totalPayment: payment * numPayments,
    totalInterest: payment * numPayments - principal,
    schedule,
  };
}

export function MortgageCalculator() {
  const [propertyPrice, setPropertyPrice] = useState("400000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [downPayment, setDownPayment] = useState("100000");

  const principal =
    Math.max(0, parseFloat(propertyPrice) || 0) -
    Math.max(0, parseFloat(downPayment) || 0);
  const rate = parseFloat(interestRate) || 0;
  const term = Math.max(1, parseInt(loanTerm) || 0);

  const result = useMemo<MortgageResult | null>(() => {
    if (principal <= 0 || rate < 0 || term < 1) return null;
    return calculateMortgage(principal, rate, term);
  }, [principal, rate, term]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-8">
        <Badge
          variant="outline"
          className="h-auto gap-2 rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-4"
        >
          <Calculator data-icon="inline-start" />
          Mortgage Calculator
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Mortgage Repayments Calculator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Calculate your monthly mortgage payments and see the full
          amortisation schedule.
        </p>
      </div>

      <Tabs defaultValue="calculator">
        <TabsList>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="amortization">
            Amortisation Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
                <CardDescription>
                  Enter your property price and loan terms to calculate
                  repayments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="propertyPrice">
                      Property Price
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <DollarSign />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="propertyPrice"
                        type="number"
                        value={propertyPrice}
                        onChange={(e) => setPropertyPrice(e.target.value)}
                      />
                    </InputGroup>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="downPayment">Down Payment</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <DollarSign />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="downPayment"
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                      />
                    </InputGroup>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="interestRate">
                      Annual Interest Rate
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <Percent />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="interestRate"
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                      />
                    </InputGroup>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="loanTerm">
                      Loan Term (years)
                    </FieldLabel>
                    <InputGroupInput
                      id="loanTerm"
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                    />
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Repayments</CardTitle>
                <CardDescription>
                  Estimated monthly and total costs.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Monthly Payment
                  </p>
                  <p className="text-4xl font-semibold tracking-tight">
                    {result ? formatCurrency(result.monthlyPayment) : "—"}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Payment
                    </p>
                    <p className="text-lg font-medium">
                      {result ? formatCurrency(result.totalPayment) : "—"}
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
                      Loan Amount
                    </p>
                    <p className="text-lg font-medium">
                      {formatCurrency(principal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Number of Payments
                    </p>
                    <p className="text-lg font-medium">
                      {term > 0 && principal > 0 ? term * 12 : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="amortization" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Amortisation Schedule</CardTitle>
              <CardDescription>
                Monthly breakdown of principal and interest payments throughout
                the loan term.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="sticky top-0 bg-card pb-2 pr-4 font-medium">
                          Month
                        </th>
                        <th className="sticky top-0 bg-card pb-2 pr-4 font-medium">
                          Payment
                        </th>
                        <th className="sticky top-0 bg-card pb-2 pr-4 font-medium">
                          Principal
                        </th>
                        <th className="sticky top-0 bg-card pb-2 pr-4 font-medium">
                          Interest
                        </th>
                        <th className="sticky top-0 bg-card pb-2 pl-4 text-right font-medium">
                          Remaining Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map((row) => (
                        <tr key={row.month} className="border-b last:border-0">
                          <td className="py-2 pr-4">{row.month}</td>
                          <td className="py-2 pr-4">
                            {formatCurrency(row.payment)}
                          </td>
                          <td className="py-2 pr-4">
                            {formatCurrency(row.principal)}
                          </td>
                          <td className="py-2 pr-4">
                            {formatCurrency(row.interest)}
                          </td>
                          <td className="py-2 pl-4 text-right">
                            {formatCurrency(row.remainingBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Enter valid loan details to see the amortisation schedule.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}