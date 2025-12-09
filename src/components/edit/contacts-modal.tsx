"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Upload,
  Plus,
  Search,
  Phone,
  Mail,
  Loader2,
  Check,
  X,
  FileSpreadsheet,
  UserPlus,
  Download,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  source: "import" | "call" | "text" | "manual";
  createdAt: string;
  optedOut?: boolean;
}

// Mock contacts
const mockContacts: Contact[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Martinez",
    phone: "+1 415-555-1234",
    email: "sarah.m@email.com",
    source: "call",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    firstName: "Mike",
    lastName: "Davis",
    phone: "+1 510-555-5678",
    email: "mike.d@email.com",
    source: "text",
    createdAt: "2024-01-09",
  },
  {
    id: "3",
    firstName: "John",
    lastName: "Smith",
    phone: "+1 628-555-9012",
    source: "call",
    createdAt: "2024-01-08",
  },
];

interface ContactsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactsModal({ open, onOpenChange }: ContactsModalProps) {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"list" | "import" | "add">("list");
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  // Add contact form state
  const [newContact, setNewContact] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const filteredContacts = contacts.filter(
    (c) =>
      c.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith(".csv") || file.name.endsWith(".xlsx"))) {
        await simulateImport();
      }
    },
    []
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await simulateImport();
    }
  };

  const simulateImport = async () => {
    setIsImporting(true);
    setImportProgress(0);

    // Simulate import progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setImportProgress(i);
    }

    // Add mock imported contacts
    const importedContacts: Contact[] = [
      {
        id: Math.random().toString(36).substr(2, 9),
        firstName: "Alice",
        lastName: "Johnson",
        phone: "+1 555-111-2222",
        email: "alice.j@email.com",
        source: "import",
        createdAt: new Date().toISOString().split("T")[0],
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        firstName: "Bob",
        lastName: "Williams",
        phone: "+1 555-333-4444",
        source: "import",
        createdAt: new Date().toISOString().split("T")[0],
      },
    ];

    setContacts((prev) => [...prev, ...importedContacts]);
    setIsImporting(false);
    setActiveTab("list");
  };

  const handleAddContact = () => {
    if (!newContact.firstName || !newContact.phone) return;

    const contact: Contact = {
      id: Math.random().toString(36).substr(2, 9),
      ...newContact,
      source: "manual",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setContacts((prev) => [contact, ...prev]);
    setNewContact({ firstName: "", lastName: "", phone: "", email: "" });
    setActiveTab("list");
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const getSourceBadge = (source: Contact["source"]) => {
    const variants: Record<Contact["source"], { label: string; className: string }> =
      {
        import: { label: "Imported", className: "bg-purple-100 text-purple-700" },
        call: { label: "From Call", className: "bg-green-100 text-green-700" },
        text: { label: "From Text", className: "bg-blue-100 text-blue-700" },
        manual: { label: "Manual", className: "bg-gray-100 text-gray-700" },
      };

    return (
      <Badge variant="secondary" className={cn("text-xs", variants[source].className)}>
        {variants[source].label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Contacts
          </DialogTitle>
          <DialogDescription>
            Manage your contact list for AI follow-ups and campaigns
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                All Contacts ({contacts.length})
              </TabsTrigger>
              <TabsTrigger value="import" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import
              </TabsTrigger>
              <TabsTrigger value="add" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add New
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="mt-4">
            {/* Search */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>

            {/* Contacts Table */}
            <ScrollArea className="h-[400px] border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          {searchQuery
                            ? "No contacts match your search"
                            : "No contacts yet"}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">
                          {contact.firstName} {contact.lastName}
                          {contact.optedOut && (
                            <Badge
                              variant="destructive"
                              className="ml-2 text-xs"
                            >
                              Opted Out
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {contact.phone}
                          </span>
                        </TableCell>
                        <TableCell>
                          {contact.email ? (
                            <span className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {contact.email}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              -
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{getSourceBadge(contact.source)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="import" className="mt-4">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50",
                isImporting && "pointer-events-none opacity-50"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleFileDrop}
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-10 w-10 mx-auto text-primary mb-3 animate-spin" />
                  <p className="font-medium mb-2">Importing contacts...</p>
                  <div className="w-48 mx-auto">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${importProgress}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="font-medium mb-1">
                    Drag & drop your file here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    CSV or Excel file with columns: First Name, Last Name,
                    Phone, Email (optional)
                  </p>
                  <Button variant="outline" asChild>
                    <label className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </Button>
                </>
              )}
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">
                    File Format Requirements
                  </p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>First row should contain column headers</li>
                    <li>
                      Required columns: First Name, Last Name, Phone Number
                    </li>
                    <li>Optional: Email address</li>
                    <li>Phone numbers should include country code</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="add" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    First Name *
                  </label>
                  <Input
                    placeholder="John"
                    value={newContact.firstName}
                    onChange={(e) =>
                      setNewContact((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Last Name
                  </label>
                  <Input
                    placeholder="Doe"
                    value={newContact.lastName}
                    onChange={(e) =>
                      setNewContact((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Phone Number *
                </label>
                <Input
                  placeholder="+1 555-123-4567"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Email (optional)
                </label>
                <Input
                  placeholder="john@example.com"
                  type="email"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <Button
                onClick={handleAddContact}
                disabled={!newContact.firstName || !newContact.phone}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            <Check className="h-4 w-4 mr-1" />
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
