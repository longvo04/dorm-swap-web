import { useNavigate } from 'react-router-dom';
import { Check, RefreshCw, DollarSign, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/utils/constants';
import dormRoomImg from '@/assets/images/dorm_room.jpg';

interface LoginPageProps {
  onLogin: (token: string) => Promise<void>;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await onLogin('mock_google_token');
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen max-h-screen overflow-hidden flex">
      {/* Left Panel - Green */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-500 p-12 flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <span className=" text-4xl font-bold tracking-tight">DormSwap</span>
            <div className="w-6 h-6 rounded-full bg-green-400"></div>
          </div>

          {/* Hero Text */}
          <h1 className="text-white text-3xl lg:text-3xl font-light leading-tight mb-6">
            Your Campus Marketplace
          </h1>
          <p className="text-green-100 text-lg max-w-md mb-8">
            Buy, sell, and rent dorm essentials with ease. Join thousands of students making sustainable choices.
          </p>

          {/* Dorm Room Image */}
          <div className="hidden lg:block rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={dormRoomImg}
              alt="Dorm room setup"
              className="w-full h-80 object-cover"
            />
          </div>
          {/* Feature Icons */}
          <div className="flex gap-12 mt-8 justify-center">
            <div className="flex flex-col items-center text-white">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                <RefreshCw className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">Easy Trade</span>
            </div>
            <div className="flex flex-col items-center text-white">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">Save Money</span>
            </div>
            <div className="flex flex-col items-center text-white">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">Go Green</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - White */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <span className="text-green-500 text-2xl font-bold">DormSwap</span>
            <div className="w-5 h-5 rounded-full bg-teal-400"></div>
          </div>

          {/* Welcome Text */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Welcome to DormSwap
            </h2>
            <p className="text-gray-500">
              Sign in to start trading with your campus community
            </p>
          </div>

          {/* Google Sign In Button */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-4 border-gray-300 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium">Continue with Google</span>
          </Button>

          {/* Terms */}
          <p className="text-center text-sm text-gray-500 mt-6">
            By continuing, you agree to DormSwap's{' '}
            <a href="#" className="text-green-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-green-600 hover:underline">
              Privacy Policy
            </a>
          </p>

          {/* Benefits List */}
          <div className="mt-10 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Verified student community</h3>
                <p className="text-sm text-gray-500">Trade safely within your campus</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure transactions</h3>
                <p className="text-sm text-gray-500">Protected payments and messaging</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sustainable choices</h3>
                <p className="text-sm text-gray-500">Reduce waste, save money</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
