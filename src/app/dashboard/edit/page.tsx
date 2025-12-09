import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MessageSquare, BookOpen, Users } from "lucide-react";

export default function EditAIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Your AI</h1>
        <p className="text-muted-foreground">
          Customize how your AI handles calls and texts
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              <CardTitle className="text-lg">Voice AI</CardTitle>
            </div>
            <CardDescription>Customize how your AI answers calls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Current Greeting:</p>
              <p className="italic">&quot;Hi, thanks for calling! I&apos;m your AI assistant. How can I help you today?&quot;</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm">Change Voice</Button>
              <Button variant="outline" size="sm">Preview</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <CardTitle className="text-lg">Text AI</CardTitle>
            </div>
            <CardDescription>Customize your automated text messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Missed Call Text:</p>
              <p className="italic">&quot;Hi! Sorry we missed your call. How can we help you?&quot;</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm">Preview Drip</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <CardTitle className="text-lg">Knowledge Base</CardTitle>
            </div>
            <CardDescription>Help your AI learn about your business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>No documents uploaded yet</p>
            </div>
            <Button variant="outline" size="sm">+ Add Document</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle className="text-lg">Contacts</CardTitle>
            </div>
            <CardDescription>Manage your contact list</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>0 contacts</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">+ Import</Button>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground border-t pt-4">
        Free edits: 50/50 remaining | Regenerations: 10/10 remaining
      </div>
    </div>
  );
}
