"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Phone,
  MessageSquare,
  Send,
  Play,
  Square,
  User,
  Bot,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TestAIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scriptName: string;
  scriptType: "voice" | "text";
  scriptContent: string;
  testsRemaining: number;
  onTestUsed: () => void;
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

export function TestAIModal({
  open,
  onOpenChange,
  scriptName,
  scriptType,
  scriptContent,
  testsRemaining,
  onTestUsed,
}: TestAIModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [testStarted, setTestStarted] = useState(false);

  // Voice-specific state
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartTest = () => {
    if (testsRemaining <= 0) return;

    setTestStarted(true);
    setIsRunning(true);
    onTestUsed();

    // Simulate AI greeting based on script
    const greeting = processTemplate(scriptContent);
    setMessages([
      {
        id: "1",
        role: "ai",
        content: greeting,
      },
    ]);

    if (scriptType === "voice") {
      setIsPlaying(true);
      // Simulate voice playback
      setTimeout(() => setIsPlaying(false), 3000);
    }

    setIsRunning(false);
  };

  const handleSendMessage = () => {
    if (!userInput.trim() || isRunning) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");
    setIsRunning(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateMockResponse(userInput, scriptType);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: aiResponse,
        },
      ]);
      setIsRunning(false);
    }, 1500);
  };

  const processTemplate = (content: string) => {
    return content
      .replace(/\{\{first_name\}\}/g, "John")
      .replace(/\{\{business_name\}\}/g, "Acme Services")
      .replace(/\{\{date\}\}/g, "Tuesday, January 15th")
      .replace(/\{\{time\}\}/g, "2:00 PM");
  };

  const generateMockResponse = (input: string, type: "voice" | "text") => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("how much")) {
      return "Our pricing varies depending on the service. Would you like me to connect you with someone who can provide a detailed quote?";
    }
    if (lowerInput.includes("appointment") || lowerInput.includes("schedule") || lowerInput.includes("book")) {
      return "I'd be happy to help you schedule an appointment! What day and time works best for you?";
    }
    if (lowerInput.includes("hours") || lowerInput.includes("open")) {
      return "We're open Monday through Friday, 9 AM to 5 PM. Is there anything else I can help you with?";
    }
    if (lowerInput.includes("yes") || lowerInput.includes("sure")) {
      return "Perfect! Let me help you with that. Can you provide me with a few more details?";
    }
    if (lowerInput.includes("no") || lowerInput.includes("not")) {
      return "No problem at all! Is there anything else I can assist you with today?";
    }

    return type === "voice"
      ? "I understand. Let me see how I can best assist you with that. Could you tell me a bit more about what you're looking for?"
      : "Thanks for reaching out! How can I help you today?";
  };

  const handleClose = () => {
    setMessages([]);
    setTestStarted(false);
    setUserInput("");
    onOpenChange(false);
  };

  const handlePlayVoice = (content: string) => {
    setIsPlaying(true);
    // In production, this would use text-to-speech
    setTimeout(() => setIsPlaying(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {scriptType === "voice" ? (
              <Phone className="h-5 w-5 text-purple-600" />
            ) : (
              <MessageSquare className="h-5 w-5 text-blue-600" />
            )}
            Test AI: {scriptName}
          </DialogTitle>
          <DialogDescription>
            Preview how your AI will respond to customers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tests Remaining */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Tests remaining</span>
            </div>
            <Badge variant={testsRemaining > 5 ? "secondary" : "destructive"}>
              {testsRemaining}
            </Badge>
          </div>

          {!testStarted ? (
            /* Start Test Button */
            <div className="text-center py-8">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                {scriptType === "voice" ? (
                  <PhoneCall className="h-8 w-8 text-primary" />
                ) : (
                  <MessageSquare className="h-8 w-8 text-primary" />
                )}
              </div>
              <p className="text-muted-foreground mb-4">
                {scriptType === "voice"
                  ? "Simulate an incoming call to hear your AI"
                  : "Start a test conversation with your AI"}
              </p>
              <Button
                onClick={handleStartTest}
                disabled={testsRemaining <= 0}
                size="lg"
              >
                <Play className="h-4 w-4 mr-2" />
                {scriptType === "voice" ? "Start Call" : "Start Chat"}
              </Button>
              {testsRemaining <= 0 && (
                <p className="text-xs text-destructive mt-2">
                  No tests remaining. Tests cost ~$0.02 each after free tier.
                </p>
              )}
            </div>
          ) : (
            /* Chat Interface */
            <div className="space-y-4">
              <ScrollArea className="h-[300px] border rounded-lg p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
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
                        {scriptType === "voice" && message.role === "ai" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-6 text-xs"
                            onClick={() => handlePlayVoice(message.content)}
                            disabled={isPlaying}
                          >
                            {isPlaying ? (
                              <Square className="h-3 w-3 mr-1" />
                            ) : (
                              <Play className="h-3 w-3 mr-1" />
                            )}
                            {isPlaying ? "Playing..." : "Play audio"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {isRunning && (
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

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder={
                    scriptType === "voice"
                      ? "Speak as a customer..."
                      : "Type a message..."
                  }
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isRunning}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isRunning}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {testStarted ? "End Test" : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
