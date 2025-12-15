import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const plans = [
  {
    name: "Text AI",
    price: "$49",
    description: "SMS automation for businesses that want to capture every lead",
    features: [
      { name: "Missed call auto-text", included: true },
      { name: "Drip follow-up campaigns (Day 1, 7, 21, 30)", included: true },
      { name: "Contact management", included: true },
      { name: "Knowledge base upload", included: true },
      { name: "50 free script edits", included: true },
      { name: "10 free regenerations", included: true },
      { name: "AI answers calls", included: false },
      { name: "Call transcripts", included: false },
      { name: "Appointment booking", included: false },
      { name: "Voice customization", included: false },
      { name: "Google Calendar sync", included: false },
    ],
  },
  {
    name: "Voice AI",
    price: "$75",
    description: "AI-powered phone answering for businesses that need to be available 24/7",
    features: [
      { name: "AI answers every call", included: true },
      { name: "Call transcripts & recordings", included: true },
      { name: "Appointment booking during calls", included: true },
      { name: "Call transfer to real person", included: true },
      { name: "Voice customization", included: true },
      { name: "Google Calendar sync", included: true },
      { name: "Knowledge base upload", included: true },
      { name: "50 free script edits", included: true },
      { name: "Missed call auto-text", included: false },
      { name: "Drip follow-up campaigns", included: false },
    ],
  },
  {
    name: "Full AI Employee",
    price: "$99",
    description: "The complete AI employee that handles everything",
    features: [
      { name: "Everything in Text AI", included: true },
      { name: "Everything in Voice AI", included: true },
      { name: "Best value - save $25/month", included: true },
      { name: "Priority support", included: true },
    ],
    popular: true,
  },
];

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your plan. All plans include a 7-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg relative" : ""}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription className="min-h-[48px]">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${!feature.included ? "text-muted-foreground" : ""}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href="/sign-up">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Usage Pricing */}
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Usage Pricing</CardTitle>
              <CardDescription>
                Pay only for what you use. Add funds to your balance anytime.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="font-medium">SMS Messages</p>
                  <p className="text-2xl font-bold">$0.004</p>
                  <p className="text-sm text-muted-foreground">per message</p>
                </div>
                <div>
                  <p className="font-medium">Voice Calls</p>
                  <p className="text-2xl font-bold">$0.007</p>
                  <p className="text-sm text-muted-foreground">per minute</p>
                </div>
                <div>
                  <p className="font-medium">Phone Number</p>
                  <p className="text-2xl font-bold">$1</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Start with a $25 usage balance. Auto-reload available when balance is low.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the free trial work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You get 7 days free to try everything. We&apos;ll ask for your card upfront to prevent abuse,
                  but you won&apos;t be charged until the trial ends. Cancel anytime.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Upgrades are immediate and prorated. Downgrades take effect at the end of your billing period.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens if my balance runs out?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We&apos;ll send you an alert. You can enable auto-reload to automatically add funds when your balance is low.
                  Calls will still be answered, but automated texts will pause until you add funds.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
