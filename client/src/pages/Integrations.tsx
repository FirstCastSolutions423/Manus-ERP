import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Cloud, Mail, Package } from "lucide-react";

export default function Integrations() {
  const { data: integrations, isLoading } = trpc.integrations.list.useQuery();

  const availableIntegrations = [
    { type: "onedrive", name: "OneDrive", icon: Cloud, description: "Connect to Microsoft OneDrive" },
    { type: "box", name: "Box", icon: Package, description: "Connect to Box cloud storage" },
    { type: "email", name: "Email", icon: Mail, description: "Connect email accounts" },
    { type: "hubspot", name: "HubSpot", icon: Package, description: "Connect to HubSpot CRM" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground mt-1">Connect external services and cloud storage</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {availableIntegrations.map((integration) => {
            const Icon = integration.icon;
            const connected = integrations?.find((i) => i.type === integration.type);
            
            return (
              <Card key={integration.type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {integration.name}
                  </CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {connected ? (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      <span className="text-sm text-green-600">Connected</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not connected</span>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
