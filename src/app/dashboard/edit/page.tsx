"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { ScriptModal } from "@/components/edit/script-modal";
import { VoiceSelectorModal } from "@/components/edit/voice-selector-modal";
import {
  Mic,
  MessageSquare,
  Play,
  Pencil,
  Trash2,
  Plus,
  Sparkles,
  Phone,
  Clock,
  PhoneIncoming,
  PhoneOutgoing,
  Calendar,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ScriptType = "voice" | "text";
type ScriptDirection = "inbound" | "outbound";
type ScriptCategory = "event" | "proactive";

interface ScheduleSettings {
  enabled: boolean;
  days: string[];
  startTime: string;
  endTime: string;
  maxPerDay: number;
}

interface Script {
  id: string;
  name: string;
  trigger: string;
  type: ScriptType;
  direction: ScriptDirection;
  category: ScriptCategory;
  content: string;
  enabled: boolean;
  schedule?: ScheduleSettings;
}

// Pre-made scripts for all categories
const defaultScripts: Script[] = [
  // Voice Inbound (Event-triggered)
  {
    id: "voice-inbound-greeting",
    name: "Greeting",
    trigger: "When someone calls (during hours)",
    type: "voice",
    direction: "inbound",
    category: "event",
    content: "Hi, thanks for calling! I'm your AI assistant. How can I help you today?",
    enabled: true,
  },
  {
    id: "voice-inbound-afterhours",
    name: "After Hours",
    trigger: "When someone calls (after hours)",
    type: "voice",
    direction: "inbound",
    category: "event",
    content: "Thanks for calling! We're currently closed. Our hours are Monday-Friday, 9am-5pm. Would you like to leave a message?",
    enabled: true,
  },
  // Voice Outbound (Event-triggered)
  {
    id: "voice-outbound-reminder",
    name: "Appointment Reminder",
    trigger: "1 day before appointment",
    type: "voice",
    direction: "outbound",
    category: "event",
    content: "Hi {{first_name}}, this is a reminder about your appointment tomorrow at {{time}}. Please call us back if you need to reschedule.",
    enabled: true,
  },
  {
    id: "voice-outbound-followup",
    name: "Follow-up Call",
    trigger: "3 days after inquiry",
    type: "voice",
    direction: "outbound",
    category: "event",
    content: "Hi {{first_name}}, I'm calling from {{business_name}} to follow up on your recent inquiry. Do you have a moment to chat?",
    enabled: false,
  },
  // Voice Outbound (Proactive - Cold Call)
  {
    id: "voice-outbound-coldcall",
    name: "Cold Call",
    trigger: "Scheduled outreach",
    type: "voice",
    direction: "outbound",
    category: "proactive",
    content: "Hi {{first_name}}, this is {{business_name}} calling. We help businesses like yours with [your service]. Do you have a moment to hear about how we can help?",
    enabled: false,
    schedule: {
      enabled: false,
      days: ["mon", "tue", "wed", "thu", "fri"],
      startTime: "09:00",
      endTime: "17:00",
      maxPerDay: 50,
    },
  },
  // Text Inbound (Event-triggered)
  {
    id: "text-inbound-autoreply",
    name: "Auto-Reply",
    trigger: "When someone texts (during hours)",
    type: "text",
    direction: "inbound",
    category: "event",
    content: "Hi! Thanks for texting. How can we help you today?",
    enabled: true,
  },
  {
    id: "text-inbound-afterhours",
    name: "After Hours Reply",
    trigger: "When someone texts (after hours)",
    type: "text",
    direction: "inbound",
    category: "event",
    content: "Thanks for reaching out! We're currently closed but will respond first thing tomorrow.",
    enabled: true,
  },
  // Text Outbound (Event-triggered)
  {
    id: "text-outbound-missedcall",
    name: "Missed Call Text",
    trigger: "2 min after missed call",
    type: "text",
    direction: "outbound",
    category: "event",
    content: "Hi! Sorry we missed your call. How can we help you?",
    enabled: true,
  },
  {
    id: "text-outbound-confirm",
    name: "Appointment Confirmation",
    trigger: "After booking",
    type: "text",
    direction: "outbound",
    category: "event",
    content: "Your appointment is confirmed for {{date}} at {{time}}. Reply to reschedule.",
    enabled: true,
  },
  {
    id: "text-outbound-followup",
    name: "Follow-up Message",
    trigger: "7 days after inquiry",
    type: "text",
    direction: "outbound",
    category: "event",
    content: "Hi {{first_name}}, just checking in to see if you still need help with your inquiry. Let us know!",
    enabled: false,
  },
  // Text Outbound (Proactive - Cold Message)
  {
    id: "text-outbound-coldmessage",
    name: "Cold Message",
    trigger: "Scheduled outreach",
    type: "text",
    direction: "outbound",
    category: "proactive",
    content: "Hi {{first_name}}, I'm reaching out from {{business_name}}. We specialize in [your service] and thought we could help your business. Interested in learning more?",
    enabled: false,
    schedule: {
      enabled: false,
      days: ["mon", "tue", "wed", "thu", "fri"],
      startTime: "10:00",
      endTime: "18:00",
      maxPerDay: 100,
    },
  },
];

const DAYS = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
];

