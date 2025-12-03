import { Link } from 'react-router-dom';
import { APP_NAME } from '@/utils/constants';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5">
            <span className="text-xl font-bold text-black-500">{APP_NAME}</span>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
              About Us
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
              Help Center
            </a>
            <a href="#" className="text-gray-900 font-medium transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
              FAQ
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

