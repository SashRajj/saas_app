import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { MessageSquare, Phone } from "lucide-react";

export default function InboxPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
        <p className="text-muted-foreground">
          All your conversations in one place
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Input placeholder="Search conversations..." className="max-w-sm" />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="calls">Calls</TabsTrigger>
          <TabsTrigger value="texts">Texts</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  When your AI handles calls and texts, they&apos;ll appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calls" className="mt-4">
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <Phone className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No calls yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Call transcripts and recordings will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="texts" className="mt-4">
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No texts yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Text conversations will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
