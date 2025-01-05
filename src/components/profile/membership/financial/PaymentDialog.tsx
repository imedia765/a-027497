import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/formatters";
import { Member } from "@/types/member";
import { useToast } from "@/hooks/use-toast";

interface PaymentDialogProps {
  memberProfile: Member;
}

const PaymentDialog = ({ memberProfile }: PaymentDialogProps) => {
  const [paymentType, setPaymentType] = useState<'yearly' | 'emergency'>('yearly');
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cash'>('bank');
  const { toast } = useToast();

  const handlePayment = () => {
    // Here you would integrate with your payment processing system
    toast({
      title: "Payment Initiated",
      description: `${paymentType === 'yearly' ? 'Yearly' : 'Emergency'} payment of ${
        paymentType === 'yearly' 
          ? formatCurrency(memberProfile?.yearly_payment_amount || 40)
          : formatCurrency(Number(amount))
      } via ${paymentMethod}`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          Make a Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-dashboard-card border-dashboard-accent1/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">Make a Payment</DialogTitle>
          <div className="space-y-2 mt-3">
            <p className="text-dashboard-accent2 text-lg font-bold">
              Member #{memberProfile?.member_number}
            </p>
            {memberProfile?.collector && (
              <p className="text-white text-base font-medium">
                Collector: {memberProfile.collector}
              </p>
            )}
          </div>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <Label className="text-dashboard-accent2 text-base font-semibold">Payment Type</Label>
            <RadioGroup
              defaultValue="yearly"
              onValueChange={(value) => setPaymentType(value as 'yearly' | 'emergency')}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly" className="text-white font-medium">Yearly Payment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="emergency" id="emergency" />
                <Label htmlFor="emergency" className="text-white font-medium">Emergency Payment</Label>
              </div>
            </RadioGroup>
          </div>

          {paymentType === 'yearly' ? (
            <div className="space-y-3">
              <Label className="text-dashboard-accent2 text-base font-semibold">Amount Due</Label>
              <div className="text-xl font-bold text-white">
                {formatCurrency(memberProfile?.yearly_payment_amount || 40)}
              </div>
              <div className="text-base font-medium text-dashboard-accent1">
                Due Date: {memberProfile?.yearly_payment_due_date || 'January 1st, 2025'}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Label htmlFor="amount" className="text-dashboard-accent2 text-base font-semibold">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 font-medium"
              />
            </div>
          )}

          <div className="space-y-4">
            <Label className="text-dashboard-accent2 text-base font-semibold">Payment Method</Label>
            <RadioGroup
              defaultValue="bank"
              onValueChange={(value) => setPaymentMethod(value as 'bank' | 'cash')}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="text-white font-medium">Bank Transfer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="text-white font-medium">Cash</Label>
              </div>
            </RadioGroup>

            {paymentMethod === 'bank' && (
              <div className="mt-4 p-4 bg-white/10 rounded-lg border border-dashboard-accent1/20">
                <h4 className="text-dashboard-accent2 text-lg font-bold mb-3">Bank Details</h4>
                <div className="space-y-3 text-white">
                  <p className="font-semibold">HSBC Pakistan Welfare Association Burton On Trent</p>
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                    <span className="font-medium">Sort Code:</span>
                    <span className="font-bold text-dashboard-accent2">40-15-31</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                    <span className="font-medium">Account Number:</span>
                    <span className="font-bold text-dashboard-accent2">41024892</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button onClick={handlePayment} className="w-full bg-dashboard-accent1 hover:bg-dashboard-accent1/80 text-white font-bold text-lg">
            Proceed with Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;