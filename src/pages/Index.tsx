import MainLayout from '@/components/layout/MainLayout';
import LeaveBalanceCard from '@/components/dashboard/LeaveBalanceCard';
import LeaveRequestsTable from '@/components/dashboard/LeaveRequestsTable';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's an overview of your leave status.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LeaveBalanceCard />
          
          <div className="space-y-6 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks you might want to perform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button asChild className="h-auto py-4 justify-start" variant="outline">
                    <Link to="/apply-leave" className="flex flex-col items-start space-y-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div className="text-sm font-medium">Apply for Leave</div>
                      <div className="text-xs text-muted-foreground">Request time off work</div>
                    </Link>
                  </Button>
                  
                  <Button asChild className="h-auto py-4 justify-start" variant="outline">
                    <Link to="/work-from-home" className="flex flex-col items-start space-y-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      <div className="text-sm font-medium">Work From Home</div>
                      <div className="text-xs text-muted-foreground">Request a WFH day</div>
                    </Link>
                  </Button>
                  
                  <Button asChild className="h-auto py-4 justify-start" variant="outline">
                    <Link to="/leaves" className="flex flex-col items-start space-y-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      <div className="text-sm font-medium">View Leaves</div>
                      <div className="text-xs text-muted-foreground">Check leave requests</div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Leave Requests</CardTitle>
                <CardDescription>Your recent leave activity</CardDescription>
              </CardHeader>
              <CardContent>
                <LeaveRequestsTable />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {(user?.role === 'manager' || user?.role === 'admin') && (
          <Card>
            <CardHeader>
              <CardTitle>Team Leave Requests</CardTitle>
              <CardDescription>Recent leave requests from your team members</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestsTable userView={false} teamView={true} />
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}