export default function EditAIPage() {
  const { organization } = useDashboard();

  // Filter state
  const [typeFilter, setTypeFilter] = useState<"all" | ScriptType>("all");
  const [directionFilter, setDirectionFilter] = useState<"all" | ScriptDirection>("all");

  // Scripts state
  const [scripts, setScripts] = useState<Script[]>(defaultScripts);
  const [activeScript, setActiveScript] = useState<Script | null>(null);
  const [modalMode, setModalMode] = useState<"edit" | "test">("edit");
  const [schedulingScript, setSchedulingScript] = useState<Script | null>(null);

  // Create new script modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newScriptName, setNewScriptName] = useState("");
  const [newScriptType, setNewScriptType] = useState<ScriptType>("text");
  const [newScriptDirection, setNewScriptDirection] = useState<ScriptDirection>("outbound");
  const [newScriptCategory, setNewScriptCategory] = useState<ScriptCategory>("event");
  const [newScriptContent, setNewScriptContent] = useState("");

  // Voice state
  const [selectedVoice, setSelectedVoice] = useState("rachel");
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Free tier usage (100 edits/month, 50 voice plays/month for voice/full plans)
  const [editsRemaining, setEditsRemaining] = useState(100);
  const [voicePlaysRemaining, setVoicePlaysRemaining] = useState(50);

  // Determine if user has voice plan (voice_ai or full_ai plan)
  const isVoicePlan = organization?.plan === "voice_ai" || organization?.plan === "full_ai";

  // Filter scripts
  const filteredScripts = scripts.filter((script) => {
    const typeMatch = typeFilter === "all" || script.type === typeFilter;
    const directionMatch = directionFilter === "all" || script.direction === directionFilter;
    return typeMatch && directionMatch;
  });

  const handleSaveScript = (newContent: string) => {
    if (activeScript) {
      setScripts((prev) =>
        prev.map((s) => (s.id === activeScript.id ? { ...s, content: newContent } : s))
      );
    }
    setActiveScript(null);
  };

  const handleEditUsed = () => {
    if (editsRemaining > 0) {
      setEditsRemaining((prev) => prev - 1);
    }
  };

  const handleVoicePlayUsed = () => {
    if (voicePlaysRemaining > 0) {
      setVoicePlaysRemaining((prev) => prev - 1);
    }
  };

  const handleDeleteScript = (id: string) => {
    setScripts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleScript = (id: string) => {
    setScripts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleSaveSchedule = (schedule: ScheduleSettings) => {
    if (schedulingScript) {
      setScripts((prev) =>
        prev.map((s) =>
          s.id === schedulingScript.id ? { ...s, schedule } : s
        )
      );
    }
    setSchedulingScript(null);
  };

  const handleCreateScript = () => {
    if (!newScriptName.trim()) return;

    const newScript: Script = {
      id: Date.now().toString(),
      name: newScriptName,
      trigger: newScriptCategory === "proactive" ? "Scheduled outreach" : "Custom trigger",
      type: newScriptType,
      direction: newScriptDirection,
      category: newScriptCategory,
      content: newScriptContent || "Enter your script content here...",
      enabled: true,
      ...(newScriptCategory === "proactive" && {
        schedule: {
          enabled: false,
          days: ["mon", "tue", "wed", "thu", "fri"],
          startTime: "09:00",
          endTime: "17:00",
          maxPerDay: newScriptType === "text" ? 100 : 50,
        },
      }),
    };

    setScripts((prev) => [...prev, newScript]);
    setShowCreateModal(false);
    resetCreateForm();

    // Open edit modal for the new script
    setModalMode("edit");
    setActiveScript(newScript);
  };

  const resetCreateForm = () => {
    setNewScriptName("");
    setNewScriptType("text");
    setNewScriptDirection("outbound");
    setNewScriptCategory("event");
    setNewScriptContent("");
  };

  const openCreateModal = () => {
    // Auto-generate a name
    const count = scripts.length + 1;
    setNewScriptName(`Custom Script ${count}`);
    setShowCreateModal(true);
  };

  const voiceData: Record<string, { name: string; description: string }> = {
    rachel: { name: "Rachel", description: "Friendly & warm" },
    james: { name: "James", description: "Professional" },
    sofia: { name: "Sofia", description: "Warm & inviting" },
    marcus: { name: "Marcus", description: "Casual & relaxed" },
    emma: { name: "Emma", description: "Energetic" },
    david: { name: "David", description: "Calm & reassuring" },
  };

  const currentVoice = voiceData[selectedVoice];

  const getScriptIcon = (type: ScriptType, direction: ScriptDirection) => {
    if (type === "voice") {
      return direction === "inbound" ? (
        <PhoneIncoming className="h-4 w-4 text-green-600" />
      ) : (
        <PhoneOutgoing className="h-4 w-4 text-blue-600" />
      );
    }
    return direction === "inbound" ? (
      <MessageSquare className="h-4 w-4 text-green-600" />
    ) : (
      <MessageSquare className="h-4 w-4 text-blue-600" />
    );
  };

  const getDirectionBadge = (direction: ScriptDirection) => {
    return (
      <Badge
        variant="outline"
        className={cn(
          "text-xs",
          direction === "inbound"
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-blue-200 bg-blue-50 text-blue-700"
        )}
      >
        {direction === "inbound" ? "Inbound" : "Outbound"}
      </Badge>
    );
  };

  const getCategoryBadge = (category: ScriptCategory) => {
    if (category === "proactive") {
      return (
        <Badge variant="outline" className="text-xs border-purple-200 bg-purple-50 text-purple-700">
          <Calendar className="h-3 w-3 mr-1" />
          Scheduled
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit AI</h1>
          <p className="text-sm text-muted-foreground">
            Customize your AI scripts and voice
          </p>
        </div>
        <Button onClick={openCreateModal} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Script
        </Button>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-4">
            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Type:</Label>
              <div className="flex gap-1">
                {(["all", "voice", "text"] as const).map((type) => (
                  <Button
                    key={type}
                    variant={typeFilter === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTypeFilter(type)}
                    className="h-7 px-2 text-xs"
                  >
                    {type === "all" ? "All" : type === "voice" ? (
                      <><Phone className="h-3 w-3 mr-1" /> Voice</>
                    ) : (
                      <><MessageSquare className="h-3 w-3 mr-1" /> Text</>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Direction Filter */}
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">Direction:</Label>
              <div className="flex gap-1">
                {(["all", "inbound", "outbound"] as const).map((direction) => (
                  <Button
                    key={direction}
                    variant={directionFilter === direction ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDirectionFilter(direction)}
                    className="h-7 px-2 text-xs"
                  >
                    {direction === "all" ? "All" : direction === "inbound" ? (
                      <><PhoneIncoming className="h-3 w-3 mr-1" /> In</>
                    ) : (
                      <><PhoneOutgoing className="h-3 w-3 mr-1" /> Out</>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scripts List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Scripts ({filteredScripts.length})
          </CardTitle>
          <CardDescription>
            {typeFilter === "all" && directionFilter === "all"
              ? "All scripts"
              : `Showing ${typeFilter !== "all" ? typeFilter : ""} ${directionFilter !== "all" ? directionFilter : ""} scripts`.trim()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredScripts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No scripts match your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredScripts.map((script) => (
                <div
                  key={script.id}
                  className={cn(
                    "flex items-center gap-4 p-4 border rounded-lg transition-colors",
                    script.enabled ? "hover:bg-muted/50" : "opacity-60 bg-muted/30"
                  )}
                >
                  <Switch
                    checked={script.enabled}
                    onCheckedChange={() => handleToggleScript(script.id)}
                  />
                  <div className="flex items-center gap-2">
                    {getScriptIcon(script.type, script.direction)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{script.name}</p>
                      {getDirectionBadge(script.direction)}
                      {getCategoryBadge(script.category)}
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {script.trigger}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {script.content}
                    </p>
                    {script.category === "proactive" && script.schedule && (
                      <p className="text-xs text-purple-600 mt-1">
                        {script.schedule.enabled
                          ? `Runs ${script.schedule.days.join(", ")} ${script.schedule.startTime}-${script.schedule.endTime}, max ${script.schedule.maxPerDay}/day`
                          : "Schedule not configured"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Test AI"
                      onClick={() => {
                        setModalMode("test");
                        setActiveScript(script);
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Edit Script"
                      onClick={() => {
                        setModalMode("edit");
                        setActiveScript(script);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {script.category === "proactive" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Schedule Settings"
                        onClick={() => setSchedulingScript(script)}
                      >
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      title="Delete Script"
                      onClick={() => handleDeleteScript(script.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Selection & Monthly Usage - Combined Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Voice Selection */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Mic className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">{currentVoice.name}</p>
                  <p className="text-xs text-muted-foreground">{currentVoice.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <Play className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => setShowVoiceModal(true)}>
                  Change
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Usage */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <div className="flex items-center gap-3 text-xs">
                  <span>{editsRemaining} edits</span>
                  {isVoicePlan && <span>• {voicePlaysRemaining} voice plays</span>}
                </div>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                Unlimited testing
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Script Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Script</DialogTitle>
            <DialogDescription>
              Set up a new script for your AI to use
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="script-name">Script Name</Label>
              <Input
                id="script-name"
                value={newScriptName}
                onChange={(e) => setNewScriptName(e.target.value)}
                placeholder="Enter script name..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newScriptType} onValueChange={(v) => setNewScriptType(v as ScriptType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voice">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Voice (Calls)
                      </div>
                    </SelectItem>
                    <SelectItem value="text">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Text (SMS)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Direction</Label>
                <Select value={newScriptDirection} onValueChange={(v) => setNewScriptDirection(v as ScriptDirection)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">
                      <div className="flex items-center gap-2">
                        <PhoneIncoming className="h-4 w-4" />
                        Inbound
                      </div>
                    </SelectItem>
                    <SelectItem value="outbound">
                      <div className="flex items-center gap-2">
                        <PhoneOutgoing className="h-4 w-4" />
                        Outbound
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Script Category</Label>
              <Select value={newScriptCategory} onValueChange={(v) => setNewScriptCategory(v as ScriptCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Event-triggered (responds to actions)
                    </div>
                  </SelectItem>
                  <SelectItem value="proactive">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Scheduled outreach (cold call/message)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {newScriptCategory === "event"
                  ? "Runs automatically when specific events happen"
                  : "Runs on a schedule you define (time window, max per day)"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="script-content">Script Content (optional)</Label>
              <Textarea
                id="script-content"
                value={newScriptContent}
                onChange={(e) => setNewScriptContent(e.target.value)}
                placeholder="Start typing or leave blank to use AI suggestions..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Tip: Use {"{{first_name}}"}, {"{{business_name}}"}, {"{{date}}"}, {"{{time}}"} for dynamic content
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateScript} disabled={!newScriptName.trim()}>
              Create Script
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Settings Modal */}
      {schedulingScript && schedulingScript.schedule && (
        <ScheduleSettingsModal
          open={true}
          onOpenChange={(open) => {
            if (!open) setSchedulingScript(null);
          }}
          scriptName={schedulingScript.name}
          scriptType={schedulingScript.type}
          schedule={schedulingScript.schedule}
          onSave={handleSaveSchedule}
        />
      )}

      {/* Unified Edit/Test Script Modal */}
      {activeScript && (
        <ScriptModal
          open={true}
          onOpenChange={(open: boolean) => {
            if (!open) setActiveScript(null);
          }}
          scriptName={activeScript.name}
          scriptType={activeScript.type}
          currentScript={activeScript.content}
          onSave={handleSaveScript}
          editsRemaining={editsRemaining}
          voicePlaysRemaining={voicePlaysRemaining}
          onEditUsed={handleEditUsed}
          onVoicePlayUsed={handleVoicePlayUsed}
          isVoicePlan={isVoicePlan}
          initialMode={modalMode}
        />
      )}

      <VoiceSelectorModal
        open={showVoiceModal}
        onOpenChange={setShowVoiceModal}
        currentVoiceId={selectedVoice}
        onSelect={setSelectedVoice}
      />
    </div>
  );
}

// Schedule Settings Modal Component
function ScheduleSettingsModal({
  open,
  onOpenChange,
  scriptName,
  scriptType,
  schedule,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scriptName: string;
  scriptType: ScriptType;
  schedule: ScheduleSettings;
  onSave: (schedule: ScheduleSettings) => void;
}) {
  const [localSchedule, setLocalSchedule] = useState<ScheduleSettings>(schedule);

  const toggleDay = (day: string) => {
    setLocalSchedule((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSave = () => {
    onSave(localSchedule);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Schedule: {scriptName}
          </DialogTitle>
          <DialogDescription>
            Configure when your {scriptType === "voice" ? "cold calls" : "cold messages"} are sent
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Enable Schedule */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Schedule</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, outreach runs automatically
              </p>
            </div>
            <Switch
              checked={localSchedule.enabled}
              onCheckedChange={(checked) =>
                setLocalSchedule((prev) => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          <Separator />

          {/* Days Selection */}
          <div className="space-y-2">
            <Label>Days</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <Button
                  key={day.value}
                  variant={localSchedule.days.includes(day.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDay(day.value)}
                >
                  {day.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Time Window */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={localSchedule.startTime}
                onChange={(e) =>
                  setLocalSchedule((prev) => ({ ...prev, startTime: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={localSchedule.endTime}
                onChange={(e) =>
                  setLocalSchedule((prev) => ({ ...prev, endTime: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Max Per Day */}
          <div className="space-y-2">
            <Label htmlFor="max-per-day">
              Max {scriptType === "voice" ? "Calls" : "Messages"} Per Day
            </Label>
            <Input
              id="max-per-day"
              type="number"
              min={1}
              max={scriptType === "voice" ? 200 : 500}
              value={localSchedule.maxPerDay}
              onChange={(e) =>
                setLocalSchedule((prev) => ({
                  ...prev,
                  maxPerDay: parseInt(e.target.value) || 1,
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              {scriptType === "voice"
                ? "Recommended: 50-100 calls per day"
                : "Recommended: 100-200 messages per day"}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
