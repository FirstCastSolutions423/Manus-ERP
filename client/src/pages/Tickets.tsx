import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { AlertCircle, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Tickets() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [category, setCategory] = useState("");

  const { data: tickets, isLoading } = trpc.tickets.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.tickets.create.useMutation({
    onSuccess: () => {
      utils.tickets.list.invalidate();
      utils.dashboard.stats.invalidate();
      setOpen(false);
      setTitle("");
      setDescription("");
      setCategory("");
      toast.success("Ticket created");
    },
  });

  const handleCreate = () => {
    createMutation.mutate({
      title,
      description,
      priority,
      category: category || undefined,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
            <p className="text-muted-foreground mt-1">Report issues and track resolutions</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />New Ticket</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
                <DialogDescription>Report an issue or request assistance</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief description" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed explanation" />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Technical, Billing" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={!title || !description || createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Submit"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading tickets...</div>
        ) : tickets && tickets.length > 0 ? (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-600 mt-1" />
                      <div>
                        <h3 className="font-semibold">{ticket.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                            {ticket.status}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No tickets yet. Create a ticket if you need help!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
