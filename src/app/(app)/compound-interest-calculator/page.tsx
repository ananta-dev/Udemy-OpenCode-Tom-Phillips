import type { Metadata } from "next";

import { CompoundInterestCalculator } from "./compound-interest-calculator";

export const metadata: Metadata = {
  title: "Compound Interest Calculator",
  description:
    "Project how your savings and recurring contributions grow over time with compound interest.",
};

export default function CompoundInterestCalculatorPage() {
  return <CompoundInterestCalculator />;
}
