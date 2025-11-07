import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { File, Upload } from "lucide-react";
import { toast } from "sonner";

export default function Documents() {
  const { data: documents, isLoading } = trpc.documents.list.useQuery();

  const handleFileUpload = () => {
    toast.info("File upload feature coming soon");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground mt-1">Manage files with OCR and text recognition</p>
          </div>
          <Button onClick={handleFileUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading documents...</div>
        ) : documents && documents.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <File className="h-8 w-8 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.category || "Uncategorized"}</p>
                      {doc.ocrProcessed && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-2 inline-block">
                          OCR Processed
                        </span>
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
              <p className="text-muted-foreground">No documents yet. Upload your first document!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
