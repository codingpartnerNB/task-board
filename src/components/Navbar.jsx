import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/thunks';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getUserInitials } from '@/lib/utils';
import { Menu, X, ChevronDown, LogOut, User as UserIcon, Settings, LifeBuoy } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 shadow-lg ${
        scrolled 
          ? 'bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 shadow-2xl backdrop-blur-lg' 
          : 'bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 shadow-lg backdrop-blur-md'
      }`}>
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 5}s linear infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo section */}
          <div className="flex items-center group">
            <div className="flex-shrink-0 flex items-center">
              <div className="relative">
                {/* Enhanced logo glow effect */}
                <div className="absolute -inset-2 bg-purple-400/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Logo container */}
                <div className="relative z-10 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg border border-purple-400/30 group-hover:border-purple-300 transition-all duration-300">
                  <div className="absolute inset-0 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all duration-300"></div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-6 w-6 text-purple-100 group-hover:scale-110 transition-transform duration-300"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                    <rect x="9" y="9" width="6" height="6"></rect>
                    <line x1="9" y1="2" x2="9" y2="4"></line>
                    <line x1="15" y1="2" x2="15" y2="4"></line>
                    <line x1="9" y1="20" x2="9" y2="22"></line>
                    <line x1="15" y1="20" x2="15" y2="22"></line>
                    <line x1="20" y1="9" x2="22" y2="9"></line>
                    <line x1="20" y1="14" x2="22" y2="14"></line>
                    <line x1="2" y1="9" x2="4" y2="9"></line>
                    <line x1="2" y1="14" x2="4" y2="14"></line>
                  </svg>
                </div>
              </div>
              {/* Enhanced TaskBoard text */}
              <span className="ml-3 text-2xl font-bold text-white tracking-tight relative">
                <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">TaskBoard</span>
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-80"></span>
              </span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-purple-200 hover:text-white hover:bg-purple-800/30 focus:outline-none transition duration-300 ease-out"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-6">
                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 group focus:outline-none"
                  >
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-purple-500/30 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Avatar className="border-2 border-purple-400/50 group-hover:border-purple-300 transition-all duration-300 relative z-10">
                        {user.photoURL ? (
                          <AvatarImage src={user.photoURL} alt={user.displayName} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-purple-100">
                            {getUserInitials(user.displayName)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                    <span className="text-sm font-medium text-white group-hover:text-white transition-colors duration-200">
                      {user.displayName}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-purple-300 transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`} />
                  </button>

                  {/* Enhanced dropdown menu */}
                  {dropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl shadow-2xl border border-indigo-600/30 backdrop-blur-lg overflow-hidden z-50 bg-purple-600/80"
                    >
                      <div className="relative z-10">
                        <div className="py-1">
                          <a
                            href="#"
                            className="flex items-center px-4 py-3 text-sm text-purple-100 hover:bg-purple-700/50 transition-colors duration-200 group"
                          >
                            <UserIcon className="mr-3 h-5 w-5 text-purple-200 group-hover:text-purple-200 transition-colors" />
                            Your Profile
                          </a>
                          <a
                            href="#"
                            className="flex items-center px-4 py-3 text-sm text-purple-100 hover:bg-purple-700/50 transition-colors duration-200 group"
                          >
                            <Settings className="mr-3 h-5 w-5 text-purple-200 group-hover:text-purple-200 transition-colors" />
                            Settings
                          </a>
                          <a
                            href="#"
                            className="flex items-center px-4 py-3 text-sm text-purple-100 hover:bg-purple-700/50 transition-colors duration-200 group"
                          >
                            <LifeBuoy className="mr-3 h-5 w-5 text-purple-200 group-hover:text-purple-200 transition-colors" />
                            Support
                          </a>
                        </div>
                          {/* <div className="border-t border-purple-600/30">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center px-4 py-3 text-sm text-purple-100 hover:bg-purple-700/50 transition-colors duration-200 group"
                            >
                              <LogOut className="mr-3 h-5 w-5 text-purple-200 group-hover:text-purple-200 transition-colors" />
                              Sign out
                            </button>
                          </div> */}
                      </div>
                    </div>
                  )}
                </div>

                {/* Logout button */}
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  className="relative overflow-hidden bg-purple-800/40 hover:bg-purple-700/60 border-purple-600/50 text-purple-100 hover:text-white transition-all duration-300 group"
                >
                  <span className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-500 transform -translate-x-full group-hover:translate-x-0"></span>
                  <span className="relative z-10 flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </span>
                </Button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  className="relative overflow-hidden bg-purple-800/30 hover:bg-purple-700/50 border-purple-600/30 text-purple-100 hover:text-white transition-all duration-300 group"
                >
                  <span className="relative z-10">Login</span>
                </Button>
                <Button 
                  className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-medium shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started <ChevronDown className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-purple-800/95 to-indigo-800/95 border-t border-purple-600/30 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-3 sm:px-3">
            {isAuthenticated && user ? (
              <div className="flex flex-col space-y-4 px-4 py-6">
                <div className="flex items-center space-x-3">
                  <Avatar className="border-2 border-purple-400/50">
                    {user.photoURL ? (
                      <AvatarImage src={user.photoURL} alt={user.displayName} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-purple-100">
                        {getUserInitials(user.displayName)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-purple-100">{user.displayName}</p>
                    <p className="text-xs text-purple-300">{user.email}</p>
                  </div>
                </div>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-purple-100 hover:bg-purple-700/50 transition-colors duration-200 group"
                >
                  <UserIcon className="mr-3 h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors" />
                  Your Profile
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-purple-100 hover:bg-purple-700/50 transition-colors duration-200 group"
                >
                  <Settings className="mr-3 h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors" />
                  Settings
                </a>
                <Button 
                  onClick={handleLogout}
                  className="justify-start px-3 py-5 bg-purple-800/40 hover:bg-purple-700/60 text-purple-100 group"
                >
                  <LogOut className="mr-3 h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 px-2 pt-2 pb-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-center bg-purple-800/30 hover:bg-purple-700/50 border-purple-600/30 text-purple-100 hover:text-white"
                >
                  Login
                </Button>
                <Button 
                  className="w-full justify-center bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(5px); }
          100% { transform: translateY(0) translateX(0); }
        }
      `}</style>
    </header>
  );
};

export default Navbar;