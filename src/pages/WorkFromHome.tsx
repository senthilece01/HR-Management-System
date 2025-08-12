import MainLayout from '@/components/layout/MainLayout';
import WorkFromHomeForm from '@/components/leave/WorkFromHomeForm';
import CompOffRequestForm from '@/components/leave/CompOffRequestForm';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function WorkFromHomePage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Work Arrangements</h1>
          <p className="text-muted-foreground">
            Request work from home or compensatory time off
          </p>
        </div>
        
        <Separator />
        
        <Tabs defaultValue="wfh">
          <TabsList className="mb-4">
            <TabsTrigger value="wfh">Work From Home</TabsTrigger>
            <TabsTrigger value="compoff">Compensatory Off</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wfh">
            <WorkFromHomeForm />
          </TabsContent>
          
          <TabsContent value="compoff">
            <CompOffRequestForm />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}