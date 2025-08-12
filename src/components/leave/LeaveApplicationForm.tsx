import { useState } from 'react';
import { useLeave } from '@/contexts/LeaveContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, addBusinessDays, differenceInBusinessDays, addDays, isWeekend, isBefore, isAfter } from 'date-fns';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { LeaveType } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

export default function LeaveApplicationForm() {
  const { user } = useAuth();
  const { 
    createLeaveRequest, 
    leaveBalance, 
    leaveConfiguration, 
    holidays,
    isDateHoliday,
    calculateBusinessDays
  } = useLeave();
  
  const [leaveType, setLeaveType] = useState<LeaveType>('sick');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if casual/vacation leave is applied in advance according to configuration
  const isProperAdvanceNotice = () => {
    if (!startDate || !leaveType || !leaveConfiguration) return true;
    if (leaveType !== 'casual' && leaveType !== 'vacation') return true;
    
    const today = new Date();
    const requiredDays = leaveConfiguration.casualVacationAdvanceNoticeDays;
    
    // Calculate the earliest allowed application date
    let earliestAllowed = today;
    let daysAdded = 0;
    while (daysAdded < requiredDays) {
      earliestAllowed = addDays(earliestAllowed, 1);
      if (!isWeekend(earliestAllowed) && !isDateHoliday(earliestAllowed)) {
        daysAdded++;
      }
    }
    
    return isBefore(earliestAllowed, startDate) || isAfter(earliestAllowed, startDate);
  };
  
  // Check if sick leave is applied on the same day before cutoff time
  const isSickLeaveValid = () => {
    if (leaveType !== 'sick') return true;
    
    const today = new Date();
    const startDateValue = startDate ? new Date(startDate) : new Date();
    
    // Format the dates to compare just the date part
    const todayStr = format(today, 'yyyy-MM-dd');
    const startDateStr = format(startDateValue, 'yyyy-MM-dd');
    
    // If not for today, it's valid
    if (todayStr !== startDateStr) return true;
    
    // If for today, check cutoff time
    const cutoffHour = parseInt(leaveConfiguration.sickLeaveTimeCutoff.split(':')[0]);
    const cutoffMinute = parseInt(leaveConfiguration.sickLeaveTimeCutoff.split(':')[1] || '0');
    
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    
    return currentHour < cutoffHour || (currentHour === cutoffHour && currentMinute <= cutoffMinute);
  };
  
  // Calculate number of business days between selected dates
  const calculatedDays = () => {
    if (!startDate || !endDate) return 0;
    return calculateBusinessDays(startDate, endDate);
  };
  
  // Check if the leave would result in LOP
  const willResultInLOP = () => {
    if (!leaveBalance || !startDate || !endDate) return false;
    
    const days = calculatedDays();
    
    switch (leaveType) {
      case 'sick':
        return days > leaveBalance.sick;
      case 'casual':
        return days > leaveBalance.casual;
      case 'vacation':
        return days > leaveBalance.vacation;
      case 'comp-off':
        return days > leaveBalance.compOffCount;
      case 'lop':
        return true; // LOP is always LOP
      default:
        return false;
    }
  };
  
  // Check if selected dates are valid
  const areDatesValid = () => {
    if (!startDate || !endDate) return false;
    return !isBefore(endDate, startDate);
  };
  
  const getLOPDays = () => {
    if (!leaveBalance || !startDate || !endDate) return 0;
    
    const days = calculatedDays();
    
    switch (leaveType) {
      case 'sick':
        return Math.max(0, days - leaveBalance.sick);
      case 'casual':
        return Math.max(0, days - leaveBalance.casual);
      case 'vacation':
        return Math.max(0, days - leaveBalance.vacation);
      case 'comp-off':
        return Math.max(0, days - leaveBalance.compOffCount);
      case 'lop':
        return days; // All days are LOP
      default:
        return 0;
    }
  };
  
  // Submit the leave request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !reason.trim() || !user) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!areDatesValid()) {
      toast.error('End date must be on or after start date');
      return;
    }
    
    if (calculatedDays() <= 0) {
      toast.error('Selected dates do not include any working days');
      return;
    }
    
    // Validation for advance notice for casual/vacation leaves
    if (!isProperAdvanceNotice()) {
      toast.error(`${leaveType === 'casual' ? 'Casual' : 'Vacation'} leave must be applied at least ${leaveConfiguration.casualVacationAdvanceNoticeDays} working days in advance`);
      return;
    }
    
    // Validation for sick leave on the same day
    if (!isSickLeaveValid()) {
      toast.error(`Sick leave for today must be applied before ${leaveConfiguration.sickLeaveTimeCutoff}`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would upload the attachment to MongoDB/Cloud storage
      // For now, we'll just use a placeholder URL if an attachment exists
      const attachmentUrl = attachment ? `https://example.com/${attachment.name}` : undefined;
      
      const success = await createLeaveRequest({
        userId: user.id,
        leaveType,
        startDate,
        endDate,
        reason,
        attachmentUrl,
      });
      
      if (success) {
        toast.success('Leave request submitted successfully');
        // Reset form
        setLeaveType('sick');
        setStartDate(undefined);
        setEndDate(undefined);
        setReason('');
        setAttachment(null);
      } else {
        toast.error('Failed to submit leave request');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error('An error occurred while submitting your request');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Apply for Leave</h2>
          
          <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select 
              value={leaveType} 
              onValueChange={(value) => setLeaveType(value as LeaveType)}
              required
            >
              <SelectTrigger id="leaveType">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="casual">Casual Leave</SelectItem>
                <SelectItem value="vacation">Vacation Leave</SelectItem>
                {user?.employeeType === 'full-time' && (
                  <SelectItem value="comp-off">Comp Off</SelectItem>
                )}
                {user?.role === 'admin' && (
                  <SelectItem value="lop">Loss of Pay</SelectItem>
                )}
                {(user?.employeeType === 'intern' || user?.employeeType === 'trainee') && (
                  <SelectItem value="academic">Academic Leave</SelectItem>
                )}
              </SelectContent>
            </Select>
            
            {leaveType === 'sick' && (
              <p className="text-sm text-muted-foreground">
                Sick leave for the current day must be applied before {leaveConfiguration?.sickLeaveTimeCutoff || '10:00'}.
              </p>
            )}
            
            {(leaveType === 'casual' || leaveType === 'vacation') && (
              <p className="text-sm text-muted-foreground">
                {leaveType === 'casual' ? 'Casual' : 'Vacation'} leave must be applied at least {leaveConfiguration?.casualVacationAdvanceNoticeDays || 3} working days in advance.
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => startDate ? isBefore(date, startDate) : false}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for your leave request"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>
          
          {leaveType === 'academic' && (
            <div className="space-y-2">
              <Label htmlFor="attachment">Supporting Document</Label>
              <Input
                id="attachment"
                type="file"
                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                accept="/images/FileUpload.jpg"
              />
              <p className="text-sm text-muted-foreground">
                Please upload any supporting documents for your academic leave (e.g., course schedule, exam timetable).
              </p>
            </div>
          )}
          
          {startDate && endDate && areDatesValid() && (
            <div className="pt-2">
              <p className="text-sm font-medium">
                Working days: {calculatedDays()}
              </p>
              
              {willResultInLOP() && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Loss of Pay Warning</AlertTitle>
                  <AlertDescription>
                    This leave request will result in {getLOPDays()} day(s) of Loss of Pay.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
        
        <Button type="submit" disabled={isSubmitting || !startDate || !endDate || !reason.trim() || !areDatesValid()}>
          {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
        </Button>
      </form>
    </Card>
  );
}