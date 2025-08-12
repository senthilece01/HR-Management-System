export type UserRole = 'employee' | 'manager' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  managerId?: string;
  joiningDate: Date;
  employeeType: 'full-time' | 'intern' | 'trainee';
};

export type LeaveType = 'sick' | 'casual' | 'vacation' | 'lop' | 'academic' | 'comp-off';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export type LeaveBalance = {
  userId: string;
  sick: number;
  casual: number;
  vacation: number;
  lopCount: number;
  compOffCount: number;
  updatedAt: Date;
};

export type LeaveRequest = {
  id: string;
  userId: string;
  userName: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  appliedOn: Date;
  approvedBy?: string;
  approvedOn?: Date;
  rejectionReason?: string;
  attachmentUrl?: string;
  isWfh?: boolean;
};

export type Holiday = {
  id: string;
  name: string;
  date: Date;
  isOptional: boolean;
};

export type LeaveConfiguration = {
  sickLeavePerMonth: number;
  casualLeavePerMonth: number;
  vacationLeavePerMonth: number;
  maxLopDaysPerYear: number;
  casualVacationAdvanceNoticeDays: number;
  sickLeaveTimeCutoff: string; // e.g., "10:00"
  maxCarryForwardDays: number;
};

export type WorkFromHomeRequest = {
  id: string;
  userId: string;
  userName: string;
  date: Date;
  reason: string;
  status: LeaveStatus;
  appliedOn: Date;
  approvedBy?: string;
  approvedOn?: Date;
};

export type CompOffRequest = {
  id: string;
  userId: string;
  userName: string;
  date: Date;
  hours: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: Date;
  approvedBy?: string;
  approvedOn?: Date;
};

export type Notification = {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string;
};