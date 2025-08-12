import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarIcon, ClockIcon, HomeIcon, SettingsIcon, UserPlusIcon, UsersIcon, LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/index',
      icon: HomeIcon,
      roles: ['employee', 'manager', 'admin']
    },
    {
      name: 'My Leaves',
      href: '/leaves',
      icon: CalendarIcon,
      roles: ['employee', 'manager', 'admin']
    },
    {
      name: 'Apply for Leave',
      href: '/apply-leave',
      icon: UserPlusIcon,
      roles: ['employee', 'manager', 'admin']
    },
    {
      name: 'Work From Home',
      href: '/work-from-home',
      icon: ClockIcon,
      roles: ['employee', 'manager', 'admin']
    },
    {
      name: 'Team Leaves',
      href: '/team-leaves',
      icon: UsersIcon,
      roles: ['manager', 'admin']
    },
    {
      name: 'Admin Panel',
      href: '/admin',
      icon: SettingsIcon,
      roles: ['admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold">
            LEAVE <span className="text-gray-500">LANE</span>
          </h1> 
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto py-4">
        <nav className="flex-1 space-y-1 px-2">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                isActive(item.href)
                  ? 'bg-gray-100 text-black-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5',
                  isActive(item.href) ? 'text-black-900' : 'text-gray-500 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex w-full items-center">
          <div className="flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-black-600">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
          <div className="ml-3 flex flex-1 flex-col truncate">
            <div className="text-sm font-medium text-gray-900 truncate">{user?.name}</div>
            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => logout()}
          >
            <LogOutIcon className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}