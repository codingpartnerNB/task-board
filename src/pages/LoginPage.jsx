import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, registerUser } from '@/redux/thunks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, EyeOff, User, MailPlus, LockKeyhole, ArrowRight, ChevronRight } from 'lucide-react';

const LoginPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cardRotation, setCardRotation] = useState({ x: 0, y: 0 });

  // 3D card tilt effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });

      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * 10;
        const rotateX = ((centerY - y) / centerY) * 10;
        
        setCardRotation({ x: rotateX, y: rotateY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      dispatch(login(formData.email, formData.password));
    } else {
      dispatch(registerUser(formData.email, formData.password, formData.displayName));
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({...formData, displayName: ''});
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          />
        ))}
      </div>

      {/* Glowing orb */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600 rounded-full filter blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600 rounded-full filter blur-[100px] opacity-20 animate-pulse delay-1000"></div>

      <div className="w-full max-w-md z-10 perspective-1000">
        {/* Floating 3D card */}
        <div 
          ref={cardRef}
          className="relative transition-transform duration-300 ease-out"
          style={{
            transform: `rotateX(${cardRotation.x}deg) rotateY(${cardRotation.y}deg)`,
          }}
        >
          {/* Floating user icon with enhanced glow */}
          <div className="flex justify-center">
            <div className="relative top-12 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white/90 z-20">
              <div className="absolute inset-0 rounded-full bg-purple-400/50 animate-ping opacity-50"></div>
              <div className="absolute inset-0 rounded-full bg-purple-500/30 filter blur-xl"></div>
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 filter blur-2xl animate-pulse"></div>
              <User className="h-10 w-10 text-white" strokeWidth={1.5} />
            </div>
          </div>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl pt-16 relative">
            {/* Card glow effect */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-2xl"></div>
              <div className="absolute inset-0 border border-white/5 rounded-2xl"></div>
            </div>

            <CardHeader className="text-center space-y-1 pb-2">
              <CardTitle className="text-3xl font-bold text-white tracking-tight">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <p className="text-white/70 text-sm">
                {isLogin ? 'Sign in to your account' : 'Get started with us today'}
              </p>
            </CardHeader>

            <CardContent className="pt-4">
              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {error === "Firebase: Error (auth/invalid-credential)." ? "Invalid email or password." : error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="displayName">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-white/50" />
                      </div>
                      <Input
                        id="displayName"
                        name="displayName"
                        type="text"
                        value={formData.displayName}
                        onChange={handleChange}
                        required={!isLogin}
                        placeholder="John Doe"
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailPlus className="h-5 w-5 text-white/50" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockKeyhole className="h-5 w-5 text-white/50" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder={showPassword ? "yourpassword" : "••••••••"}
                      minLength={6}
                      className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-purple-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    {!isLogin && (
                      <div className="text-xs text-white/50">
                        Minimum 6 characters
                      </div>
                    )}
                    {isLogin && (
                      <button
                        type="button"
                        className="text-xs text-purple-300 hover:text-purple-200 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/20"
                  disabled={loading}
                >
                  {/* Button shine effect */}
                  <span className="absolute top-0 left-0 w-full h-full bg-white/10 group-hover:bg-white/20 transition-all duration-500 transform -translate-x-full group-hover:translate-x-0"></span>
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isLogin ? 'Signing in...' : 'Creating account...'}
                      </>
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2 pb-6">
              <div className="relative flex items-center justify-center w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative px-4 bg-white/5 text-xs text-white/50">
                  {isLogin ? 'New to our platform?' : 'Already have an account?'}
                </div>
              </div>

              <button
                type="button"
                onClick={toggleForm}
                className="w-full text-center text-purple-300 hover:text-purple-200 font-medium transition-colors duration-200 flex items-center justify-center gap-1 text-sm"
              >
                {isLogin ? 'Create an account' : 'Sign in instead'}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float 10s ease-in-out infinite 2s;
        }
        
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;