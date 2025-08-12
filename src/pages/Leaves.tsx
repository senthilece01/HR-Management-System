import MainLayout from '@/components/layout/MainLayout';
import LeaveRequestsTable from '@/components/dashboard/LeaveRequestsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function LeavesPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Leaves</h1>
            <p className="text-muted-foreground">
              View and manage your leave requests
            </p>
          </div>
          <Button asChild>
            <Link to="/apply-leave">
              <Plus className="mr-2 h-4 w-4" /> New Leave
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Leave History</CardTitle>
            <CardDescription>
              All your leave requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Leaves</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <LeaveRequestsTable />
              </TabsContent>
              <TabsContent value="pending">
                <LeaveRequestsTable />
              </TabsContent>
              <TabsContent value="approved">
                <LeaveRequestsTable />
              </TabsContent>
              <TabsContent value="rejected">
                <LeaveRequestsTable />
              </TabsContent>
              <TabsContent value="cancelled">
                <LeaveRequestsTable />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}