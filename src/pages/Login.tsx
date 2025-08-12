import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/index');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-6 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          LEAVE <span className="text-gray-500">LANE</span>
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Leave Management Portal</p>
      </div>
      <LoginForm />
    </div>
  );
}
