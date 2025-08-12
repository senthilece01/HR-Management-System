import MainLayout from '@/components/layout/MainLayout';
import LeaveRequestsTable from '@/components/dashboard/LeaveRequestsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function TeamLeavesPage() {
  const { user } = useAuth();
  
  // Redirect if user is not a manager or admin
  if (user && user.role !== 'manager' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Team Leaves</h1>
          <p className="text-muted-foreground">
            Manage leave requests from your team members
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>
              Review and manage leave requests from your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Requests</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <LeaveRequestsTable userView={false} teamView={true} />
              </TabsContent>
              <TabsContent value="pending">
                <LeaveRequestsTable userView={false} teamView={true} />
              </TabsContent>
              <TabsContent value="approved">
                <LeaveRequestsTable userView={false} teamView={true} />
              </TabsContent>
              <TabsContent value="rejected">
                <LeaveRequestsTable userView={false} teamView={true} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}