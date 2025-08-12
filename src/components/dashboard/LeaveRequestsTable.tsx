import { useLeave } from '@/contexts/LeaveContext';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, FileText } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { LeaveRequest } from '@/types';

export default function LeaveRequestsTable({ userView = true, teamView = false }) {
  const { leaveRequests, approveLeaveRequest, rejectLeaveRequest, cancelLeaveRequest } = useLeave();
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Filter requests based on view type
  const filteredRequests = leaveRequests.filter(request => {
    if (teamView) {
      // For team view, show requests from employees managed by this manager/admin
      return user?.role === 'admin' || (user?.role === 'manager' && request.userId !== user?.id);
    } else {
      // For user view, show only the user's own requests
      return request.userId === user?.id;
    }
  });

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const handleReject = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsRejectDialogOpen(true);
    setRejectionReason('');
  };

  const confirmReject = async () => {
    if (selectedRequest && rejectionReason) {
      await rejectLeaveRequest(selectedRequest.id, rejectionReason);
      setIsRejectDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLeaveTypeBadge = (type: string) => {
    switch (type) {
      case 'sick':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Sick</Badge>;
      case 'casual':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Casual</Badge>;
      case 'vacation':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Vacation</Badge>;
      case 'lop':
        return <Badge variant="outline" className="bg-red-100 text-red-800">LOP</Badge>;
      case 'academic':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Academic</Badge>;
      case 'comp-off':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800">Comp-Off</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {teamView && <TableHead>Employee</TableHead>}
              <TableHead>Type</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={teamView ? 6 : 5} className="text-center text-muted-foreground py-4">
                  No leave requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map(request => (
                <TableRow key={request.id}>
                  {teamView && <TableCell>{request.userName}</TableCell>}
                  <TableCell>{getLeaveTypeBadge(request.leaveType)}</TableCell>
                  <TableCell>{format(new Date(request.startDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(request.endDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(request)}>
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                      
                      {/* Show approval/rejection buttons for pending requests in team view */}
                      {teamView && request.status === 'pending' && (user?.role === 'manager' || user?.role === 'admin') && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => approveLeaveRequest(request.id)}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleReject(request)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        </>
                      )}
                      
                      {/* Show cancel button for pending requests in user view */}
                      {userView && request.status === 'pending' && (
                        <Button
                          variant="ghost" 
                          size="icon" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => cancelLeaveRequest(request.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancel</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Leave Request Details</DialogTitle>
              <DialogDescription>
                Request submitted on {format(new Date(selectedRequest.appliedOn), 'MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Employee:</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.userName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Type:</p>
                  <p className="text-sm text-muted-foreground capitalize">{selectedRequest.leaveType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">From:</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(selectedRequest.startDate), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">To:</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(selectedRequest.endDate), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status:</p>
                  <p className="text-sm text-muted-foreground capitalize">{selectedRequest.status}</p>
                </div>
                {selectedRequest.approvedBy && (
                  <div>
                    <p className="text-sm font-medium">Processed by:</p>
                    <p className="text-sm text-muted-foreground">{selectedRequest.approvedBy}</p>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium">Reason:</p>
                <p className="text-sm text-muted-foreground">{selectedRequest.reason}</p>
              </div>
              
              {selectedRequest.rejectionReason && (
                <div>
                  <p className="text-sm font-medium text-red-600">Rejection Reason:</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.rejectionReason}</p>
                </div>
              )}
              
              {selectedRequest.attachmentUrl && (
                <div>
                  <p className="text-sm font-medium">Attachment:</p>
                  <a 
                    href={selectedRequest.attachmentUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Document
                  </a>
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Rejection Reason Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this leave request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="destructive" 
              onClick={confirmReject}
              disabled={!rejectionReason.trim()}
            >
              Reject Request
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}