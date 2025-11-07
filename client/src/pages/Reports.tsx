import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { FileText, Plus, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Reports() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"financial" | "analytics" | "custom" | "data_analysis">("financial");
  const [description, setDescription] = useState("");

  const { data: reports, isLoading } = trpc.reports.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.reports.create.useMutation({
    onSuccess: () => {
      utils.reports.list.invalidate();
      setOpen(false);
      setTitle("");
      setDescription("");
      toast.success("Report generation started");
    },
  });

  const handleCreate = () => {
    createMutation.mutate({ title, type, description: description || undefined });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground mt-1">Generate and view business reports</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Generate Report</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>Create a custom business report</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Report title" />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={type} onValueChange={(v: any) => setType(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">Financial Report</SelectItem>
                      <SelectItem value="analytics">Analytics Report</SelectItem>
                      <SelectItem value="data_analysis">Data Analysis</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Report details" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={!title || createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Generate"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading reports...</div>
        ) : reports && reports.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {report.title}
                  </CardTitle>
                  <CardDescription>{report.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  {report.description && <p className="text-sm text-muted-foreground mb-3">{report.description}</p>}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      report.status === "completed" ? "bg-green-100 text-green-700" :
                      report.status === "failed" ? "bg-red-100 text-red-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {report.status}
                    </span>
                    {report.fileUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Created {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No reports yet. Generate your first report!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
