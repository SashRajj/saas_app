"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Play,
  Pause,
  Check,
  Volume2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Voice {
  id: string;
  name: string;
  gender: "male" | "female";
  style: string;
  description: string;
  previewUrl?: string;
}

const availableVoices: Voice[] = [
  {
    id: "rachel",
    name: "Rachel",
    gender: "female",
    style: "Friendly",
    description: "Warm and approachable, great for customer service",
  },
  {
    id: "james",
    name: "James",
    gender: "male",
    style: "Professional",
    description: "Clear and authoritative, ideal for business calls",
  },
  {
    id: "sofia",
    name: "Sofia",
    gender: "female",
    style: "Warm",
    description: "Gentle and reassuring, perfect for healthcare",
  },
  {
    id: "marcus",
    name: "Marcus",
    gender: "male",
    style: "Casual",
    description: "Relaxed and friendly, great for informal businesses",
  },
  {
    id: "emma",
    name: "Emma",
    gender: "female",
    style: "Energetic",
    description: "Upbeat and enthusiastic, perfect for sales",
  },
  {
    id: "david",
    name: "David",
    gender: "male",
    style: "Calm",
    description: "Soothing and patient, ideal for support lines",
  },
];

interface VoiceSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentVoiceId: string;
  onSelect: (voiceId: string) => void;
}

export function VoiceSelectorModal({
  open,
  onOpenChange,
  currentVoiceId,
  onSelect,
}: VoiceSelectorModalProps) {
  const [selectedVoice, setSelectedVoice] = useState(currentVoiceId);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handlePlayPreview = async (voiceId: string) => {
    if (playingVoice === voiceId) {
      // Stop playing
      setPlayingVoice(null);
      return;
    }

    setIsLoading(voiceId);
    // Simulate loading audio
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(null);
    setPlayingVoice(voiceId);

    // Simulate audio duration
    setTimeout(() => {
      setPlayingVoice(null);
    }, 3000);
  };

  const handleSave = () => {
    onSelect(selectedVoice);
    onOpenChange(false);
  };

  const selectedVoiceData = availableVoices.find((v) => v.id === selectedVoice);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            Choose AI Voice
          </DialogTitle>
          <DialogDescription>
            Select a voice for your AI to use when answering calls
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={selectedVoice}
          onValueChange={setSelectedVoice}
          className="space-y-3"
        >
          {availableVoices.map((voice) => (
            <div
              key={voice.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors",
                selectedVoice === voice.id
                  ? "border-primary bg-primary/5"
                  : "hover:border-muted-foreground/50"
              )}
              onClick={() => setSelectedVoice(voice.id)}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={voice.id} id={voice.id} />
                <Label htmlFor={voice.id} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{voice.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {voice.gender === "female" ? "Female" : "Male"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {voice.style}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {voice.description}
                  </p>
                </Label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPreview(voice.id);
                }}
                disabled={isLoading === voice.id}
              >
                {isLoading === voice.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : playingVoice === voice.id ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </RadioGroup>

        {/* Preview Message */}
        {playingVoice && (
          <div className="p-3 bg-muted rounded-lg animate-in fade-in">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex gap-1">
                <span className="w-1 h-4 bg-primary rounded-full animate-pulse" />
                <span className="w-1 h-4 bg-primary rounded-full animate-pulse delay-75" />
                <span className="w-1 h-4 bg-primary rounded-full animate-pulse delay-150" />
              </div>
              <span className="text-muted-foreground">
                Playing sample: &quot;Hi, thanks for calling! How can I help you today?&quot;
              </span>
            </div>
          </div>
        )}

        {/* Selected Voice Summary */}
        {selectedVoiceData && (
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm">
              <span className="font-medium">Selected:</span>{" "}
              {selectedVoiceData.name} ({selectedVoiceData.gender}, {selectedVoiceData.style})
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-1" />
            Save Voice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
