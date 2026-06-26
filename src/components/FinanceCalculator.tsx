import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calculator } from "lucide-react";

const FinanceCalculator = () => {
  const [carPrice, setCarPrice] = useState(20000);
  const [downPayment, setDownPayment] = useState(5000);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(48);

  const loanAmount = carPrice - downPayment;
  const monthlyInterestRate = interestRate / 100 / 12;
  
  const monthlyPayment = loanAmount > 0 && interestRate > 0
    ? (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
      (Math.pow(1 + monthlyInterestRate, loanTerm) - 1)
    : loanAmount / loanTerm;

  const totalPayment = monthlyPayment * loanTerm;
  const totalInterest = totalPayment - loanAmount;

  const formatCurrency = (value: number) => {
    return value.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <Card className="bg-card border border-border sticky top-[calc(100vh-24rem)]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-heading text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          Kalkulatori i Financimit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Car Price */}
        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-sm">Çmimi i veturës</Label>
            <span className="text-sm font-medium">{formatCurrency(carPrice)}</span>
          </div>
          <Slider
            min={5000}
            max={100000}
            step={500}
            value={[carPrice]}
            onValueChange={([value]) => setCarPrice(value)}
          />
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-sm">Pagesa fillestare</Label>
            <span className="text-sm font-medium">{formatCurrency(downPayment)}</span>
          </div>
          <Slider
            min={0}
            max={carPrice * 0.5}
            step={500}
            value={[downPayment]}
            onValueChange={([value]) => setDownPayment(value)}
          />
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-sm">Interesi vjetor</Label>
            <span className="text-sm font-medium">{interestRate}%</span>
          </div>
          <Slider
            min={1}
            max={15}
            step={0.5}
            value={[interestRate]}
            onValueChange={([value]) => setInterestRate(value)}
          />
        </div>

        {/* Loan Term */}
        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-sm">Periudha (muaj)</Label>
            <span className="text-sm font-medium">{loanTerm} muaj</span>
          </div>
          <Slider
            min={12}
            max={84}
            step={6}
            value={[loanTerm]}
            onValueChange={([value]) => setLoanTerm(value)}
          />
        </div>

        {/* Results */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Shuma e kredisë</span>
            <span className="font-medium">{formatCurrency(loanAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Interesi total</span>
            <span className="font-medium text-accent">{formatCurrency(totalInterest)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm font-medium">Pagesa mujore</span>
            <span className="font-heading text-2xl font-bold text-primary">
              {formatCurrency(monthlyPayment)}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          * Ky është vetëm një llogaritje orientuese
        </p>
      </CardContent>
    </Card>
  );
};

export default FinanceCalculator;
