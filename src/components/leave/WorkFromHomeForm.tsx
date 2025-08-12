import { useState } from 'react';
import { useLeave } from '@/contexts/LeaveContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, isBefore, isAfter, addDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

export default function WorkFromHomeForm() {
  const { user } = useAuth();
  const { createWfhRequest, isDateHoliday } = useLeave();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if selected date is valid
  const isDateValid = () => {
    if (!date) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    // Date should be today or in the future
    if (isBefore(selectedDate, today)) {
      return false;
    }
    
    // Date should not be a holiday
    if (isDateHoliday(selectedDate)) {
      return false;
    }
    
    // Date should not be a weekend
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return false;
    }
    
    // Date should not be more than 15 days in the future
    const maxDate = addDays(today, 15);
    if (isAfter(selectedDate, maxDate)) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !reason.trim() || !user) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!isDateValid()) {
      toast.error('Selected date is invalid');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await createWfhRequest({
        userId: user.id,
        date,
        reason,
      });
      
      if (success) {
        toast.success('Work from home request submitted successfully');
        setDate(undefined);
        setReason('');
      } else {
        toast.error('Failed to submit work from home request');
      }
    } catch (error) {
      console.error('Error submitting work from home request:', error);
      toast.error('An error occurred while submitting your request');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Request Work From Home</h2>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
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
                    today.setHours(0, 0, 0, 0);
                    
                    // Disable dates in the past
                    if (isBefore(date, today)) {
                      return true;
                    }
                    
                    // Disable weekends
                    const dayOfWeek = date.getDay();
                    if (dayOfWeek === 0 || dayOfWeek === 6) {
                      return true;
                    }
                    
                    // Disable holidays
                    if (isDateHoliday(date)) {
                      return true;
                    }
                    
                    // Disable dates more than 15 days in the future
                    const maxDate = addDays(today, 15);
                    if (isAfter(date, maxDate)) {
                      return true;
                    }
                    
                    return false;
                  }}
                />
              </PopoverContent>
            </Popover>
            <p className="text-sm text-muted-foreground">
              You can request work from home for a future date (within 15 days).
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for working from home"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <Button type="submit" disabled={isSubmitting || !date || !reason.trim() || !isDateValid()}>
          {isSubmitting ? 'Submitting...' : 'Submit WFH Request'}
        </Button>
      </form>
    </Card>
  );
}