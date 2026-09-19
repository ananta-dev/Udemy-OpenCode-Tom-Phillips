import type { Metadata } from "next";

import { MortgageCalculator } from "./mortgage-calculator";

export const metadata: Metadata = {
  title: "Mortgage Repayments Calculator",
  description:
    "Calculate your monthly mortgage repayments and explore the full amortisation schedule.",
};

export default function MortgageRepaymentsCalculatorPage() {
  return <MortgageCalculator />;
}