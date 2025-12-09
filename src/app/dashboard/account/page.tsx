import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="text-muted-foreground">
          Manage your plan, balance, and settings
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Plan</CardTitle>
            <CardDescription>Current subscription details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold">Full AI Employee</p>
              <p className="text-muted-foreground">$100/month</p>
            </div>
            <p className="text-sm text-muted-foreground">Next billing: --</p>
            <Button variant="outline">Change Plan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usage Balance</CardTitle>
            <CardDescription>Prepaid balance for calls and texts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold">$0.00</p>
              <p className="text-muted-foreground">current balance</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="auto-reload" defaultChecked />
              <Label htmlFor="auto-reload" className="text-sm">
                Auto-reload $25 when below $5
              </Label>
            </div>
            <Button variant="outline">+ Add Funds</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Connected Accounts</CardTitle>
            <CardDescription>Your linked services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Google Account</p>
                <p className="text-sm text-muted-foreground">Calendar synced</p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Phone Number</p>
                <p className="text-sm text-muted-foreground">Not assigned</p>
              </div>
              <Button variant="outline" size="sm">Get Number</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Controls</CardTitle>
            <CardDescription>Turn features on or off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Text Automation</p>
                <p className="text-sm text-muted-foreground">Auto-texts and drip campaigns</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Voice AI</p>
                <p className="text-sm text-muted-foreground">AI answers your calls</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-4">
        <Button variant="ghost" className="text-destructive hover:text-destructive">
          Cancel Subscription
        </Button>
      </div>
    </div>
  );
}
