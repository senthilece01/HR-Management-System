import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { User, UserRole } from '@/types';

// Mock data for users
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Employee',
    email: 'employee@vibecoding.com',
    role: 'employee',
    department: 'Engineering',
    managerId: '2',
    joiningDate: new Date(2023, 0, 15),
    employeeType: 'full-time',
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'manager@vibecoding.com',
    role: 'manager',
    department: 'Engineering',
    joiningDate: new Date(2022, 5, 10),
    employeeType: 'full-time',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@vibecoding.com',
    role: 'admin',
    department: 'Administration',
    joiningDate: new Date(2021, 2, 5),
    employeeType: 'full-time',
  },
  {
    id: '4',
    name: 'Intern User',
    email: 'intern@vibecoding.com',
    role: 'employee',
    department: 'Engineering',
    managerId: '2',
    joiningDate: new Date(2023, 9, 1),
    employeeType: 'intern',
  }
];

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state for new user
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'employee' as UserRole,
    department: '',
    managerId: '',
    employeeType: 'full-time' as 'full-time' | 'intern' | 'trainee',
  });
  
  // Load mock users
  useEffect(() => {
    setUsers(mockUsers);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewUser({
      ...newUser,
      [name]: value
    });
  };
  
  const handleAddUser = () => {
    // In a real app, this would send data to MongoDB
    // For now, we'll just add to our local state
    
    const newUserData: User = {
      ...newUser,
      id: `user-${Date.now()}`,
      joiningDate: new Date()
    };
    
    setUsers([...users, newUserData]);
    setIsAddDialogOpen(false);
    toast.success('User added successfully');
    
    // Reset form
    setNewUser({
      name: '',
      email: '',
      role: 'employee',
      department: '',
      managerId: '',
      employeeType: 'full-time',
    });
  };
  
  // Filter managers for dropdown
  const managers = users.filter(user => user.role === 'manager' || user.role === 'admin');
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add User</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account in the system
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newUser.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => handleSelectChange('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employeeType">Employee Type</Label>
                  <Select
                    value={newUser.employeeType}
                    onValueChange={(value) => handleSelectChange('employeeType', value as 'full-time' | 'intern' | 'trainee')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="intern">Intern</SelectItem>
                      <SelectItem value="trainee">Trainee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={newUser.department}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {newUser.role === 'employee' && (
                <div className="space-y-2">
                  <Label htmlFor="managerId">Manager</Label>
                  <Select
                    value={newUser.managerId}
                    onValueChange={(value) => handleSelectChange('managerId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers.map(manager => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={handleAddUser}>
                Add User
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Joining Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell className="capitalize">{user.employeeType.replace('-', ' ')}</TableCell>
                    <TableCell>{format(new Date(user.joiningDate), 'MMM d, yyyy')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}