import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { 
  BarChart3, 
  FileText, 
  CheckSquare, 
  Cloud, 
  Mail, 
  AlertCircle,
  TrendingUp,
  Database,
  Zap
} from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Real-time data visualization and business intelligence dashboards"
    },
    {
      icon: CheckSquare,
      title: "Task Management",
      description: "Plan, track, and manage daily priorities with an intelligent planner"
    },
    {
      icon: TrendingUp,
      title: "Financial Oversight",
      description: "Automated accounting discrepancy detection and financial reports"
    },
    {
      icon: FileText,
      title: "Document Processing",
      description: "OCR scanning, text recognition, and intelligent document parsing"
    },
    {
      icon: Cloud,
      title: "Cloud Integration",
      description: "Seamless connectivity with OneDrive, Box, and cloud services"
    },
    {
      icon: Mail,
      title: "Communication Hub",
      description: "Email connector and HubSpot CRM integration"
    },
    {
      icon: Database,
      title: "Data Analysis",
      description: "Import, analyze, and visualize data from multiple sources"
    },
    {
      icon: AlertCircle,
      title: "Issue Tracking",
      description: "Comprehensive ticketing system for problem resolution"
    },
    {
      icon: Zap,
      title: "API & Automation",
      description: "Powerful API and MCP integration for workflow automation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
            <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
          </div>
          <Button asChild>
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold tracking-tight mb-6">
          Unified Enterprise Intelligence
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          A comprehensive system that consolidates operations, analytics, and communications into one intelligent workspace. 
          Transform complex workflows into an organized, data-driven environment for decision-makers.
        </p>
        <Button size="lg" asChild>
          <a href={getLoginUrl()}>Get Started</a>
        </Button>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Comprehensive ERP Features</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to Transform Your Operations?</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Join thousands of businesses streamlining their workflows with our intelligent ERP system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" variant="secondary" asChild>
              <a href={getLoginUrl()}>Start Free Trial</a>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 {APP_TITLE}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
