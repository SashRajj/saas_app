"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pencil,
  Play,
  Send,
  Volume2,
  Square,
  User,
  Bot,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "edit" | "test";

interface ScriptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scriptName: string;
  scriptType: "voice" | "text";
  currentScript: string;
  onSave: (newScript: string) => void;
  editsRemaining: number;
  voicePlaysRemaining: number;
  onEditUsed: () => void;
  onVoicePlayUsed: () => void;
  isVoicePlan: boolean;
  initialMode?: Mode;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

const QUICK_SUGGESTIONS = [
  "Make it more friendly",
  "Make it shorter",
  "Add urgency",
  "Make it more professional",
  "Mention 24/7 availability",
];

export function ScriptModal({
  open,
  onOpenChange,
  scriptName,
  scriptType,
  currentScript,
  onSave,
  editsRemaining,
  voicePlaysRemaining,
  onEditUsed,
  onVoicePlayUsed,
  isVoicePlan,
  initialMode = "edit",
}: ScriptModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [editedScript, setEditedScript] = useState(currentScript);
  const [editInput, setEditInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isManualEdit, setIsManualEdit] = useState(false);

  // Test mode state
  const [testMessages, setTestMessages] = useState<Message[]>([]);
  const [testInput, setTestInput] = useState("");
  const [testStarted, setTestStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAIEdit = async (suggestion?: string) => {
    const prompt = suggestion || editInput;
    if (!prompt.trim() || isProcessing || editsRemaining <= 0) return;

    setIsProcessing(true);
    onEditUsed();

    // Simulate AI edit (in production, this calls OpenAI)
    setTimeout(() => {
      const newScript = simulateAIEdit(editedScript, prompt);
      setEditedScript(newScript);
      setEditInput("");
      setIsProcessing(false);
    }, 1500);
  };

  const simulateAIEdit = (script: string, instruction: string): string => {
    const lower = instruction.toLowerCase();

    if (lower.includes("friendly") || lower.includes("warm")) {
      return script.replace(/^Hi,?/, "Hey there!").replace(/\.$/, "! 😊");
    }
    if (lower.includes("shorter")) {
      return script.split(".").slice(0, 2).join(".") + ".";
    }
    if (lower.includes("professional")) {
      return script.replace(/Hey|Hi there/, "Good day").replace(/!+/g, ".");
    }
    if (lower.includes("urgency")) {
      return script + " Don't miss out - limited availability!";
    }
    if (lower.includes("24/7")) {
      return script + " We're available 24/7 to assist you.";
    }
    return script + " [AI would modify based on: " + instruction + "]";
  };

  const handleStartTest = () => {
    setTestStarted(true);
    const greeting = processTemplate(editedScript);
    setTestMessages([
      {
        id: "1",
        role: "ai",
        content: greeting,
      },
    ]);
  };

  const handleSendTestMessage = () => {
    if (!testInput.trim() || isProcessing) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: testInput,
    };

    setTestMessages((prev) => [...prev, newUserMessage]);
    setTestInput("");
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateMockResponse(testInput);
      setTestMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: aiResponse,
        },
      ]);
      setIsProcessing(false);
    }, 1000);
  };

  const processTemplate = (content: string) => {
    return content
      .replace(/\{\{first_name\}\}/g, "John")
      .replace(/\{\{business_name\}\}/g, "Acme Services")
      .replace(/\{\{date\}\}/g, "Tuesday, January 15th")
      .replace(/\{\{time\}\}/g, "2:00 PM");
  };

  const generateMockResponse = (input: string) => {
    const lower = input.toLowerCase();
    if (lower.includes("price") || lower.includes("cost")) {
      return "Our pricing varies by service. Would you like me to connect you with someone for a detailed quote?";
    }
    if (lower.includes("appointment") || lower.includes("book") || lower.includes("schedule")) {
      return "I'd be happy to help you schedule! What day and time works best for you?";
    }
    if (lower.includes("hours") || lower.includes("open")) {
      return "We're open Monday through Friday, 9 AM to 5 PM. Can I help with anything else?";
    }
    if (lower.includes("yes") || lower.includes("sure")) {
      return "Perfect! Let me help you with that. Could you provide a few more details?";
    }
    return "I understand. How can I best assist you with that today?";
  };

  const handlePlayVoice = () => {
    if (voicePlaysRemaining <= 0 || isPlaying) return;
    setIsPlaying(true);
    onVoicePlayUsed();
    // Simulate TTS playback
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const handleSave = () => {
    onSave(editedScript);
    onOpenChange(false);
  };

  const handleClose = () => {
    setMode("edit");
    setTestStarted(false);
    setTestMessages([]);
    setEditedScript(currentScript);
    setIsManualEdit(false);
    onOpenChange(false);
  };

  const resetTest = () => {
    setTestStarted(false);
    setTestMessages([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{scriptName}</DialogTitle>
          <DialogDescription>
            {mode === "edit" ? "Refine your script with AI or edit manually" : "Test how your AI responds"}
          </DialogDescription>
        </DialogHeader>

        {/* Mode Toggle */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant={mode === "edit" ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setMode("edit")}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Script
          </Button>
          <Button
            variant={mode === "test" ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => { setMode("test"); resetTest(); }}
          >
            <Play className="h-4 w-4 mr-2" />
            Test AI
          </Button>
        </div>

        {mode === "edit" ? (
          /* Edit Mode */
          <div className="space-y-4">
            {/* Current Script Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Current Script</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsManualEdit(!isManualEdit)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  {isManualEdit ? "Done" : "Edit Manually"}
                </Button>
              </div>
              {isManualEdit ? (
                <Textarea
                  value={editedScript}
                  onChange={(e) => setEditedScript(e.target.value)}
                  rows={4}
                  className="font-mono text-sm"
                />
              ) : (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm italic">"{editedScript}"</p>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Quick suggestions</Label>
              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleAIEdit(suggestion)}
                    disabled={isProcessing || editsRemaining <= 0}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* AI Edit Input */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask AI to modify your script..."
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAIEdit();
                    }
                  }}
                  disabled={isProcessing || editsRemaining <= 0}
                />
                <Button
                  onClick={() => handleAIEdit()}
                  disabled={!editInput.trim() || isProcessing || editsRemaining <= 0}
                  size="icon"
                >
                  {isProcessing ? (
                    <RotateCcw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                {editsRemaining} edits remaining
              </span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Script
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Test Mode */
          <div className="space-y-4">
            {!testStarted ? (
              <div className="text-center py-8">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Simulate a {scriptType === "voice" ? "call" : "text conversation"} with your AI
                </p>
                <Button onClick={handleStartTest} size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Start Test
                </Button>
              </div>
            ) : (
              <>
                {/* Chat Interface */}
                <ScrollArea className="h-[280px] border rounded-lg p-4">
                  <div className="space-y-4">
                    {testMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3",
                          message.role === "user" ? "flex-row-reverse" : ""
                        )}
                      >
                        <div
                          className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-purple-100"
                          )}
                        >
                          {message.role === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                        <div
                          className={cn(
                            "rounded-lg p-3 max-w-[80%]",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          {scriptType === "voice" && message.role === "ai" && isVoicePlan && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 h-6 text-xs"
                              onClick={handlePlayVoice}
                              disabled={isPlaying || voicePlaysRemaining <= 0}
                            >
                              {isPlaying ? (
                                <Square className="h-3 w-3 mr-1" />
                              ) : (
                                <Volume2 className="h-3 w-3 mr-1" />
                              )}
                              {isPlaying ? "Playing..." : `Play (${voicePlaysRemaining} left)`}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {isProcessing && (
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex gap-1">
                            <span className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Test Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder={scriptType === "voice" ? "Speak as a caller..." : "Type a message..."}
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendTestMessage();
                      }
                    }}
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={handleSendTestMessage}
                    disabled={!testInput.trim() || isProcessing}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Test Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <Button variant="ghost" size="sm" onClick={resetTest}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button variant="outline" onClick={handleClose}>
                    Done
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
