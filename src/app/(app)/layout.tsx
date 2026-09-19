import Link from "next/link";
import { Calculator } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
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

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="border-t py-6">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 text-sm text-muted-foreground">
          <p>FinCalc — free calculators for smarter financial decisions.</p>
        </div>
      </footer>
    </div>
  );
}