"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { useUser } from "@clerk/nextjs";
import {
  CreditCard,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const planDetails = {
  trial: { name: "Trial", price: "$0", description: "7-day free trial" },
  text_ai: { name: "Text AI", price: "$49/mo", description: "SMS automation, follow-ups, drip campaigns" },
  voice_ai: { name: "Voice AI", price: "$75/mo", description: "AI calls, booking, transcripts" },
  full_ai: { name: "Full AI Employee", price: "$99/mo", description: "Everything included" },
};

export default function AccountPage() {
  const { organization } = useDashboard();
  const { user: clerkUser } = useUser();

  const plan = organization?.plan || "trial";
  const planInfo = planDetails[plan];

  // Mock data for demo - would come from API
  const mockBalance = 18.50;
  const mockUsage = { texts: 234, textsCost: 0.94, minutes: 89, minutesCost: 0.62 };
  const mockPhone = null; // Not assigned yet

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="text-muted-foreground">
          Manage your plan, balance, and settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Plan Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Your Plan
              {plan === "trial" && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Trial
                </Badge>
              )}
              {plan !== "trial" && (
                <Badge variant="default" className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Current subscription details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold">{planInfo.name}</p>
              <p className="text-muted-foreground">{planInfo.price}</p>
              <p className="text-sm text-muted-foreground mt-1">{planInfo.description}</p>
            </div>
            <Separator />
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {plan === "trial" ? (
                  <span>Trial ends in 7 days</span>
                ) : (
                  <span>Next billing: February 1, 2025</span>
                )}
              </div>
            </div>
            <Button variant="outline" className="w-full">
              {plan === "trial" ? "Choose Plan" : "Change Plan"}
            </Button>
          </CardContent>
        </Card>

        {/* Balance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Balance</CardTitle>
            <CardDescription>Prepaid balance for calls and texts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold">${mockBalance.toFixed(2)}</p>
              <p className="text-muted-foreground">current balance</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="auto-reload" defaultChecked />
              <Label htmlFor="auto-reload" className="text-sm">
                Auto-reload $25 when below $5
              </Label>
            </div>
            <Separator />
            <div className="text-sm text-muted-foreground space-y-1">
              <p>This month&apos;s usage:</p>
              <div className="flex justify-between">
                <span>{mockUsage.texts} texts</span>
                <span>${mockUsage.textsCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{mockUsage.minutes} min calls</span>
                <span>${mockUsage.minutesCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-foreground pt-1 border-t">
                <span>Total</span>
                <span>${(mockUsage.textsCost + mockUsage.minutesCost).toFixed(2)}</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Connected Accounts</CardTitle>
            <CardDescription>Your linked services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Google Account</p>
                  <p className="text-sm text-muted-foreground">
                    {clerkUser?.primaryEmailAddress?.emailAddress || "Not connected"}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Phone Number</p>
                  <p className="text-sm text-muted-foreground">
                    {mockPhone || "Not assigned"}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {mockPhone ? "Change" : "Get Number"}
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Google Calendar</p>
                  <p className="text-sm text-muted-foreground">
                    Sync appointments
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Controls</CardTitle>
            <CardDescription>Turn features on or off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Text Automation</p>
                <p className="text-sm text-muted-foreground">
                  Auto-texts and drip campaigns
                </p>
              </div>
              <Switch defaultChecked disabled={plan === "voice_ai"} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Voice AI</p>
                <p className="text-sm text-muted-foreground">
                  AI answers your calls
                </p>
              </div>
              <Switch defaultChecked disabled={plan === "text_ai"} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Business Hours</p>
                <p className="text-sm text-muted-foreground">
                  Mon-Fri, 9am - 5pm
                </p>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Information</CardTitle>
          <CardDescription>Your business details used by the AI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Business Name</Label>
              <p className="font-medium">{organization?.name || "Not set"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Industry</Label>
              <p className="font-medium">{organization?.industry || "Not set"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Timezone</Label>
              <p className="font-medium">{organization?.timezone || "America/New_York"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Owner</Label>
              <p className="font-medium">
                {clerkUser?.firstName} {clerkUser?.lastName}
              </p>
            </div>
          </div>
          <Button variant="outline" className="mt-4">
            Edit Business Info
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="font-medium">Cancel Subscription</p>
            <p className="text-sm text-muted-foreground">
              Your AI will stop working at the end of your billing period
            </p>
          </div>
          <Button variant="destructive" size="sm">
            Cancel Subscription
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
