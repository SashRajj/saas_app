"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { KnowledgeUploadModal } from "@/components/edit/knowledge-upload-modal";
import { ContactsModal } from "@/components/edit/contacts-modal";
import {
  BookOpen,
  Users,
  Upload,
  FileText,
  Link,
  ChevronRight,
  Check,
  Globe,
  FileType,
} from "lucide-react";

export default function DataPage() {
  // Knowledge base state
  const [knowledgeFiles, setKnowledgeFiles] = useState<Array<{
    id: string;
    name: string;
    type: "pdf" | "url" | "text";
    status: "uploading" | "processing" | "ready" | "error";
  }>>([
    { id: "1", name: "Services & Pricing.pdf", type: "pdf", status: "ready" },
    { id: "2", name: "https://acmeplumbing.com/about", type: "url", status: "ready" },
  ]);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);

  // Contacts state
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [contactCount] = useState(156);

  const getTypeIcon = (type: "pdf" | "url" | "text") => {
    switch (type) {
      case "pdf":
        return <FileType className="h-4 w-4 text-red-500" />;
      case "url":
        return <Globe className="h-4 w-4 text-blue-500" />;
      case "text":
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Data</h1>
        <p className="text-muted-foreground">
          Upload knowledge and manage contacts for your AI
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Knowledge Base */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-purple-100">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Knowledge Base</CardTitle>
                <CardDescription>Teach your AI about your business</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {knowledgeFiles.length > 0 ? (
              <div className="space-y-2">
                {knowledgeFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                  >
                    {getTypeIcon(file.type)}
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      <Check className="h-3 w-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium">No knowledge uploaded yet</p>
                <p className="text-sm text-muted-foreground">
                  Upload documents to help your AI answer questions
                </p>
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => setShowKnowledgeModal(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Upload File
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowKnowledgeModal(true)}
              >
                <Link className="h-4 w-4 mr-2" />
                Add URL
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              PDF, TXT, DOCX, or paste a website URL
            </p>
          </CardContent>
        </Card>

        {/* Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-orange-100">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Contacts</CardTitle>
                <CardDescription>Import and manage your contact list</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <p className="text-4xl font-bold">{contactCount}</p>
              <p className="text-sm text-muted-foreground">total contacts</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowContactsModal(true)}
              >
                <span className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV / Excel
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowContactsModal(true)}
              >
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  View All Contacts
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Contacts are used for follow-up campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <KnowledgeUploadModal
        open={showKnowledgeModal}
        onOpenChange={setShowKnowledgeModal}
        existingFiles={knowledgeFiles}
        onUpload={setKnowledgeFiles}
      />

      <ContactsModal
        open={showContactsModal}
        onOpenChange={setShowContactsModal}
      />
    </div>
  );
}
