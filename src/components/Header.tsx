import { LogIn, User } from 'lucide-react';
import { useUser, SignInButton, useClerk } from '@clerk/nextjs';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Header() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3 flex-shrink-0 min-w-0">
          <Image
            src="/logo.svg"
            alt="EzyBookmark"
            width={160}
            height={32}
            className="h-8 w-auto"
          />
        </div>
        {isSignedIn ? (
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              Welcome, {user.firstName || user.emailAddresses[0].emailAddress}
            </span>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-8 h-8 bg-transparent border border-gray-800 hover:border-gray-600 rounded-full flex items-center justify-center text-gray-800 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <SignInButton mode="modal">
            <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 cursor-pointer">
              <LogIn className="w-4 h-4" />
              Login
            </button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}