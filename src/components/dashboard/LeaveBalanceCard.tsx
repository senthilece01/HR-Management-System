import { useLeave } from '@/contexts/LeaveContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function LeaveBalanceCard() {
  const { leaveBalance } = useLeave();

  if (!leaveBalance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leave Balance</CardTitle>
          <CardDescription>Your current leave entitlements</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading leave balance...</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate total leaves (for visualization)
  const maxLeaves = Math.max(10, leaveBalance.sick + leaveBalance.casual + leaveBalance.vacation);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Balance</CardTitle>
        <CardDescription>Your current leave entitlements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Sick Leave</div>
            <div className="text-sm text-muted-foreground">{leaveBalance.sick} days</div>
          </div>
          <Progress value={(leaveBalance.sick / maxLeaves) * 100} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Casual Leave</div>
            <div className="text-sm text-muted-foreground">{leaveBalance.casual} days</div>
          </div>
          <Progress value={(leaveBalance.casual / maxLeaves) * 100} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Vacation Leave</div>
            <div className="text-sm text-muted-foreground">{leaveBalance.vacation} days</div>
          </div>
          <Progress value={(leaveBalance.vacation / maxLeaves) * 100} className="h-2" />
        </div>
        {leaveBalance.compOffCount > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Comp-Off</div>
              <div className="text-sm text-muted-foreground">{leaveBalance.compOffCount} days</div>
            </div>
            <Progress value={(leaveBalance.compOffCount / maxLeaves) * 100} className="h-2" />
          </div>
        )}
        {leaveBalance.lopCount > 0 && (
          <div className="pt-2 border-t border-dashed border-muted">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-destructive">Loss of Pay Used</div>
              <div className="text-sm text-destructive">{leaveBalance.lopCount} days</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}