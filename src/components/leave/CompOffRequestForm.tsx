import { useState } from 'react';
import { useLeave } from '@/contexts/LeaveContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, isBefore } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

export default function CompOffRequestForm() {
  const { user } = useAuth();
  const { createCompOffRequest } = useLeave();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hours, setHours] = useState<number>(8);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || hours <= 0 || !reason.trim() || !user) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (hours > 12) {
      toast.error('Hours cannot exceed 12 per day');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await createCompOffRequest({
        userId: user.id,
        date,
        hours,
        reason,
      });
      
      if (success) {
        toast.success('Compensatory off request submitted successfully');
        setDate(undefined);
        setHours(8);
        setReason('');
      } else {
        toast.error('Failed to submit compensatory off request');
      }
    } catch (error) {
      console.error('Error submitting compensatory off request:', error);
      toast.error('An error occurred while submitting your request');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Request Compensatory Off</h2>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date Worked</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => {
                    const today = new Date();
                    // Allow up to 30 days in the past for comp-off requests
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(today.getDate() - 30);
                    
                    // Disable dates more than 30 days in the past or future dates
                    return isBefore(date, thirtyDaysAgo) || date > today;
                  }}
                />
              </PopoverContent>
            </Popover>
            <p className="text-sm text-muted-foreground">
              Select the date when you worked extra hours (within the past 30 days).
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hours">Extra Hours Worked</Label>
            <Input
              id="hours"
              type="number"
              min="1"
              max="12"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value) || 0)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Number of extra hours worked (maximum 12 per day).
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Work Details</Label>
            <Textarea
              id="reason"
              placeholder="Please provide details about the work done during extra hours"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <Button type="submit" disabled={isSubmitting || !date || hours <= 0 || hours > 12 || !reason.trim()}>
          {isSubmitting ? 'Submitting...' : 'Submit Comp-Off Request'}
        </Button>
      </form>
    </Card>
  );
}