import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTestCredentials, setShowTestCredentials] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const testCredentials = [
    { role: 'Admin', email: 'admin@gmail.com', password: 'password123' },
    { role: 'Employee', email: 'employee@gmail.com', password: 'password123' },
    { role: 'Manager', email: 'manager@gmail.com', password: 'password123' }
  ];

  const handleTestLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/index');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <Card className="w-full shadow-xl border border-gray-200 rounded-2xl bg-white">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription className="text-gray-500">
            Access your account to manage your leaves
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="flex gap-2 items-start">
                <AlertCircle className="h-4 w-4 mt-1" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-md border-gray-300 focus:ring-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-md border-gray-300 focus:ring-black"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-900 transition"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Test Credentials Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setShowTestCredentials(!showTestCredentials)}
        className="w-full flex items-center justify-center gap-2 text-sm"
      >
        {showTestCredentials ? (
          <>
            <ChevronUp className="h-4 w-4" />
            Hide Test Credentials
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            Show Test Credentials
          </>
        )}
      </Button>

      {/* Test Credentials Section */}
      {showTestCredentials && (
        <Card className="w-full shadow-lg border border-blue-200 rounded-xl bg-blue-50">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-lg font-semibold text-blue-800">Test Credentials</CardTitle>
            </div>
            <CardDescription className="text-blue-600">
              Use these credentials for testing purposes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {testCredentials.map((cred, index) => (
              <div key={index} className="p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {cred.role}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestLogin(cred.email, cred.password)}
                    className="text-xs h-6 px-2"
                  >
                    Use
                  </Button>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-mono text-gray-800">{cred.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Password:</span>
                    <span className="font-mono text-gray-800">{cred.password}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
