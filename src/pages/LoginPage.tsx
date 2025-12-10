import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { Check, RefreshCw, DollarSign, Leaf } from 'lucide-react';
import { ROUTES } from '@/utils/constants';
import dormRoomImg from '@/assets/images/dorm_room.jpg';
import { authWithGoogle } from '@/api';
import type { User, UserSession } from '@/types';

export function LoginPage() {
  const navigate = useNavigate();
  const [googleError, setGoogleError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setGoogleError(null);
      const idToken = credentialResponse.credential;
      if (!idToken) {
        throw new Error('Google login failed: no ID token');
      }

      const response = await authWithGoogle<{
        access_token: string;
        refresh_token?: string;
        expires_in?: number;
        user: User;
      }>(idToken);

      const expiresInMs = (response.expires_in ?? 7 * 24 * 60 * 60) * 1000;
      const session: UserSession = {
        accessToken: response.access_token,
        refreshToken: response.refresh_token ?? '',
        expiresAt: new Date(Date.now() + expiresInMs),
        user: response.user,
      };

      localStorage.setItem('dormswap_auth', JSON.stringify(session));
      window.dispatchEvent(new Event('auth-updated'));

      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Login failed:', error);
      setGoogleError('Google sign-in failed. Please try again.');
    } finally {
      // no-op
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
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setGoogleError('Google sign-in failed. Please try again.')}
              useOneTap
              theme="outline"
              size="large"
              width="320"
            />
          </div>
          {googleError && (
            <p className="mt-3 text-center text-sm text-red-500">{googleError}</p>
          )}

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
