import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Phone, MessageSquare, Calendar, Zap, Clock, Shield } from "lucide-react";

const features = [
  {
    icon: Phone,
    title: "AI Answers Calls",
    description: "Your AI picks up every call, answers questions, and books appointments 24/7.",
  },
  {
    icon: MessageSquare,
    title: "Automated Texts",
    description: "Missed call texts and smart follow-up drip campaigns that convert leads.",
  },
  {
    icon: Calendar,
    title: "Instant Booking",
    description: "AI checks your calendar and books appointments during the call.",
  },
  {
    icon: Zap,
    title: "Setup in 3 Minutes",
    description: "No complex integrations. Upload your info and go live immediately.",
  },
  {
    icon: Clock,
    title: "Never Miss a Lead",
    description: "Every call answered, every text replied to, every lead followed up.",
  },
  {
    icon: Shield,
    title: "You Stay in Control",
    description: "Review conversations, edit scripts, and pause anytime.",
  },
];

const plans = [
  {
    name: "Text AI",
    price: "$49",
    description: "SMS automation for businesses",
    features: [
      "Missed call auto-text",
      "Drip follow-up campaigns",
      "Contact management",
      "Knowledge base",
      "50 free script edits",
    ],
  },
  {
    name: "Voice AI",
    price: "$75",
    description: "AI answers your calls",
    features: [
      "AI answers every call",
      "Call transcripts",
      "Appointment booking",
      "Call transfer",
      "Voice customization",
      "Google Calendar sync",
    ],
  },
  {
    name: "Full AI Employee",
    price: "$99",
    description: "The complete package",
    features: [
      "Everything in Text AI",
      "Everything in Voice AI",
      "Priority support",
      "Best value",
    ],
    popular: true,
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Setup in under 3 minutes
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Your AI Employee for Calls & Texts
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI handles calls, texts, follow-up, and appointment booking automatically like a real employee. No CRM complexity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            7-day free trial. No credit card required to start.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Hire an AI, Not Learn Software
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              It&apos;s like hiring an employee who works 24/7, never calls in sick, and costs less than your morning coffee.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose your plan. Pay only for what you use. Cancel anytime.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg relative" : ""}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant={plan.popular ? "default" : "outline"} asChild>
                    <Link href="/sign-up">Start Free Trial</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-muted-foreground">
            Plus usage: ~$0.004/text, ~$0.007/min call. Phone number: $1/month.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Hire Your AI Employee?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join businesses that never miss a call or lead. Start your free trial today.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/sign-up">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
