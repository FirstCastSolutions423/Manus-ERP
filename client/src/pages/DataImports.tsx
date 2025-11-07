import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function DataImports() {
  const { data: imports, isLoading } = trpc.dataImports.list.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Imports</h1>
          <p className="text-muted-foreground mt-1">Import and analyze data from various sources</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading imports...</div>
        ) : imports && imports.length > 0 ? (
          <div className="space-y-3">
            {imports.map((imp) => (
              <Card key={imp.id}>
                <CardContent className="p-4">
                  <p className="font-semibold">{imp.fileName}</p>
                  <p className="text-sm text-muted-foreground">{imp.type} - {imp.status}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No data imports yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
