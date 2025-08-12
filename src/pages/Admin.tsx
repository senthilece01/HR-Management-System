import MainLayout from '@/components/layout/MainLayout';
import LeaveConfigurationForm from '@/components/admin/LeaveConfigurationForm';
import HolidaysManagement from '@/components/admin/HolidaysManagement';
import UserManagement from '@/components/admin/UserManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminPage() {
  const { user } = useAuth();
  
  // Redirect if user is not an admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">
            Configure system settings and manage users
          </p>
        </div>
        
        <Separator />
        
        <Tabs defaultValue="leave-config">
          <TabsList className="mb-6">
            <TabsTrigger value="leave-config">Leave Configuration</TabsTrigger>
            <TabsTrigger value="holidays">Holidays</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leave-config">
            <LeaveConfigurationForm />
          </TabsContent>
          
          <TabsContent value="holidays">
            <HolidaysManagement />
          </TabsContent>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}