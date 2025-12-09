"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  Loader2,
  Check,
  RefreshCw,
  Sparkles,
  Lightbulb,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ScriptEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scriptTitle: string;
  scriptType: string;
  currentScript: string;
  onSave: (newScript: string) => void;
  freeEditsRemaining: number;
  freeRegensRemaining: number;
}

const suggestions = [
  "Make it more friendly",
  "Make it shorter",
  "Add urgency",
  "Make it more professional",
  "Mention 24/7 availability",
];

export function ScriptEditModal({
  open,
  onOpenChange,
  scriptTitle,
  scriptType,
  currentScript,
  onSave,
  freeEditsRemaining,
  freeRegensRemaining,
}: ScriptEditModalProps) {
  const [script, setScript] = useState(currentScript);
  const [pendingScript, setPendingScript] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setScript(currentScript);
      setPendingScript(null);
      setMessages([]);
      setInputValue("");
      setIsManualEdit(false);
    }
  }, [open, currentScript]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (in production, this would call the API)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate a mock improved script based on the request
    let newScript = script;
    if (message.toLowerCase().includes("friendly")) {
      newScript = script.replace(/Hi,/, "Hey there!").replace(/Hello,/, "Hi there!");
    } else if (message.toLowerCase().includes("shorter")) {
      newScript = script.split(".").slice(0, 2).join(".") + ".";
    } else if (message.toLowerCase().includes("professional")) {
      newScript = script.replace(/Hey/, "Hello").replace(/thanks/, "thank you");
    } else if (message.toLowerCase().includes("24/7")) {
      newScript = script + " We're available 24/7 for emergencies!";
    } else {
      // Generic improvement
      newScript = script + " How can I assist you today?";
    }

    const assistantMessage: Message = {
      role: "assistant",
      content: `Here's an updated version:\n\n"${newScript}"\n\nWould you like me to make any other changes?`,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setPendingScript(newScript);
    setIsLoading(false);
  };

  const handleRegenerate = async () => {
    if (isLoading || freeRegensRemaining <= 0) return;

    setIsLoading(true);

    // Simulate regeneration
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const variations = [
      `Hello! Thank you for reaching out. ${script.split(".").slice(1).join(".")}`,
      `Hi there! ${script} We're happy to help!`,
      `Welcome! ${script.replace("How can I help", "What can I do for")}`,
    ];

    const newScript = variations[Math.floor(Math.random() * variations.length)];

    const assistantMessage: Message = {
      role: "assistant",
      content: `Here's another version:\n\n"${newScript}"\n\nWould you like to try again or make specific changes?`,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setPendingScript(newScript);
    setIsLoading(false);
  };

  const handleAcceptChanges = () => {
    if (pendingScript) {
      setScript(pendingScript);
      setPendingScript(null);
    }
  };

  const handleSave = () => {
    onSave(isManualEdit ? script : pendingScript || script);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Edit: {scriptTitle}
          </DialogTitle>
          <DialogDescription>
            Chat with AI to refine your {scriptType} script, or edit manually
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Current Script */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Current Script</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsManualEdit(!isManualEdit)}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                {isManualEdit ? "Use AI" : "Edit Manually"}
              </Button>
            </div>
            {isManualEdit ? (
              <Textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="min-h-[100px] resize-none"
                placeholder="Enter your script..."
              />
            ) : (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm italic">&quot;{pendingScript || script}&quot;</p>
              </div>
            )}
            {pendingScript && !isManualEdit && (
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAcceptChanges}>
                  <Check className="h-4 w-4 mr-1" />
                  Accept Changes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPendingScript(null)}
                >
                  Revert
                </Button>
              </div>
            )}
          </div>

          {!isManualEdit && (
            <>
              <Separator />

              {/* Quick Suggestions */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Quick suggestions</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <Badge
                      key={suggestion}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => handleSendMessage(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Chat Messages */}
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-[200px] pr-4" ref={scrollRef}>
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                      <p>Ask AI to modify your script...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex",
                            message.role === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[85%] rounded-lg px-4 py-2",
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg px-4 py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Describe how you want to change the script..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(inputValue);
                    }
                  }}
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRegenerate}
                  disabled={isLoading || freeRegensRemaining <= 0}
                  title="Generate a new variation"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">{freeEditsRemaining}</span> edits &bull;{" "}
              <span className="font-medium">{freeRegensRemaining}</span> regenerations remaining
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Check className="h-4 w-4 mr-1" />
                Save Script
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
