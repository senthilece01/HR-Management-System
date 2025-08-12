import { useState, useEffect } from 'react';
import { useLeave } from '@/contexts/LeaveContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LeaveConfiguration } from '@/types';

export default function LeaveConfigurationForm() {
  const { leaveConfiguration, updateLeaveConfiguration } = useLeave();
  const [config, setConfig] = useState<LeaveConfiguration>({
    sickLeavePerMonth: 1,
    casualLeavePerMonth: 1,
    vacationLeavePerMonth: 1,
    maxLopDaysPerYear: 10,
    casualVacationAdvanceNoticeDays: 3,
    sickLeaveTimeCutoff: "10:00",
    maxCarryForwardDays: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load current configuration when component mounts
  useEffect(() => {
    setConfig(leaveConfiguration);
  }, [leaveConfiguration]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (name === 'sickLeavePerMonth' || 
        name === 'casualLeavePerMonth' || 
        name === 'vacationLeavePerMonth' || 
        name === 'maxLopDaysPerYear' || 
        name === 'casualVacationAdvanceNoticeDays' || 
        name === 'maxCarryForwardDays') {
      setConfig({
        ...config,
        [name]: parseFloat(value) || 0
      });
    } else {
      // Handle string inputs
      setConfig({
        ...config,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await updateLeaveConfiguration(config);
      if (success) {
        toast.success('Leave configuration updated successfully');
      } else {
        toast.error('Failed to update leave configuration');
      }
    } catch (error) {
      console.error('Error updating leave configuration:', error);
      toast.error('An error occurred while updating configuration');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Configuration</CardTitle>
        <CardDescription>Configure leave accrual rules and policies for the organization</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sickLeavePerMonth">Sick Leave Per Month</Label>
              <Input
                id="sickLeavePerMonth"
                name="sickLeavePerMonth"
                type="number"
                step="0.5"
                min="0"
                value={config.sickLeavePerMonth}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Days of sick leave accrued per month by full-time employees
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="casualLeavePerMonth">Casual Leave Per Month</Label>
              <Input
                id="casualLeavePerMonth"
                name="casualLeavePerMonth"
                type="number"
                step="0.5"
                min="0"
                value={config.casualLeavePerMonth}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Days of casual leave accrued per month by full-time employees
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vacationLeavePerMonth">Vacation Leave Per Month</Label>
              <Input
                id="vacationLeavePerMonth"
                name="vacationLeavePerMonth"
                type="number"
                step="0.5"
                min="0"
                value={config.vacationLeavePerMonth}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Days of vacation leave accrued per month by full-time employees
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxLopDaysPerYear">Max LOP Days Per Year</Label>
              <Input
                id="maxLopDaysPerYear"
                name="maxLopDaysPerYear"
                type="number"
                step="1"
                min="0"
                value={config.maxLopDaysPerYear}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of Loss of Pay days allowed per year
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="casualVacationAdvanceNoticeDays">Advance Notice for Casual/Vacation Leave</Label>
              <Input
                id="casualVacationAdvanceNoticeDays"
                name="casualVacationAdvanceNoticeDays"
                type="number"
                step="1"
                min="1"
                value={config.casualVacationAdvanceNoticeDays}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Number of working days in advance for casual/vacation leave application
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sickLeaveTimeCutoff">Sick Leave Time Cutoff</Label>
              <Input
                id="sickLeaveTimeCutoff"
                name="sickLeaveTimeCutoff"
                type="time"
                value={config.sickLeaveTimeCutoff}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Time cutoff for applying sick leave on the same day
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxCarryForwardDays">Max Carry Forward Days</Label>
              <Input
                id="maxCarryForwardDays"
                name="maxCarryForwardDays"
                type="number"
                step="1"
                min="0"
                value={config.maxCarryForwardDays}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of leave days that can be carried forward
              </p>
            </div>
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Configuration'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}