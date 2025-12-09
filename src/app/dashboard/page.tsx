import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageSquare, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Calls",
    value: "0",
    icon: Phone,
    description: "this week",
  },
  {
    title: "Texts",
    value: "0",
    icon: MessageSquare,
    description: "this week",
  },
  {
    title: "Bookings",
    value: "0",
    icon: Calendar,
    description: "this week",
  },
  {
    title: "Usage",
    value: "$0.00",
    icon: DollarSign,
    description: "this week",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Your AI employee&apos;s performance this week
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/inbox">View All</Link>
          </Button>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No activity yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Once your AI starts handling calls and texts, you&apos;ll see all the activity here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
