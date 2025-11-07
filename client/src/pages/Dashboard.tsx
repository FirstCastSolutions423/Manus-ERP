import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BarChart3, CheckCircle2, FileText, AlertCircle, TrendingUp, DollarSign } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  const statCards = [
    {
      title: "Total Tasks",
      value: stats?.tasks?.total || 0,
      description: `${stats?.tasks?.completed || 0} completed`,
      icon: CheckCircle2,
      color: "text-blue-600",
    },
    {
      title: "Transactions",
      value: stats?.transactions?.total || 0,
      description: `${stats?.transactions?.flagged || 0} flagged`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Open Tickets",
      value: stats?.tickets?.open || 0,
      description: `${stats?.tickets?.total || 0} total tickets`,
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      title: "Documents",
      value: stats?.documents?.total || 0,
      description: "Files stored",
      icon: FileText,
      color: "text-purple-600",
    },
  ];

  const netBalance = ((stats?.transactions?.totalIncome || 0) - (stats?.transactions?.totalExpense || 0)) / 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your enterprise resource planning system
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Your income and expense summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${((stats?.transactions?.totalIncome || 0) / 100).toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${((stats?.transactions?.totalExpense || 0) / 100).toFixed(2)}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-red-600" />
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Net Balance</p>
                  <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${netBalance.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a href="/tasks" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
                <p className="font-medium">Create Task</p>
                <p className="text-sm text-muted-foreground">Add a new to-do item</p>
              </a>
              <a href="/transactions" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
                <p className="font-medium">Add Transaction</p>
                <p className="text-sm text-muted-foreground">Record income or expense</p>
              </a>
              <a href="/reports" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
                <p className="font-medium">Generate Report</p>
                <p className="text-sm text-muted-foreground">Create custom reports</p>
              </a>
              <a href="/tickets" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
                <p className="font-medium">Submit Ticket</p>
                <p className="text-sm text-muted-foreground">Report an issue</p>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
