import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Data analysis and visualization tools</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Analyzer</CardTitle>
            <CardDescription>Analyze and visualize your business data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Analytics dashboard coming soon with charts and insights</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
