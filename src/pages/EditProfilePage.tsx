import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DORM_BUILDINGS, ROUTES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import type { User } from '@/types';
import { updateUserProfile } from '@/api';

interface EditProfilePageProps {
  user: User;
  onUpdateUser?: (updates: Partial<User>) => void;
}

export function EditProfilePage({ user, onUpdateUser }: EditProfilePageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: user.full_name ?? '',
    dorm_building: user.dorm_building ?? 'A3',
    dorm_room: user.dorm_room ?? '501',
  });
  const [isDormDropdownOpen, setIsDormDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const userId = user.user_id;
      if (!userId) {
        setError('Missing user id');
        setIsSubmitting(false);
        return;
      }

      await updateUserProfile({
        user_id: userId,
        full_name: formData.full_name,
        dorm_building: formData.dorm_building,
        dorm_room: formData.dorm_room,
      });

      // Update local session storage so other views refresh
      const stored = localStorage.getItem('dormswap_auth');
      if (stored) {
        try {
          const session = JSON.parse(stored);
          session.user = {
            ...session.user,
            full_name: formData.full_name,
            dorm_building: formData.dorm_building,
            dorm_room: formData.dorm_room,
          };
          localStorage.setItem('dormswap_auth', JSON.stringify(session));
          window.dispatchEvent(new Event('auth-updated'));
        } catch {
          // ignore storage errors
        }
      }

      if (onUpdateUser) {
        onUpdateUser({
          full_name: formData.full_name,
          dorm_building: formData.dorm_building,
          dorm_room: formData.dorm_room,
        });
      }

      navigate(ROUTES.PROFILE);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Link */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={ROUTES.PROFILE}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Edit Profile</span>
          </Link>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Dorm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dorm</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDormDropdownOpen(!isDormDropdownOpen)}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg flex items-center justify-between focus:ring-2 focus:ring-green-500 outline-none text-left"
                >
                  <span>{formData.dorm_building}</span>
                  <ChevronDown className={cn(
                    "h-5 w-5 text-gray-400 transition-transform",
                    isDormDropdownOpen && "rotate-180"
                  )} />
                </button>

                {isDormDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {DORM_BUILDINGS.map((dorm) => (
                      <button
                        key={dorm}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, dorm_building: dorm }));
                          setIsDormDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors",
                          formData.dorm_building === dorm && "bg-gray-50"
                        )}
                      >
                        {dorm}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Room */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
              <input
                type="text"
                value={formData.dorm_room}
                onChange={(e) => setFormData(prev => ({ ...prev, dorm_room: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white py-3"
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

