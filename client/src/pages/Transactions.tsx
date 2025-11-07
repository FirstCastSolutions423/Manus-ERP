import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Transactions() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"income" | "expense" | "transfer">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const { data: transactions, isLoading } = trpc.transactions.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.transactions.create.useMutation({
    onSuccess: () => {
      utils.transactions.list.invalidate();
      utils.dashboard.stats.invalidate();
      setOpen(false);
      setAmount("");
      setCategory("");
      setDescription("");
      toast.success("Transaction created");
    },
  });

  const handleCreate = () => {
    createMutation.mutate({
      type,
      amount: Math.round(parseFloat(amount) * 100),
      category: category || undefined,
      description: description || undefined,
      transactionDate: new Date(),
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground mt-1">Track income, expenses, and financial activity</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Add Transaction</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Transaction</DialogTitle>
                <DialogDescription>Record a financial transaction</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Type</Label>
                  <Select value={type} onValueChange={(v: any) => setType(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Amount ($)</Label>
                  <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Salary, Rent, Utilities" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional notes" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={!amount || createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading transactions...</div>
        ) : transactions && transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((txn) => (
              <Card key={txn.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {txn.type === "income" ? (
                        <ArrowUpCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-semibold">{txn.category || txn.type}</p>
                        {txn.description && <p className="text-sm text-muted-foreground">{txn.description}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(txn.transactionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${txn.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {txn.type === "income" ? "+" : "-"}${(txn.amount / 100).toFixed(2)}
                      </p>
                      {txn.flagged && (
                        <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                          <AlertTriangle className="h-3 w-3" />
                          Flagged
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No transactions yet. Add your first transaction!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
