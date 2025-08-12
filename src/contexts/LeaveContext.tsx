import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  LeaveRequest, 
  LeaveBalance, 
  LeaveType, 
  LeaveStatus, 
  LeaveConfiguration,
  Holiday,
  WorkFromHomeRequest,
  CompOffRequest
} from '@/types';
import { useAuth } from './AuthContext';
import { addDays, format, isWeekend, differenceInBusinessDays } from 'date-fns';

interface LeaveContextType {
  // Leave requests
  leaveRequests: LeaveRequest[];
  createLeaveRequest: (leaveRequest: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn' | 'userName'>) => Promise<boolean>;
  approveLeaveRequest: (leaveId: string) => Promise<boolean>;
  rejectLeaveRequest: (leaveId: string, reason: string) => Promise<boolean>;
  cancelLeaveRequest: (leaveId: string) => Promise<boolean>;
  
  // Leave balances
  leaveBalance: LeaveBalance | null;
  
  // Leave configurations
  leaveConfiguration: LeaveConfiguration;
  updateLeaveConfiguration: (config: Partial<LeaveConfiguration>) => Promise<boolean>;
  
  // Holidays
  holidays: Holiday[];
  addHoliday: (holiday: Omit<Holiday, 'id'>) => Promise<boolean>;
  removeHoliday: (id: string) => Promise<boolean>;
  
  // WFH requests
  wfhRequests: WorkFromHomeRequest[];
  createWfhRequest: (request: Omit<WorkFromHomeRequest, 'id' | 'status' | 'appliedOn' | 'userName'>) => Promise<boolean>;
  approveWfhRequest: (id: string) => Promise<boolean>;
  rejectWfhRequest: (id: string) => Promise<boolean>;
  
  // Comp-off requests
  compOffRequests: CompOffRequest[];
  createCompOffRequest: (request: Omit<CompOffRequest, 'id' | 'status' | 'appliedOn' | 'userName'>) => Promise<boolean>;
  approveCompOffRequest: (id: string) => Promise<boolean>;
  rejectCompOffRequest: (id: string) => Promise<boolean>;
  
  // Utility functions
  isDateHoliday: (date: Date) => boolean;
  calculateBusinessDays: (startDate: Date, endDate: Date) => number;
  refreshData: () => Promise<void>;
}

const LeaveContext = createContext<LeaveContextType>({
  leaveRequests: [],
  createLeaveRequest: async () => false,
  approveLeaveRequest: async () => false,
  rejectLeaveRequest: async () => false,
  cancelLeaveRequest: async () => false,
  
  leaveBalance: null,
  
  leaveConfiguration: {
    sickLeavePerMonth: 1,
    casualLeavePerMonth: 1,
    vacationLeavePerMonth: 1,
    maxLopDaysPerYear: 10,
    casualVacationAdvanceNoticeDays: 3,
    sickLeaveTimeCutoff: "10:00",
    maxCarryForwardDays: 5
  },
  updateLeaveConfiguration: async () => false,
  
  holidays: [],
  addHoliday: async () => false,
  removeHoliday: async () => false,
  
  wfhRequests: [],
  createWfhRequest: async () => false,
  approveWfhRequest: async () => false,
  rejectWfhRequest: async () => false,
  
  compOffRequests: [],
  createCompOffRequest: async () => false,
  approveCompOffRequest: async () => false,
  rejectCompOffRequest: async () => false,
  
  isDateHoliday: () => false,
  calculateBusinessDays: () => 0,
  refreshData: async () => {},
});

export function useLeave() {
  return useContext(LeaveContext);
}

interface LeaveProviderProps {
  children: ReactNode;
}

export function LeaveProvider({ children }: LeaveProviderProps) {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [leaveConfiguration, setLeaveConfiguration] = useState<LeaveConfiguration>({
    sickLeavePerMonth: 1,
    casualLeavePerMonth: 1,
    vacationLeavePerMonth: 1,
    maxLopDaysPerYear: 10,
    casualVacationAdvanceNoticeDays: 3,
    sickLeaveTimeCutoff: "10:00",
    maxCarryForwardDays: 5
  });
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [wfhRequests, setWfhRequests] = useState<WorkFromHomeRequest[]>([]);
  const [compOffRequests, setCompOffRequests] = useState<CompOffRequest[]>([]);
  
  const isDateHoliday = (date: Date) => {
    return holidays.some(holiday => 
      format(new Date(holiday.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };
  
  const calculateBusinessDays = (startDate: Date, endDate: Date) => {
    let days = differenceInBusinessDays(endDate, startDate) + 1;
    
    // Subtract holidays that fall on weekdays
    for (let d = new Date(startDate); d <= endDate; d = addDays(d, 1)) {
      if (!isWeekend(d) && isDateHoliday(d)) {
        days--;
      }
    }
    
    return Math.max(0, days);
  };
  
  // Mock data initialization
  useEffect(() => {
    // Initialize mock data when the user changes
    if (user) {
      // Load data from localStorage or use default values
      const storedLeaveRequests = localStorage.getItem('leaveRequests');
      const storedLeaveBalances = localStorage.getItem('leaveBalances');
      const storedHolidays = localStorage.getItem('holidays');
      const storedLeaveConfig = localStorage.getItem('leaveConfig');
      const storedWfhRequests = localStorage.getItem('wfhRequests');
      const storedCompOffRequests = localStorage.getItem('compOffRequests');

      // Initialize or load leave requests
      if (storedLeaveRequests) {
        try {
          const parsedRequests: LeaveRequest[] = JSON.parse(storedLeaveRequests);
          // Convert string dates back to Date objects
          const processedRequests = parsedRequests.map(req => ({
            ...req,
            startDate: new Date(req.startDate),
            endDate: new Date(req.endDate),
            appliedOn: new Date(req.appliedOn),
            approvedOn: req.approvedOn ? new Date(req.approvedOn) : undefined
          }));
          setLeaveRequests(processedRequests);
        } catch (error) {
          console.error('Error parsing leave requests:', error);
          setLeaveRequests([]);
        }
      } else {
        setLeaveRequests([]);
      }

      // Initialize or load leave balance for current user
      if (storedLeaveBalances) {
        try {
          const parsedBalances: LeaveBalance[] = JSON.parse(storedLeaveBalances);
          const userBalance = parsedBalances.find(balance => balance.userId === user.id);
          if (userBalance) {
            userBalance.updatedAt = new Date(userBalance.updatedAt);
            setLeaveBalance(userBalance);
          } else {
            setLeaveBalance({
              userId: user.id,
              sick: user.employeeType === 'full-time' ? 3 : 0.5,
              casual: user.employeeType === 'full-time' ? 3 : 0.5,
              vacation: user.employeeType === 'full-time' ? 6 : 0,
              lopCount: 0,
              compOffCount: 0,
              updatedAt: new Date()
            });
          }
        } catch (error) {
          console.error('Error parsing leave balances:', error);
          setLeaveBalance({
            userId: user.id,
            sick: user.employeeType === 'full-time' ? 3 : 0.5,
            casual: user.employeeType === 'full-time' ? 3 : 0.5,
            vacation: user.employeeType === 'full-time' ? 6 : 0,
            lopCount: 0,
            compOffCount: 0,
            updatedAt: new Date()
          });
        }
      } else {
        setLeaveBalance({
          userId: user.id,
          sick: user.employeeType === 'full-time' ? 3 : 0.5,
          casual: user.employeeType === 'full-time' ? 3 : 0.5,
          vacation: user.employeeType === 'full-time' ? 6 : 0,
          lopCount: 0,
          compOffCount: 0,
          updatedAt: new Date()
        });
      }
      
      // Initialize or load holidays
      if (storedHolidays) {
        try {
          const parsedHolidays: Holiday[] = JSON.parse(storedHolidays);
          const processedHolidays = parsedHolidays.map(holiday => ({
            ...holiday,
            date: new Date(holiday.date)
          }));
          setHolidays(processedHolidays);
        } catch (error) {
          console.error('Error parsing holidays:', error);
          setHolidays([
            { id: '1', name: 'New Year', date: new Date(new Date().getFullYear(), 0, 1), isOptional: false },
            { id: '2', name: 'Independence Day', date: new Date(new Date().getFullYear(), 7, 15), isOptional: false },
          ]);
        }
      } else {
        setHolidays([
          { id: '1', name: 'New Year', date: new Date(new Date().getFullYear(), 0, 1), isOptional: false },
          { id: '2', name: 'Independence Day', date: new Date(new Date().getFullYear(), 7, 15), isOptional: false },
        ]);
      }
      
      // Initialize or load leave configuration
      if (storedLeaveConfig) {
        try {
          setLeaveConfiguration(JSON.parse(storedLeaveConfig));
        } catch (error) {
          console.error('Error parsing leave configuration:', error);
          // Default config is already set in state
        }
      }
      
      // Initialize or load WFH requests
      if (storedWfhRequests) {
        try {
          const parsedRequests: WorkFromHomeRequest[] = JSON.parse(storedWfhRequests);
          const processedRequests = parsedRequests.map(req => ({
            ...req,
            date: new Date(req.date),
            appliedOn: new Date(req.appliedOn),
            approvedOn: req.approvedOn ? new Date(req.approvedOn) : undefined
          }));
          setWfhRequests(processedRequests);
        } catch (error) {
          console.error('Error parsing WFH requests:', error);
          setWfhRequests([]);
        }
      } else {
        setWfhRequests([]);
      }
      
      // Initialize or load comp-off requests
      if (storedCompOffRequests) {
        try {
          const parsedRequests: CompOffRequest[] = JSON.parse(storedCompOffRequests);
          const processedRequests = parsedRequests.map(req => ({
            ...req,
            date: new Date(req.date),
            appliedOn: new Date(req.appliedOn),
            approvedOn: req.approvedOn ? new Date(req.approvedOn) : undefined
          }));
          setCompOffRequests(processedRequests);
        } catch (error) {
          console.error('Error parsing comp-off requests:', error);
          setCompOffRequests([]);
        }
      } else {
        setCompOffRequests([]);
      }
    }
  }, [user]);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (leaveRequests.length > 0) {
      localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
    }
  }, [leaveRequests]);
  
  useEffect(() => {
    if (leaveBalance) {
      const storedBalances = localStorage.getItem('leaveBalances');
      let balances: LeaveBalance[] = [];
      
      if (storedBalances) {
        try {
          balances = JSON.parse(storedBalances);
          const index = balances.findIndex(b => b.userId === leaveBalance.userId);
          if (index >= 0) {
            balances[index] = leaveBalance;
          } else {
            balances.push(leaveBalance);
          }
        } catch (error) {
          console.error('Error parsing stored leave balances:', error);
          balances = [leaveBalance];
        }
      } else {
        balances = [leaveBalance];
      }
      
      localStorage.setItem('leaveBalances', JSON.stringify(balances));
    }
  }, [leaveBalance]);
  
  useEffect(() => {
    if (holidays.length > 0) {
      localStorage.setItem('holidays', JSON.stringify(holidays));
    }
  }, [holidays]);
  
  useEffect(() => {
    localStorage.setItem('leaveConfig', JSON.stringify(leaveConfiguration));
  }, [leaveConfiguration]);
  
  useEffect(() => {
    if (wfhRequests.length > 0) {
      localStorage.setItem('wfhRequests', JSON.stringify(wfhRequests));
    }
  }, [wfhRequests]);
  
  useEffect(() => {
    if (compOffRequests.length > 0) {
      localStorage.setItem('compOffRequests', JSON.stringify(compOffRequests));
    }
  }, [compOffRequests]);
  
  // Leave request functions
  const createLeaveRequest = async (leaveRequestData: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn' | 'userName'>) => {
    if (!user) return false;

    try {
      const newLeaveRequest: LeaveRequest = {
        ...leaveRequestData,
        id: `leave-${Date.now()}`,
        userName: user.name,
        status: 'pending',
        appliedOn: new Date(),
      };

      setLeaveRequests(prev => [...prev, newLeaveRequest]);
      return true;
    } catch (error) {
      console.error('Error creating leave request:', error);
      return false;
    }
  };
  
  const approveLeaveRequest = async (leaveId: string) => {
    if (!user || user.role !== 'manager' && user.role !== 'admin') return false;

    try {
      setLeaveRequests(prev => prev.map(request => 
        request.id === leaveId 
          ? { ...request, status: 'approved', approvedBy: user.id, approvedOn: new Date() } 
          : request
      ));
      
      // Update leave balance if leave is approved
      const approvedRequest = leaveRequests.find(req => req.id === leaveId);
      if (approvedRequest && leaveBalance && approvedRequest.userId === leaveBalance.userId) {
        const days = calculateBusinessDays(approvedRequest.startDate, approvedRequest.endDate);
        
        // Update the balance based on leave type
        switch (approvedRequest.leaveType) {
          case 'sick':
            if (leaveBalance.sick >= days) {
              setLeaveBalance(prev => prev ? { ...prev, sick: prev.sick - days } : null);
            } else {
              // Convert to LOP
              const lopDays = days - leaveBalance.sick;
              setLeaveBalance(prev => prev ? { 
                ...prev, 
                sick: 0,
                lopCount: prev.lopCount + lopDays
              } : null);
            }
            break;
          case 'casual':
            if (leaveBalance.casual >= days) {
              setLeaveBalance(prev => prev ? { ...prev, casual: prev.casual - days } : null);
            } else {
              // Convert to LOP
              const lopDays = days - leaveBalance.casual;
              setLeaveBalance(prev => prev ? { 
                ...prev, 
                casual: 0,
                lopCount: prev.lopCount + lopDays
              } : null);
            }
            break;
          case 'vacation':
            if (leaveBalance.vacation >= days) {
              setLeaveBalance(prev => prev ? { ...prev, vacation: prev.vacation - days } : null);
            } else {
              // Convert to LOP
              const lopDays = days - leaveBalance.vacation;
              setLeaveBalance(prev => prev ? { 
                ...prev, 
                vacation: 0,
                lopCount: prev.lopCount + lopDays
              } : null);
            }
            break;
          case 'lop':
            setLeaveBalance(prev => prev ? { ...prev, lopCount: prev.lopCount + days } : null);
            break;
          case 'comp-off':
            setLeaveBalance(prev => prev ? { ...prev, compOffCount: Math.max(0, prev.compOffCount - days) } : null);
            break;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error approving leave request:', error);
      return false;
    }
  };
  
  const rejectLeaveRequest = async (leaveId: string, reason: string) => {
    if (!user || user.role !== 'manager' && user.role !== 'admin') return false;

    try {
      setLeaveRequests(prev => prev.map(request => 
        request.id === leaveId 
          ? { ...request, status: 'rejected', approvedBy: user.id, approvedOn: new Date(), rejectionReason: reason } 
          : request
      ));
      return true;
    } catch (error) {
      console.error('Error rejecting leave request:', error);
      return false;
    }
  };
  
  const cancelLeaveRequest = async (leaveId: string) => {
    try {
      const request = leaveRequests.find(req => req.id === leaveId);
      if (!request || (request.userId !== user?.id && user?.role !== 'admin')) return false;

      setLeaveRequests(prev => prev.map(request => 
        request.id === leaveId 
          ? { ...request, status: 'cancelled' } 
          : request
      ));
      return true;
    } catch (error) {
      console.error('Error cancelling leave request:', error);
      return false;
    }
  };
  
  // Leave configuration functions
  const updateLeaveConfiguration = async (config: Partial<LeaveConfiguration>) => {
    if (!user || user.role !== 'admin') return false;

    try {
      setLeaveConfiguration(prev => ({ ...prev, ...config }));
      return true;
    } catch (error) {
      console.error('Error updating leave configuration:', error);
      return false;
    }
  };
  
  // Holiday functions
  const addHoliday = async (holiday: Omit<Holiday, 'id'>) => {
    if (!user || user.role !== 'admin') return false;

    try {
      const newHoliday = {
        ...holiday,
        id: `holiday-${Date.now()}`
      };
      
      setHolidays(prev => [...prev, newHoliday]);
      return true;
    } catch (error) {
      console.error('Error adding holiday:', error);
      return false;
    }
  };
  
  const removeHoliday = async (id: string) => {
    if (!user || user.role !== 'admin') return false;

    try {
      setHolidays(prev => prev.filter(holiday => holiday.id !== id));
      return true;
    } catch (error) {
      console.error('Error removing holiday:', error);
      return false;
    }
  };
  
  // WFH request functions
  const createWfhRequest = async (requestData: Omit<WorkFromHomeRequest, 'id' | 'status' | 'appliedOn' | 'userName'>) => {
    if (!user) return false;

    try {
      const newRequest: WorkFromHomeRequest = {
        ...requestData,
        id: `wfh-${Date.now()}`,
        userName: user.name,
        status: 'pending',
        appliedOn: new Date()
      };
      
      setWfhRequests(prev => [...prev, newRequest]);
      return true;
    } catch (error) {
      console.error('Error creating WFH request:', error);
      return false;
    }
  };
  
  const approveWfhRequest = async (id: string) => {
    if (!user || user.role !== 'manager' && user.role !== 'admin') return false;

    try {
      setWfhRequests(prev => prev.map(request => 
        request.id === id 
          ? { ...request, status: 'approved', approvedBy: user.id, approvedOn: new Date() } 
          : request
      ));
      return true;
    } catch (error) {
      console.error('Error approving WFH request:', error);
      return false;
    }
  };
  
  const rejectWfhRequest = async (id: string) => {
    if (!user || user.role !== 'manager' && user.role !== 'admin') return false;

    try {
      setWfhRequests(prev => prev.map(request => 
        request.id === id 
          ? { ...request, status: 'rejected', approvedBy: user.id, approvedOn: new Date() } 
          : request
      ));
      return true;
    } catch (error) {
      console.error('Error rejecting WFH request:', error);
      return false;
    }
  };
  
  // Comp-off request functions
  const createCompOffRequest = async (requestData: Omit<CompOffRequest, 'id' | 'status' | 'appliedOn' | 'userName'>) => {
    if (!user) return false;

    try {
      const newRequest: CompOffRequest = {
        ...requestData,
        id: `compoff-${Date.now()}`,
        userName: user.name,
        status: 'pending',
        appliedOn: new Date()
      };
      
      setCompOffRequests(prev => [...prev, newRequest]);
      return true;
    } catch (error) {
      console.error('Error creating comp-off request:', error);
      return false;
    }
  };
  
  const approveCompOffRequest = async (id: string) => {
    if (!user || user.role !== 'manager' && user.role !== 'admin') return false;

    try {
      const request = compOffRequests.find(req => req.id === id);
      if (!request) return false;
      
      setCompOffRequests(prev => prev.map(req => 
        req.id === id 
          ? { ...req, status: 'approved', approvedBy: user.id, approvedOn: new Date() } 
          : req
      ));
      
      // Update comp-off balance if approved
      if (leaveBalance && request.userId === leaveBalance.userId) {
        const hoursToAdd = request.hours / 8; // Convert hours to days (assuming 8-hour workday)
        setLeaveBalance(prev => prev ? { 
          ...prev, 
          compOffCount: prev.compOffCount + hoursToAdd 
        } : null);
      }
      
      return true;
    } catch (error) {
      console.error('Error approving comp-off request:', error);
      return false;
    }
  };
  
  const rejectCompOffRequest = async (id: string) => {
    if (!user || user.role !== 'manager' && user.role !== 'admin') return false;

    try {
      setCompOffRequests(prev => prev.map(req => 
        req.id === id 
          ? { ...req, status: 'rejected', approvedBy: user.id, approvedOn: new Date() } 
          : req
      ));
      return true;
    } catch (error) {
      console.error('Error rejecting comp-off request:', error);
      return false;
    }
  };
  
  // Utility function to refresh all data
  const refreshData = async () => {
    if (user) {
      // In a real app, this would fetch the latest data from MongoDB
      // For our demo with localStorage, we'll just re-fetch from localStorage
      
      // Load data from localStorage
      const storedLeaveRequests = localStorage.getItem('leaveRequests');
      const storedLeaveBalances = localStorage.getItem('leaveBalances');
      const storedHolidays = localStorage.getItem('holidays');
      const storedLeaveConfig = localStorage.getItem('leaveConfig');
      const storedWfhRequests = localStorage.getItem('wfhRequests');
      const storedCompOffRequests = localStorage.getItem('compOffRequests');
      
      // Process leave requests
      if (storedLeaveRequests) {
        try {
          const parsedRequests: LeaveRequest[] = JSON.parse(storedLeaveRequests);
          const processedRequests = parsedRequests.map(req => ({
            ...req,
            startDate: new Date(req.startDate),
            endDate: new Date(req.endDate),
            appliedOn: new Date(req.appliedOn),
            approvedOn: req.approvedOn ? new Date(req.approvedOn) : undefined
          }));
          setLeaveRequests(processedRequests);
        } catch (error) {
          console.error('Error refreshing leave requests:', error);
        }
      }
      
      // Process leave balance
      if (storedLeaveBalances) {
        try {
          const parsedBalances: LeaveBalance[] = JSON.parse(storedLeaveBalances);
          const userBalance = parsedBalances.find(balance => balance.userId === user.id);
          if (userBalance) {
            userBalance.updatedAt = new Date(userBalance.updatedAt);
            setLeaveBalance(userBalance);
          }
        } catch (error) {
          console.error('Error refreshing leave balance:', error);
        }
      }
      
      // Process holidays
      if (storedHolidays) {
        try {
          const parsedHolidays: Holiday[] = JSON.parse(storedHolidays);
          const processedHolidays = parsedHolidays.map(holiday => ({
            ...holiday,
            date: new Date(holiday.date)
          }));
          setHolidays(processedHolidays);
        } catch (error) {
          console.error('Error refreshing holidays:', error);
        }
      }
      
      // Process leave configuration
      if (storedLeaveConfig) {
        try {
          setLeaveConfiguration(JSON.parse(storedLeaveConfig));
        } catch (error) {
          console.error('Error refreshing leave configuration:', error);
        }
      }
      
      // Process WFH requests
      if (storedWfhRequests) {
        try {
          const parsedRequests: WorkFromHomeRequest[] = JSON.parse(storedWfhRequests);
          const processedRequests = parsedRequests.map(req => ({
            ...req,
            date: new Date(req.date),
            appliedOn: new Date(req.appliedOn),
            approvedOn: req.approvedOn ? new Date(req.approvedOn) : undefined
          }));
          setWfhRequests(processedRequests);
        } catch (error) {
          console.error('Error refreshing WFH requests:', error);
        }
      }
      
      // Process comp-off requests
      if (storedCompOffRequests) {
        try {
          const parsedRequests: CompOffRequest[] = JSON.parse(storedCompOffRequests);
          const processedRequests = parsedRequests.map(req => ({
            ...req,
            date: new Date(req.date),
            appliedOn: new Date(req.appliedOn),
            approvedOn: req.approvedOn ? new Date(req.approvedOn) : undefined
          }));
          setCompOffRequests(processedRequests);
        } catch (error) {
          console.error('Error refreshing comp-off requests:', error);
        }
      }
    }
  };
  
  const value = {
    leaveRequests,
    createLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    cancelLeaveRequest,
    
    leaveBalance,
    
    leaveConfiguration,
    updateLeaveConfiguration,
    
    holidays,
    addHoliday,
    removeHoliday,
    
    wfhRequests,
    createWfhRequest,
    approveWfhRequest,
    rejectWfhRequest,
    
    compOffRequests,
    createCompOffRequest,
    approveCompOffRequest,
    rejectCompOffRequest,
    
    isDateHoliday,
    calculateBusinessDays,
    refreshData
  };
  
  return <LeaveContext.Provider value={value}>{children}</LeaveContext.Provider>;
}