import MainLayout from '@/components/layout/MainLayout';
import LeaveApplicationForm from '@/components/leave/LeaveApplicationForm';
import { Separator } from '@/components/ui/separator';

export default function ApplyLeavePage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Apply for Leave</h1>
          <p className="text-muted-foreground">
            Submit a new leave request
          </p>
        </div>
        
        <Separator />
        
        <LeaveApplicationForm />
      </div>
    </MainLayout>
  );
}